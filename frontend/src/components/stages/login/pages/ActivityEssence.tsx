import React, { FC, useState } from "react";
import { PrimaryBtn, MainImage } from "../../../core";
import { usePageNavigation, useMissionState } from "../../../hooks";
import { PAGES } from "..";

import { TermsModal, OptionsModal } from "../../../modals";
import { Section, Space, Stack } from "../../new-submission/Style";
import {
  CheckboxLabel,
  CheckboxIcon,
  CheckboxText,
} from "../../new-submission/Checkbox";
import { Login_ActivityEssence } from "../../../../shared/MicroCopy";
import { useTranslation } from "react-i18next";

export const ActivityEssence: FC = () => {
  const { t, i18n } = useTranslation();
  const pageNavigator = usePageNavigation();
  type checkboxProps = {
    title: string;
  };

  const checkboxesMap: { [key: number]: checkboxProps } = {
    0: { title: Login_ActivityEssence.Checkbox0 },
    1: { title: Login_ActivityEssence.Checkbox1 },
  };

  const [checkboxesValues, setCheckboxesValues] = useState({
    0: false,
    1: false,
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        flex: 1,
      }}
    >
      <div>
        <Stack>
          <div className="essence-title">{t("מהות הפעילות")}</div>
          <div className="essence-description">
            {" "}
            {Login_ActivityEssence.Decription}
          </div>
          <Section
            borderType="rounded"
            handleClick={() =>
              setCheckboxesValues({
                ...checkboxesValues,
                [0]: !Object.values(checkboxesValues)[0],
              })
            }
          >
            <Stack>
              <CheckboxLabel
                checked={Object.values(checkboxesValues)[0]}
                onStateChange={() =>
                  setCheckboxesValues({
                    ...checkboxesValues,
                    [0]: !Object.values(checkboxesValues)[0],
                  })
                }
              >
                <CheckboxIcon />
                <Space horizontal />
                <CheckboxText type="thin">
                  {t(checkboxesMap[0].title)}
                </CheckboxText>
              </CheckboxLabel>
            </Stack>
          </Section>
          <Section
            borderType="rounded"
            handleClick={() =>
              setCheckboxesValues({
                ...checkboxesValues,
                [1]: !Object.values(checkboxesValues)[1],
              })
            }
          >
            <Stack>
              <CheckboxLabel
                checked={Object.values(checkboxesValues)[1]}
                onStateChange={() =>
                  setCheckboxesValues({
                    ...checkboxesValues,
                    [1]: !Object.values(checkboxesValues)[1],
                  })
                }
              >
                <CheckboxIcon />
                <Space horizontal />
                <CheckboxText type="thin">
                  {t(checkboxesMap[1].title)}
                  <a
                    className="terms-button-small"
                    target="_blank"
                    href="https://docs.google.com/document/d/e/2PACX-1vQQDj6FSqZODsGPFWYlg_w3Aak80LkQ1yIzq3tk9bvRLWaJ5c5gQicsFrJNv-SK52nx3iSXctuW94uP/pub"
                  >
                    {t("לתנאי השימוש ואת מדיניות הפרטיות")}
                  </a>
                </CheckboxText>
              </CheckboxLabel>
            </Stack>
          </Section>
        </Stack>
      </div>
      <div className="buttons-container">
        <PrimaryBtn
          handleClick={() => pageNavigator(PAGES.PERSONAL_DETAILS)}
          disabled={Object.values(checkboxesValues).some((i) => i === false)}
        >
          {t("המשך")}
        </PrimaryBtn>
      </div>
    </div>
  );
};
