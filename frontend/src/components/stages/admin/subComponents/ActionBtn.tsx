import React, { FC } from 'react';

type ActionBtnProps = {
  handleClick: () => void;
  disabled?:boolean;
};

export const ActionBtn: FC<ActionBtnProps> = ({
  handleClick,
  children,
  disabled
}) => {
  return (
    <button className="action-button" onClick={handleClick} disabled={disabled}>
      {children}
    </button>
  );
};
