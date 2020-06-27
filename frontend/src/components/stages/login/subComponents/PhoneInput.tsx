import React, { FC } from 'react';

type PhoneNumberProps = {
  handleChange: any;
  error: boolean;
};
export const PhoneInput: FC<PhoneNumberProps> = ({ handleChange, error }) => {
  const onChange = (e: any) => {
    const newValue = toformattedValue(fromFormattedValue(e.target.value));
    e.target.value = newValue;
    handleChange(fromFormattedValue(newValue!));
  };
  const toformattedValue = (phoneNumber: string) => {
    const phoneLength = phoneNumber.length;

    if (phoneLength < 4) {
      return phoneNumber;
    }

    if (phoneLength >= 4 && phoneLength < 7) {
      return `${phoneNumber.substr(0, 3)}-${phoneNumber.substr(3)}`;
    }

    if (phoneLength >= 7 && phoneLength <= 10) {
      return `${phoneNumber.substr(0, 3)}-${phoneNumber.substr(
        3,
        3
      )}-${phoneNumber.substr(6)}`;
    }
  };

  const fromFormattedValue = (formattedPhoneNumber: string) => {
    return formattedPhoneNumber.split('-').join('');
  };

  return (
    <input
      type="tel"
      className={`input-phone${error ? ' error' : ''}`}
      placeholder="054-000-1234"
      autoFocus={true}
      maxLength={12}
      onChange={onChange}
    />
  );
};
