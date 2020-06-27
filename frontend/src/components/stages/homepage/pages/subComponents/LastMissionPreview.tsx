import React, { FC } from "react";

import { useMissionState, usePageNavigation, useHomepageState } from "../../../../hooks/";
import leftArrowIcon from "../../../../../assets/icons/left-arrow-grey.png";
import matchIcon from "../../../../../assets/icons/match.png";

import { PAGES } from "../..";

export const LastMissionPreview: FC = () => {
  const state = useHomepageState();
  const pageNavigation = usePageNavigation();
  return (
    <div className='last-mission-preview'>
      <div className='last-mission-title'>התנדבות אחרונה</div>
      <div
        className='last-mission-container'
        onClick={() => pageNavigation(PAGES.LAST_MISSION)}
      >
        <img src={matchIcon} alt='thanks' />
        <div className='titles-container'>
          <p className='title'>{state?.last_mission_elder_first_name}</p>
          {/* Doesnt show  */}
          {/* <p className='address'>{"תל אביב ישראל"}</p> */}
        </div>
        <img src={leftArrowIcon} className='left-arrow' alt='back' />
      </div>
    </div>
  );
};
