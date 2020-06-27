import React from "react";
import { Space, Stack } from "./Style";
import { PrimaryBtn } from "../../core";
import { useHistory } from "react-router-dom";
import style from "./Success.module.scss";

export function SuccessPage() {
  const history = useHistory();
  return (
    <div className={style.container}>
      <Stack>
        <>
          <Checkmark width="9em" />
          <Space size="0.5em" />
        </>
        <h1 className={style.heading}>הבקשה נשלחה</h1>
        <p className={style.paragraph}>בקרוב נמצא לך מתנדב</p>
        <PrimaryBtn handleClick={() => history.push("/")}>עמוד הבית</PrimaryBtn>
      </Stack>
    </div>
  );
}

function Checkmark({ width = "1em" }) {
  return (
    <svg
      style={{ width }}
      viewBox="0 0 136 136"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="68" cy="68" r="68" fill="#27AE60" />
      <path
        d="M107.652 51.3712C107.652 50.0921 107.14 48.813 106.219 47.8921L99.261 40.9338C98.3401 40.0128 97.061 39.5012 95.7819 39.5012C94.5028 39.5012 93.2237 40.0128 92.3028 40.9338L58.7394 74.5484L43.6972 59.4551C42.7763 58.5341 41.4972 58.0225 40.2181 58.0225C38.939 58.0225 37.6599 58.5341 36.739 59.4551L29.7807 66.4133C28.8598 67.3343 28.3481 68.6134 28.3481 69.8925C28.3481 71.1715 28.8598 72.4506 29.7807 73.3716L48.302 91.8929L55.2602 98.8511C56.1812 99.7721 57.4603 100.284 58.7394 100.284C60.0185 100.284 61.2976 99.7721 62.2185 98.8511L69.1768 91.8929L106.219 54.8503C107.14 53.9294 107.652 52.6503 107.652 51.3712Z"
        fill="white"
      />
    </svg>
  );
}
