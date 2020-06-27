import React, { FC } from 'react';

import backIcon from '../../assets/icons/back.png';

type backArrowProps = {
  handleClick: () => void;
};

export const BackArrow: FC<backArrowProps> = ({ handleClick }) => (
  <>
    <img
      className="back-button"
      src={backIcon}
      alt="back"
      onClick={handleClick}
    />
  </>
);
