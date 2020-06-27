import React, { FC } from 'react';
import leftArrowIcon from '../../../../assets/icons/left-arrow-purple.png';
import {
  missionsPurposeDictionary,
  MissionState,
  HebrewDictionary,
  DeclineReason,
} from '../../../../shared/Contracts';

type Props = {
  time: string;
  date: string;
  name: string;
  missionState: MissionState; //should be changed to a dictionary with specific types
  handleClick?: any;
  errorState?: DeclineReason;

};

const hoursDic: any = {
  "morning": 'בוקר',
  "afternoon": 'צהריים',
  "evening": 'ערב'
}

export const MissionPreview: FC<Props> = ({
  time,
  date,
  name,
  missionState,
  handleClick,
  errorState
}) => {
  const StickyLabelMsg = missionState ? missionState === 'error' ?
    HebrewDictionary[errorState!] : HebrewDictionary[missionState] : 'שגיאה טכנית';

  return (
    <div className="mission-preview-container" onClick={handleClick}>
      <div className="time">{`${date} - ${hoursDic[time]}`}</div>
      <div className="name">
        {name}
        <div className="left-arrow">
          <img src={leftArrowIcon} alt="open" />
        </div>
      </div>
      <div className={`state-color-label ${missionState}`}>
        {StickyLabelMsg}
      </div>
    </div>
  );
}
