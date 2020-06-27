import React, { FC, useState } from 'react';
import { CodeLetter } from './CodeLetter';

type CodeLettersProps = {
  amount: number;
  setCode: (code: string) => void;
  error: boolean;
};

const getInitialState = (amount: number) => {
  const initialState = [];

  for (let i = 0; i < amount; i++) {
    initialState.push('');
  }

  return initialState;
};

export const CodeLetters: FC<CodeLettersProps> = ({
  amount,
  setCode,
  error,
}) => {
  const [letters, setLetters] = useState<string[]>(getInitialState(amount));
  const [focusedLetterIdx, setFocusedLetterIdx] = useState<number>(0);

  const onCodeLetterChange = (value: string, index: number) => {
    // We proceed only if it's a valid number. We check if it's empty in case we deleted the letter
    if (value !== '' && !Number.isInteger(parseInt(value))) {
      return;
    }

    // Make sure it's only 1 letter
    let newLetter = value;
    if (newLetter.length > 1) {
      newLetter = value.slice(0, 1);
    }

    // Set the new letter
    const newLetters = letters.map((oldLetter, idx) =>
      idx === index ? newLetter : oldLetter
    );

    setLetters(newLetters);

    // In case we deleted a letter, focus on the previous letter. Otherwise go forward
    const interval = newLetter !== '' ? 1 : -1;
    setFocusedLetterIdx(index + interval);

    // Send back to the parent
    setCode(newLetters.join(''));
  };

  return (
    <div className="code-letters-container">
      {letters.map((value, index) => (
        <CodeLetter
          key={`letter_${index}`}
          placeholder={`${index + 1}`}
          focus={index === focusedLetterIdx}
          handleInput={onCodeLetterChange}
          letterIndex={index}
          value={value}
          error={error}
        />
      ))}
    </div>
  );
};
