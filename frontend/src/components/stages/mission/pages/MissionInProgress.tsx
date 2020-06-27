import React, { FC, useState, useEffect } from 'react';
import { PrimaryBtn, SpecialActionBtn, MainImage } from '../../../core';
import { usePageNavigation, useMissionState } from '../../../hooks';
import { PAGES } from '..';
import { OptionsModal } from '../../../modals/';

import purpleLocationIcon from '../../../../assets/icons/purple/purple-location.png';
import { MissionState, DeclineReason, Mission } from '../../../../shared/Contracts';
import { ChangeMissionState } from '../../../../services/Mission.service';
import { getVolunteerMission } from '../../../../services/Volunteer.service';
import { CircularProgress } from '@material-ui/core';
export const MissionInProgress: FC = () => {
  const pageNavigator = usePageNavigation();
  let { mission, volunteer, missionId, setMission } = useMissionState();
  const [buttonActive, setButtonActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')
  const TIME_TO_ACTIVATE = 60 * 1000;
  // TODO - with the server get coords or split to different properties
  // ALSO fix contract with server
  console.log("MissionInProgress:FC -> mission", mission)

  useEffect(() => {
    const timer = setTimeout(() => {
      setButtonActive(true);
    }, TIME_TO_ACTIVATE);
    return () => clearTimeout(timer);
  }, [setButtonActive, TIME_TO_ACTIVATE]);

  const fullElderAddress = mission.elder_address && mission.elder_address.address_str;
  const elderAddress = mission.elder_address && fullElderAddress.split('\n')?.length > 1 ? fullElderAddress.split('\n')[0] : fullElderAddress;
  const volunteerAdderss = mission.elder_address && volunteer.volunteer ? volunteer.volunteer.address.address_str : volunteer.address.address_str;

  function handleCompleteMission() {
    ChangeMissionState(mission.uuid, MissionState.completed);
    pageNavigator(PAGES.MISSION_COMPLETED)
  }
  return (
    <>{mission?.elder_address ? <>
      <div className="title">יצאנו לדרך</div>
      <MainImage componentName="MissionInProgress" />
      <p className="medium-text">לא לשכוח לעדכן אותנו כשסיימת!</p>
      <a href={`https://maps.google.com/maps?saddr=${elderAddress}&daddr=${volunteerAdderss}`} target="_blank" rel="noopener noreferrer"
      className="navigation-link-a">
        <SpecialActionBtn handleClick={() => { }} imgSrc={purpleLocationIcon}>
          פתח ניווט
      </SpecialActionBtn>
      </a>

      <div className="buttons-container">
        <PrimaryBtn
          handleClick={async () => {
            try {
              await handleCompleteMission()
            } catch (e) {
              // TODO - error handling
              console.error(e);
            }
          }

          }
        // disabled={!buttonActive}
        >
          סיום התנדבות
        </PrimaryBtn>
        <OptionsModal
          elementTag="NoBorder"
          title="ביטול התנדבות"
          cancellationOptions={
            [{ stringValue: 'לא, אין צורך', reason: DeclineReason.not_relevant },
            { stringValue: 'כן, עדיין רלוונטי', reason: DeclineReason.refuse }]
          }
          closeBtn="X"
          description="האם לשלוח למתנדב אחר?"
          missionId={missionId}
        >
          בטל התנדבות
        </OptionsModal>
      </div>
    </>
      : errorMessage ? <div>{errorMessage}</div> : <CircularProgress />}
    </>
  );
};
