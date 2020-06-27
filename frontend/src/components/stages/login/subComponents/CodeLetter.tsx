import React, { FC, useCallback } from "react";

type CodeLetterProp = {
  letterIndex: number;
  placeholder: string;
  focus: boolean;
  handleInput: (value: string, index: number) => void;
  value?: string;
  error: boolean;
};

export const CodeLetter: FC<CodeLetterProp> = ({
  letterIndex,
  placeholder,
  focus,
  handleInput,
  value,
  error,
}) => {
  const selectInput = useCallback((e: any) => {
    if (e && e.target) {
      e.target.type = "tel";
      e.target.setSelectionRange(0, 1);
      e.target.type = "tel";
    }
  }, []);

  const handleBlur = useCallback((e: any) => {
    e.target.type = "tel";
  }, []);

  const handleKeyUp = useCallback(
    (e: any) => {
      const isPressingBackspaceOnEmptyLetter =
        e.keyCode === 8 && e.target.value === "";
      if (isPressingBackspaceOnEmptyLetter) {
        handleInput("", letterIndex);
      }
    },
    [handleInput, letterIndex]
  );

  return (
    <input
      ref={(input) => input && focus && input.focus()}
      autoFocus={focus}
      className={`one-letter-input ${
        error ? " error" : value !== "" ? " filled" : ""
      }`}
      onClick={selectInput}
      onFocus={selectInput}
      onBlur={handleBlur}
      onChange={(e: any) => handleInput(e.target.value, letterIndex)}
      onKeyUp={handleKeyUp}
      placeholder={placeholder}
      value={value}
      type='tel'
      inputMode='tel' 
      pattern="[0-9]*"
    />
  );
};
