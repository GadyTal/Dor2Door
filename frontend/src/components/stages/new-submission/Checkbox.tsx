import React from "react";
import { Children } from "./Children";
import style from "./Checkbox.module.scss";
import cx from "classnames";

const CheckboxContext = React.createContext({
  checked: false,
});

export function CheckboxLabel(props: {
  onStateChange(value: boolean): void;
  children: Children;
  checked: boolean;
}) {
  const toggle = React.useCallback(() => {
    props.onStateChange(!props.checked);
  }, [props.onStateChange, props.checked]);

  return (
    <CheckboxContext.Provider value={{ checked: props.checked }}>
      <div
        role="checkbox"
        aria-checked={props.checked}
        onClick={toggle}
        className={style.label}
      >
        {props.children}
      </div>
    </CheckboxContext.Provider>
  );
}

export function CheckboxText(props: {
  children: Children;
  /** Defaults to `bold` */
  type?: "thin" | "bold" | "normal";
}) {
  const type = props.type ? props.type : "bold";
  return <span className={cx(style.text, style[type])}>{props.children}</span>;
}

export function CheckboxIcon() {
  const checked = React.useContext(CheckboxContext).checked;

  if (!checked)
    return (
      <svg
        style={{ minWidth: "2em" }}
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d)">
          <rect x="5" y="4" width="28" height="28" rx="6" fill="white" />
          <rect
            x="5.5"
            y="4.5"
            width="27"
            height="27"
            rx="5.5"
            stroke="url(#paint0_linear)"
          />
        </g>
        <defs>
          <filter
            id="filter0_d"
            x="0"
            y="0"
            width="40"
            height="40"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset dx="1" dy="2" />
            <feGaussianBlur stdDeviation="3" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.4 0 0 0 0 0.364706 0 0 0 0 0.94902 0 0 0 0.35 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow"
              result="shape"
            />
          </filter>
          <linearGradient
            id="paint0_linear"
            x1="8.80882"
            y1="1.24999"
            x2="33.6225"
            y2="2.64636"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#5B53DC" />
            <stop offset="1" stopColor="#6C63FF" />
          </linearGradient>
        </defs>
      </svg>
    );

  return (
    <svg
      width="40"
      height="40"
      style={{ minWidth: "2em" }}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d)">
        <rect x="5" y="4" width="28" height="28" rx="6" fill="#6C63FF" />
        <rect
          x="5.5"
          y="4.5"
          width="27"
          height="27"
          rx="5.5"
          stroke="url(#paint0_linear)"
        />
      </g>
      <path
        d="M16.4062 23.75C16.7188 24.0625 17.25 24.0625 17.5625 23.75L26.75 14.5625C27.0625 14.25 27.0625 13.7188 26.75 13.4062L25.625 12.2812C25.3125 11.9688 24.8125 11.9688 24.5 12.2812L17 19.7812L13.4688 16.2812C13.1562 15.9688 12.6562 15.9688 12.3438 16.2812L11.2188 17.4062C10.9062 17.7188 10.9062 18.25 11.2188 18.5625L16.4062 23.75Z"
        fill="white"
      />
      <defs>
        <filter
          id="filter0_d"
          x="0"
          y="0"
          width="40"
          height="40"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dx="1" dy="2" />
          <feGaussianBlur stdDeviation="3" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.4 0 0 0 0 0.364706 0 0 0 0 0.94902 0 0 0 0.35 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear"
          x1="8.80882"
          y1="1.24999"
          x2="33.6225"
          y2="2.64636"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#5B53DC" />
          <stop offset="1" stopColor="#6C63FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}
