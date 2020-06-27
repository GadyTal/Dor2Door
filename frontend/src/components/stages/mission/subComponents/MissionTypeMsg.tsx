import React, { FC } from "react";

import generalMissionIcon from "../../../../assets/icons/missions/general.png";
import pharmMissionIcon from "../../../../assets/icons/missions/pharm.png";
import shoppingMissionIcon from "../../../../assets/icons/missions/shopping.png";

import { MissionPurpose, Mission } from "../../../../shared/Contracts";

type missionDescription = {
  iconImage: string;
  description: string;
};
const missionsDictionary: { [key in MissionPurpose]: missionDescription } = {
  general: { iconImage: generalMissionIcon, description: "כללי" },
  grocery: { iconImage: shoppingMissionIcon, description: "קניות מהסופר" },
  grocery_and_pharmacy: {
    iconImage: shoppingMissionIcon,
    description: "קניות סופר ומרקחת",
  },
  pharmacy: { iconImage: pharmMissionIcon, description: "בית מרקחת" },
};

type MissionPurposeProps = {
  purpose: MissionPurpose;
};

export const MissionTypeMsg: FC<MissionPurposeProps> = ({ purpose }) => {
  return (
    <div className="image-container">
      <img
        src={missionsDictionary[purpose].iconImage}
        alt="request"
        className="main-image"
      />
      <div className="image-text-container">
        <div className="title">{missionsDictionary[purpose].description}</div>
        <div className="text">
          בשלב הבא תוכלו להתקשר
          <br /> ולהבין בדיוק במדובר
        </div>
      </div>
    </div>
  );
};
