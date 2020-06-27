import React from "react";
import { Children } from "./Children";
import style from "./step.module.scss";
import cx from "classnames";

export function Steps(props: { children: Children }) {
  return <div className={style.stepsContainer}>{props.children}</div>;
}

export function StepSeparator(props: { after?: true }) {
  return (
    <div className={cx(style.stepsBetween, { [style.next]: props.after })} />
  );
}

export type StepState = "previous" | "current" | "next";

export function StepIcon(props: { number: number; state: StepState }) {
  return (
    <div style={{ position: "relative", fontSize: "1.5em" }}>
      <svg
        width="32"
        style={{ width: "1em" }}
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="16"
          cy="16"
          r="16"
          fill={props.state === "next" ? "#C7C6D4" : "url(#paint0_linear)"}
        />
        {props.state === "previous" && (
          <path
            d="M22.9196 13.3393C22.9196 13.1161 22.8304 12.8929 22.6696 12.7321L21.4554 11.5179C21.2946 11.3571 21.0714 11.2679 20.8482 11.2679C20.625 11.2679 20.4018 11.3571 20.2411 11.5179L14.3839 17.3839L11.7589 14.75C11.5982 14.5893 11.375 14.5 11.1518 14.5C10.9286 14.5 10.7054 14.5893 10.5446 14.75L9.33036 15.9643C9.16964 16.125 9.08036 16.3482 9.08036 16.5714C9.08036 16.7946 9.16964 17.0179 9.33036 17.1786L12.5625 20.4107L13.7768 21.625C13.9375 21.7857 14.1607 21.875 14.3839 21.875C14.6071 21.875 14.8304 21.7857 14.9911 21.625L16.2054 20.4107L22.6696 13.9464C22.8304 13.7857 22.9196 13.5625 22.9196 13.3393Z"
            fill="white"
          />
        )}
        <defs>
          <linearGradient
            id="paint0_linear"
            x1="4.35294"
            y1="-3.14287"
            x2="32.7114"
            y2="-1.54701"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#5B53DC" />
            <stop offset="1" stopColor="#6C63FF" />
          </linearGradient>
        </defs>
      </svg>
      {props.state !== "previous" && (
        <span
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-45%, -60%)",
            fontFamily: "Rubik",
            color: "white",
            fontSize: ".5em",
            fontWeight: "bold",
          }}
        >
          {props.number}
        </span>
      )}
    </div>
  );
}
