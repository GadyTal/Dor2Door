import React from "react";
import cx from "classnames";
import "./radio-button.scss";
import { Children } from "./Children";

const RadioButtonContext = React.createContext({
  onSelect(_value: string) {},
  value: "",
});

export function RadioButtons(props: {
  onSelect(value: string): void;
  children: Children;
  value: string;
}) {
  return (
    <RadioButtonContext.Provider
      value={{
        onSelect: props.onSelect,
        value: props.value,
      }}
    >
      {props.children}
    </RadioButtonContext.Provider>
  );
}

export function RadioButton(props: { children: Children; value: string }) {
  const radioButtonsCfg = React.useContext(RadioButtonContext);
  const onSelect = React.useCallback(
    () => radioButtonsCfg.onSelect(props.value),
    [radioButtonsCfg.onSelect]
  );
  const checked = radioButtonsCfg.value === props.value;

  return (
    <button
      onClick={onSelect}
      type="button"
      role="radio"
      className={cx("radio-button", { checked })}
    >
      <Circle checked={checked} style={{ marginLeft: "1em" }} />
      {props.children}
    </button>
  );
}

function Circle(props: {
  checked: boolean;
  style?: React.SVGAttributes<SVGElement>["style"];
}) {
  return (
    <svg
      width="22"
      height="22"
      style={{ ...props.style, verticalAlign: "top" }}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {props.checked ? (
        <>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.0003 0.166748C5.02033 0.166748 0.166992 5.02008 0.166992 11.0001C0.166992 16.9801 5.02033 21.8334 11.0003 21.8334C16.9803 21.8334 21.8337 16.9801 21.8337 11.0001C21.8337 5.02008 16.9803 0.166748 11.0003 0.166748ZM11.0003 19.6667C6.21199 19.6667 2.33366 15.7884 2.33366 11.0001C2.33366 6.21175 6.21199 2.33342 11.0003 2.33342C15.7887 2.33342 19.667 6.21175 19.667 11.0001C19.667 15.7884 15.7887 19.6667 11.0003 19.6667ZM16.417 11.0001C16.417 13.9916 13.9919 16.4167 11.0003 16.4167C8.00878 16.4167 5.58366 13.9916 5.58366 11.0001C5.58366 8.00854 8.00878 5.58342 11.0003 5.58342C13.9919 5.58342 16.417 8.00854 16.417 11.0001Z"
            fill="url(#paint0_linear)"
          />
          <defs>
            <linearGradient
              id="paint0_linear"
              x1="3.1143"
              y1="-1.96124"
              x2="22.3153"
              y2="-0.880709"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#5B53DC" />
              <stop offset="1" stopColor="#6C63FF" />
            </linearGradient>
          </defs>
        </>
      ) : (
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.166992 11.0001C0.166992 5.02008 5.02033 0.166748 11.0003 0.166748C16.9803 0.166748 21.8337 5.02008 21.8337 11.0001C21.8337 16.9801 16.9803 21.8334 11.0003 21.8334C5.02033 21.8334 0.166992 16.9801 0.166992 11.0001ZM2.33366 11.0001C2.33366 15.7884 6.21199 19.6667 11.0003 19.6667C15.7887 19.6667 19.667 15.7884 19.667 11.0001C19.667 6.21175 15.7887 2.33342 11.0003 2.33342C6.21199 2.33342 2.33366 6.21175 2.33366 11.0001Z"
          fill="#89899C"
        />
      )}
    </svg>
  );
}
