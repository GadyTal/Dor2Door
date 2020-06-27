import React, { FC } from 'react';

import backRightWhiteIcon from '../../assets/icons/right-arrow-white.png';
import backRightPurpleIcon from '../../assets/icons/right-arrow-purple.png';

type Props = {
  handleClick: () => void;
  color: 'white' | 'purple';
};

export const AdminBackArrow: FC<Props> = ({ handleClick, color }) => (
    <img
      className="back-button-admin"
      src={color === 'white' ? backRightWhiteIcon : backRightPurpleIcon}
      alt="back"
      onClick={handleClick}
    />
);
