import React, { FC } from "react";

import { PrimaryBtn } from "../../../core";
import { ErrorContainer } from "../../../../shared/Contracts";
import { CircularProgress } from "@material-ui/core";

type ButtonsContainerProps = {
  handleClick: any;
  btnTitle: string;
  errorContainer: ErrorContainer;
  isLoading: boolean;
  disabled?: boolean;
};

export const ButtonsContainer: FC<ButtonsContainerProps> = ({
  handleClick,
  btnTitle,
  errorContainer,
  isLoading,
  disabled, 
}) => {
  const { active, message } = errorContainer;
  const errorTitle = <p className={`error-title ${active ? '' : 'hide'}`}>{message}</p>;
  return (
    <div className={`buttons-container ${active ? 'error' : ''}`}>
      {active && errorTitle}
      <div className='single-btn-container'>
        <PrimaryBtn handleClick={handleClick} disabled={disabled}>
          {isLoading ? <CircularProgress size="1em" /> : btnTitle}
        </PrimaryBtn>
      </div>
    </div>
  );
};
