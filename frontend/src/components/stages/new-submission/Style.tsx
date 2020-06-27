import React from "react";
import { Children } from "./Children";
import { useHistory } from "react-router-dom";
import cx from "classnames";
import style from "./NewSubmission.module.scss";

export function Space({ horizontal = false, size = "1em" }) {
  return <div style={{ [horizontal ? "width" : "height"]: size }} />;
}

export function Stack(props: { children: Children; spacing?: string }) {
  const allChildren = React.Children.toArray(props.children);
  return (
    <>
      {allChildren.map((child, i) => {
        return (
          <React.Fragment key={i}>
            {child}
            {i < allChildren.length - 1 && <Space size={props.spacing} />}
          </React.Fragment>
        );
      })}
    </>
  );
}

export function useMeasureSize<Type extends HTMLElement>(
  ref: React.RefObject<Type>
) {
  const [rect, setRect] = React.useState<DOMRect | null>(null);

  React.useLayoutEffect(() => {
    const clientRect = ref?.current?.getBoundingClientRect();
    if (clientRect) {
      setRect(clientRect);
    }
  }, [ref]);

  return rect;
}

export function Header(props: { canGoBack?: boolean; children: Children }) {
  const history = useHistory();
  const headerRef = React.useRef<HTMLHeadingElement>(null);
  const headerSizes = useMeasureSize(headerRef);

  return (
    <>
      <h3
        style={{
          backgroundColor: "#34314F",
          margin: 0,
          color: "#fff",
          fontSize: "1.5em",
          fontWeight: "normal",
          paddingTop: "1em",
          paddingBottom: ".75em",
          textAlign: "right",
          zIndex: 1000,
          width: "100%",
          paddingRight: "1em",
          position: "fixed",
        }}
        ref={headerRef}
      >
        {!props.canGoBack ? (
          <Space size={"1.5em"} />
        ) : (
          <>
            <div
              role="button"
              onClick={() => history.goBack()}
              style={{ cursor: "pointer", display: "inline-block" }}
            >
              <GoBackIcon />
            </div>
            <Space size={"0.5em"} />
          </>
        )}
        {props.children}
      </h3>
      {headerSizes && <div style={{ height: headerSizes.height }} />}
    </>
  );
}

function GoBackIcon() {
  return (
    <svg
      width="31"
      height="24"
      style={{ height: "1em", fontSize: "1em" }}
      viewBox="0 0 31 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.23995 9.98369H23.5836L17.4073 3.80737C16.6073 3.00737 16.6073 1.72737 17.4073 0.959877C17.791 0.576133 18.3036 0.383621 18.8473 0.383621C19.3911 0.383621 19.9036 0.607372 20.2873 0.991109L29.8873 10.6237C30.6873 11.4237 30.6873 12.7037 29.8873 13.4712L20.2873 23.1039C19.9036 23.4876 19.3911 23.6801 18.8473 23.6801C18.3036 23.6801 17.791 23.4876 17.4073 23.1039C17.0236 22.7201 16.7998 22.2076 16.7998 21.6639C16.7998 21.1201 17.0236 20.6076 17.3761 20.2239L23.5834 14.0165H2.23975C1.11975 14.0165 0.223499 13.1203 0.223499 12.0003C0.223499 10.8803 1.11975 9.98401 2.23975 9.98401L2.23995 9.98369Z"
        fill="white"
      />
    </svg>
  );
}

export function Description(props: { children: Children }) {
  return (
    <p
      style={{
        fontFamily: "Rubik",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "16px",
        lineHeight: "19px",
        textAlign: "right",
        margin: 0,
      }}
    >
      {props.children}
    </p>
  );
}

export function SectionTitle(props: {
  children: Children;
  passRef?: React.Ref<HTMLHeadingElement>;
}) {
  return (
    <h4
      ref={props.passRef}
      style={{
        fontSize: "25px",
        margin: 0,
        textAlign: "right",
        lineHeight: "30px",
        paddingLeft: "5%",
        paddingRight: "5%",
      }}
    >
      {props.children}
    </h4>
  );
}

export function SectionSubtitle(props: { children: Children }) {
  return (
    <h5
      style={{
        fontSize: "20px",
        margin: 0,
        textAlign: "right",
        lineHeight: "30px",
        color: "#7C7B92",
      }}
    >
      {props.children}
    </h5>
  );
}

export function Section(props: {
  children: Children;
  /** defaults to `squared` */
  borderType?: "rounded" | "squared";
  handleClick?: any;
}) {
  let borderType = props.borderType ? props.borderType : "squared";
  return (
    <div
      className={cx(style.section, style[borderType])}
      onClick={props.handleClick}
    >
      {props.children}
    </div>
  );
}
