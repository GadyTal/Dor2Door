import React, { FC, useEffect, useState } from "react";
import { PrimaryBtn, MissionTypeMsg } from "../../../core";
import { usePageNavigation, useMissionState } from "../../../hooks";
import { PAGES } from "../../mission";
import { OptionsModal } from "../../../modals/";

import pinkLocationIcon from "../../../../assets/icons/pink/pink-location.png";
import { DeclineReason } from "../../../../shared/Contracts";
export const MissionRequest: FC = () => {
  const pageNavigator = usePageNavigation();
  const { mission, volunteer, missionId } = useMissionState();

  function acceptMissionHandler() {
    try {
      pageNavigator(PAGES.TERMS_1);
    } catch (e) {
      console.error('Failed to change mission state');
    }
  }

  return (
    <>
      <div className='title-hello'>היי {volunteer.volunteer.first_name} 👋</div>
      <div className='need-you'>
        יש לך אפשרות לעזור <br />ל{mission.elder_first_name}?
      </div>
      <div className='distance'>
        <img src={pinkLocationIcon} alt='location' />
        &nbsp;במרחק של {mission.distance} מטר
      </div>
      <MissionTypeMsg purpose={mission.purpose} />
      <div className='buttons-container'>
        <PrimaryBtn handleClick={acceptMissionHandler}>מתאים לי</PrimaryBtn>
        <OptionsModal
          title='בטוח?'
          elementTag='Secondary'
          cancellationOptions={[{ stringValue: 'כן, אני בטוח', reason: DeclineReason.refuse }]}
          closeBtn='PrimaryBtn'
          description='הבקשה תעבור למתנדבים אחרים'
          missionId={missionId}>
          לא מתאים לי כרגע
        </OptionsModal>
      </div>
    </>
  );
};
