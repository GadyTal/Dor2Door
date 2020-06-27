import React, { FC } from 'react';

import backIcon from '../../assets/icons/close.png';

type XCloseBtnProps = {
  handleClick: () => void;
};

export const XCloseBtn: FC<XCloseBtnProps> = ({ handleClick, children }) => (
  <img
    className="close-button"
    src={backIcon}
    alt="close"
    onClick={handleClick}
  />
);
