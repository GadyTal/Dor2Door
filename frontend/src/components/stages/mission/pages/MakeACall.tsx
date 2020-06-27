import React, { FC, useState, useEffect } from 'react';
import {
  PrimaryBtn,
  SpecialActionBtn,
  MainImage,
  NoBorderBtn,
} from '../../../core';
import { usePageNavigation, useMissionState } from '../../../hooks';
import { PAGES } from '..';
import { OptionsModal, InstructionsModal } from '../../../modals/';

import purpleCallIcon from '../../../../assets/icons/purple/purple-call.png';
import { DeclineReason, Mission, MissionState } from '../../../../shared/Contracts';
import { ChangeMissionState } from '../../../../services/Mission.service';
import { CircularProgress } from '@material-ui/core';
import { getVolunteerMission } from '../../../../services/Volunteer.service';

export const MakeACall: FC = () => {
  const pageNavigator = usePageNavigation();
  const { mission, missionId, setMission }: { mission: Mission, missionId: string, setMission: Function } = useMissionState();
  const [buttonsDisplay, setButtonsDisplay] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    console.log('use effect in make a call');
    // http call for update mission with the new state
    getVolunteerMission(missionId).then((mission: any) => {
      setMission(mission);
      setIsLoading(false);
    }, (e: any) => {
      // TODO - fix error handling here
      setIsLoading(false);
      setErrorMessage(e);
    })
  }, []);

  const additionalContactLabel = <>
    {mission.additional_contact_email ? <NoBorderBtn handleClick={() => { }}>איש קשר נוסף</NoBorderBtn>
      : null
    }</>


  const handleStartMission = () => {
    // change mission state into started
    try {
      ChangeMissionState(missionId, MissionState.started)
      pageNavigator(PAGES.MISSION_IN_PROGRESS)
    }
    catch{
      // TODO - error handling
    }
  }
  const buttonsContainer = (
    <>
      <div className="buttons-container">
        <PrimaryBtn
          handleClick={handleStartMission}>
          מעולה, אני רוצה לעזור
        </PrimaryBtn>
        <OptionsModal
          elementTag="Secondary"
          title="ביטול התנדבות"
          cancellationOptions={[
            { stringValue: 'לא היה מענה', reason: DeclineReason.no_one_answered },
            { stringValue: 'בקשת הסיוע כבר לא רלוונטית', reason: DeclineReason.not_relevant },
            { stringValue: 'פחות מתאים לי', reason: DeclineReason.refuse },
          ]}
          closeBtn="X"
          description="נשמח לשמוע מה קרה"
          missionId={missionId}        >
          אולי בפעם אחרת
        </OptionsModal>
      </div>
    </>
  );

  return (
    <>{isLoading ? errorMessage ? <div>{errorMessage}</div> : <CircularProgress /> : <>
      <div className="title">תיאום ציפיות</div>
      <MainImage componentName="MakeACall" />
      <div className="medium-text">
        בשיחה בדקו מה בדיוק {mission.elder_first_name} צריכ\ה <br />
        וכיצד מתכוונ\ת לשלם
      </div>
      {buttonsDisplay ? (
        <SpecialActionBtn
          handleClick={() => {
            setButtonsDisplay(true);
          }}
          imgSrc={purpleCallIcon}
        >
          <a href={`tel:+${mission.elder_phone_number}`}> חייג שוב </a>
        </SpecialActionBtn>
      ) : (
          <InstructionsModal handleClick={() => setButtonsDisplay(true)} />
        )}
      {buttonsDisplay ? buttonsContainer : null}
    </>}</>
  );
};
