import React, { FC } from 'react';
import { usePageNavigation } from '../../../hooks';
import { PAGES } from '..';

import { BackArrow, MainImage } from '../../../core/';

import pinkCallIcon from '../../../../assets/icons/pink/pink-call.png';
import pinkLocationIcon from '../../../../assets/icons/pink/pink-location.png';

export const LastMission: FC = () => {
  const pageNavigation = usePageNavigation();

  // const state = useHomepageState();

  return (
    <>
      <div className="last-mission-component-container">
        <BackArrow handleClick={() => pageNavigation(PAGES.DASHBOARD)} />

        <div className="description-container">
          <div className="title"> התנדבות אחרונה</div>
          <MainImage componentName="LastMission" />
        </div>
        <div className="details-buttons-container">
          <div className="title-name">
            {/* {state.lastMission?.owner} */}
            רחל גפן
          </div>
          <div className="details-button">
            <img src={pinkCallIcon} width="40px" alt="call" /> &nbsp;&nbsp;
            {/* {state.lastMission?.owner?.phone_number} */}
            052-5504-330
          </div>
          <div className="details-button">
            <img src={pinkLocationIcon} width="40px" alt="location" />
            &nbsp;&nbsp;
            {/* {state.lastMission?.owner?.address_str} */}
            תל אביב, החשמונאים 99
          </div>
        </div>
      </div>
    </>
  );
};
