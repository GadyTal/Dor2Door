import React from "react";
import { PrimaryBtn } from "../../core";
import { Stack } from "./Style";
import { Children } from "./Children";

export type Result<O, E> = { _tag: "err"; error: E } | { _tag: "ok"; value: O };

export type ErroredField = {
  title: string;
  ref: React.RefObject<{ focus(): void }>;
};

export function NextStepButton<T>(props: {
  result: Result<T, ErroredField[]>;
  onNext(value: T): void;
  children?: Children;
}) {
  const result = props.result;

  return (
    <Stack>
      {result._tag === "err" && (
        <span
          style={{
            color: "#EB5757",
            fontWeight: "bold",
          }}
        >
          {result.error
            .map((error, i, arr) => {
              if (arr.length > 1 && i === arr.length - 1) {
                return `ו${error.title}`;
              }
              return error.title;
            })
            .join(", ")}
          {result.error.length > 1 ? " חסרים" : " חסר"}
        </span>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <PrimaryBtn
          handleClick={() => {
            if (result._tag === "err") {
              result.error[0].ref?.current?.focus();
            } else {
              props.onNext(result.value);
            }
          }}
        >
          {props.children ?? "לשלב הבא"}
        </PrimaryBtn>
      </div>
    </Stack>
  );
}
