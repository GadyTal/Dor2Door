import React, { FC } from "react";
import cx from "classnames";

type InputAttributes = React.InputHTMLAttributes<HTMLInputElement>;

type FormInputProps = {
  id?: string;
  title?: string;
  name: string;
  hasError: boolean;
  placeholder: string;
  handleChange?: InputAttributes["onChange"];
  handleClick?: InputAttributes["onClick"];
  handleKeyDown?: InputAttributes["onKeyDown"];
  required?: boolean;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  inputProps?: InputAttributes;
  shallow?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
  value?: string;
};

export const FormInput: FC<FormInputProps> = ({
  id,
  title,
  name,
  hasError,
  placeholder,
  handleChange,
  handleClick,
  handleKeyDown,
  required,
  containerProps,
  inputProps,
  shallow,
  inputRef,
  value,
}) => {
  const requiredLabel = required && (
    <span
      style={{
        color: "red",
        position: "absolute",
        paddingRight: "1em",
        paddingTop: ".5em",
        right: "1em",
      }}
    >
      *
    </span>
  );
  let cssTitle = name === "first_name" || name === "last_name" ? 'name' : name;
  return (
    <div
      {...containerProps}
      style={{
        position: "relative", // TODO: figure out what's broken because of it
        ...containerProps?.style,
      }}
    >
      {title && <p className='form-title'>{title} </p>}
      {requiredLabel}
      <input
        value={value}
        id={id}
        required={required}
        className={cx("form-input", cssTitle, {
          error: hasError,
          required,
          shallow,
        })}
        name={name}
        placeholder={placeholder}
        autoFocus={name === "name"}
        onChange={handleChange}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        {...inputProps}
      />
    </div>
  );
};
