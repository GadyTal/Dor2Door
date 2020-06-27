import React, { FC } from 'react';

type SecondaryBtnProps = {
  handleClick: any;
};

export const SecondaryBtn: FC<SecondaryBtnProps> = ({
  handleClick,
  children,
}) => {
  return (
    <button className="secondary-button" onClick={handleClick}>
      {children}
    </button>
  );
};
