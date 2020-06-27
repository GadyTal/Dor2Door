import React, { FC } from 'react';

type PrimaryBtnProps = {
  handleClick: () => void;
  disabled?: boolean;
};

export const PrimaryBtn: FC<PrimaryBtnProps> = ({
  handleClick,
  children,
  disabled,
}) => {
  return (
    <button
      className="primary-button"
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
