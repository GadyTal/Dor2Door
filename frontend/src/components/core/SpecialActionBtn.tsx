import React, { FC } from 'react';

type SpecialActionBtnProps = {
  handleClick: () => void;
  imgSrc: string;
};

//Login stage special action button (for call and navigation buttons)

export const SpecialActionBtn: FC<SpecialActionBtnProps> = ({
  handleClick,
  imgSrc,
  children,
}) => {
  return (
    <button className="special-action-button" onClick={handleClick}>
      <img src={imgSrc} alt="action" />
      &nbsp;{children}
    </button>
  );
};
