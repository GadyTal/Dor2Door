import React, { FC } from "react";
import { SecondaryBtn } from "../../core";
import { useModalNavigation } from "../../hooks";
import { SETTINGS_PAGES } from "../SettingsModal";
import { useTranslation } from "react-i18next";

export const MainMenu: FC = () => {
  const { t } = useTranslation()
  const modalNavigator = useModalNavigation();
  return (
    <>
      <SecondaryBtn
        handleClick={() => modalNavigator(SETTINGS_PAGES.DETAILS_EDIT)}
      >
      {t("עריכת פרטים")}
      </SecondaryBtn>
      <SecondaryBtn
        handleClick={() => modalNavigator(SETTINGS_PAGES.NOTIFICATIONS)}
      >
        {t("התראות")}
      </SecondaryBtn>
      <SecondaryBtn
        handleClick={() => modalNavigator(SETTINGS_PAGES.CONTACT_US)}
      >
        {t("צור קשר")}
      </SecondaryBtn>

      <div className='text-container'>
        <a href="https://docs.google.com/document/d/e/2PACX-1vQQDj6FSqZODsGPFWYlg_w3Aak80LkQ1yIzq3tk9bvRLWaJ5c5gQicsFrJNv-SK52nx3iSXctuW94uP/pub"
          target="_blank" rel="noopener noreferrer">
          <span className='small-text right'>{t("הצהרת פרטיות")}&nbsp;</span>
          {"    ·    "}
          <span className='small-text left '>&nbsp;{t("תנאי שימוש")}</span>
        </a>
      </div>
    </>
  );
};
