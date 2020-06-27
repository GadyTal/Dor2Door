import React from "react";
import "./simple-dropdown.scss";
import { Children } from "./Children";

export function DropdownContainer(props: {
  children: Children;
  value: any;
  onChange(value: any): void;
  disabled?: boolean;
}) {
  const onChange = React.useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      props.onChange(JSON.parse(event.target.value));
    },
    [props.onChange]
  );

  return (
    <select
      className="simple-dropdown"
      value={JSON.stringify(props.value)}
      onChange={onChange}
      disabled={props.disabled}
    >
      {props.children}
    </select>
  );
}

export function Option(props: { value: any; children: Children }) {
  return <option value={JSON.stringify(props.value)}>{props.children}</option>;
}
