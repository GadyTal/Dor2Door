import React, { FC } from 'react';

type NoBorderBtnProps = {
  handleClick: () => void;
};

export const NoBorderBtn: FC<NoBorderBtnProps> = ({
  handleClick,
  children,
}) => {
  return (
    <button
      className="no-border-button"
      onClick={() => {
        handleClick();
      }}
    >
      {children}
    </button>
  );
};
