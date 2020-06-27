import React, { FC, useState } from "react";
import { PrimaryBtn } from "../../../core";
import { usePageNavigation, useMissionState } from "../../../hooks";
import { PAGES } from "..";
import { OptionsModal } from "../../../modals";
import { Section, Space, Stack } from "../../new-submission/Style";
import {
  CheckboxLabel,
  CheckboxIcon,
  CheckboxText,
} from "../../new-submission/Checkbox";
import { Mission_Terms } from "../../../../shared/MicroCopy";
import { DeclineReason } from "../../../../shared/Contracts";

export const Terms_1: FC = () => {
  const pageNavigator = usePageNavigation();
  const missionState = useMissionState();

  type checkboxProps = {
    title: string;
  };

  const checkboxesMap: { [key: number]: checkboxProps } = {
    0: { title: Mission_Terms.Checkbox0 },
    1: { title: Mission_Terms.Checkbox1 },
    2: { title: Mission_Terms.Checkbox2 },
    3: { title: Mission_Terms.Checkbox3 },
  };

  const [checkboxesValues, setCheckboxesValues] = useState({
    0: false,
    1: false,
    2: false,
    3: false,
  });

  const termsLabel = <div className="terms-button">לפירוט המלא של התקנון</div>;
  const termsSmallLabel = (
    <div className="super-small-text">
      לחיצה על כפתור זה מהווה הסכמה &nbsp;
      <a
        className="terms-button-small"
        target="_blank"
        href="https://docs.google.com/document/d/e/2PACX-1vQQDj6FSqZODsGPFWYlg_w3Aak80LkQ1yIzq3tk9bvRLWaJ5c5gQicsFrJNv-SK52nx3iSXctuW94uP/pub"
      >
        לתנאי השירות
      </a>
      {/* <label className="terms-button-small"></label> */}
    </div>
  );

  return (
    <>
      <div className="title">לפני שמתחילים</div>
      <div className="description">
        ישנם מספר נהלים עליהם נצטרך להקפיד: הבריאות והבטיחות של כולנו חשובה לנו.
        <p className="sub-title2"> היבטים בריאותיים 💜</p>
      </div>
      <div className="text-container">
        <Stack>
          {Object.keys(checkboxesMap).map((key, index) => (
            <Section
              borderType="rounded"
              key={index}
              handleClick={() =>
                setCheckboxesValues({
                  ...checkboxesValues,
                  [key]: !Object.values(checkboxesValues)[index],
                })
              }
            >
              <Stack>
                <CheckboxLabel
                  checked={Object.values(checkboxesValues)[index]}
                  onStateChange={() =>
                    setCheckboxesValues({
                      ...checkboxesValues,
                      [key]: !Object.values(checkboxesValues)[index],
                    })
                  }
                >
                  <CheckboxIcon />
                  <Space horizontal />
                  <CheckboxText type="thin">
                    {checkboxesMap[index].title}
                  </CheckboxText>
                </CheckboxLabel>
              </Stack>
            </Section>
          ))}
        </Stack>
      </div>
      <div className="buttons-container">
        {termsSmallLabel}
        <PrimaryBtn
          handleClick={() => pageNavigator(PAGES.TERMS_2)}
          disabled={Object.values(checkboxesValues).some((i) => i === false)}
        >
          המשך
        </PrimaryBtn>
        <OptionsModal
          title="בטוח?"
          elementTag="Secondary"
          cancellationOptions={[
            { stringValue: "כן, אני בטוח", reason: DeclineReason.refuse },
          ]}
          closeBtn="PrimaryBtn"
          description="הבקשה תעבור למתנדבים אחרים"
          missionId={missionState.missionId}
        >
          ביטול
        </OptionsModal>
      </div>
    </>
  );
};
