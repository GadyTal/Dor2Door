import React from "react";

type InputAttributes = React.InputHTMLAttributes<HTMLInputElement>;

export function Input(props: {
  type?: string;
  demoInput?: string;
  onChange: InputAttributes["onChange"];
  value: string;
  inputRef?: React.Ref<HTMLInputElement>;
  placeholder: string;
  required?: boolean;
  name: string;
  error?: string;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
}) {
  return (
    <div
      {...props.containerProps}
      style={{ position: "relative", ...props.containerProps?.style }}
    >
      <span
        style={{
          position: "absolute",
          top: 0,
          opacity: props.value.trim() ? 1 : 0,
          transition: "all 200ms ease",
          transitionProperty: "opacity, transform",
          right: "1em",
          transform: props.value.trim()
            ? "translate(0, -50%)"
            : "translate(0, 50%)",
          pointerEvents: "none",
          backgroundColor: "#fff",
          paddingLeft: "2px",
          paddingRight: "2px",
          color: props.error ? "#EB5757" : "#000",
        }}
      >
        {props.placeholder}
      </span>
      {props.required && (
        <span
          style={{
            position: "absolute",
            top: "0.5em",
            right: "0.5em",
            color: "#EB5757",
            fontSize: "0.75em",
          }}
        >
          *
        </span>
      )}
      <input
        name={props.name}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          fontSize: "1em",
          fontFamily: "Rubik",
          padding: "1em",
          boxSizing: "border-box",
          background: !props.value.trim() ? "#F9F9F9" : undefined,
          border: "1px solid #BDBDBD",
          borderColor: props.error ? "#EB5757" : "#BDBDBD",
          borderRadius: ".5em",
        }}
        placeholder={props.demoInput ?? props.placeholder}
        type={props.type ?? "text"}
        ref={props.inputRef}
        value={props.value}
        onChange={props.onChange}
      />
      {props.error && (
        <span
          style={{
            position: "absolute",
            bottom: 0,
            left: "1em",
            color: "#EB5757",
            paddingLeft: "2px",
            paddingRight: "2px",
            backgroundColor: "#fff",
            transform: "translate(0, 50%)",
          }}
        >
          {props.error}
        </span>
      )}
    </div>
  );
}
