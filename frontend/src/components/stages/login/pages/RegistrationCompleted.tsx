import React, { FC } from 'react';
import { usePageNavigation } from '../../../hooks';
import { PAGES } from '..';

import { WhatsappBtn, BackArrow, MainImage, PrimaryBtn } from '../../../core';
import { useHistory } from 'react-router-dom';
import { Config } from '../../../../shared/Config';
import { useTranslation } from 'react-i18next';

export const RegistrationCompleted: FC = () => {
  const { t, i18n } = useTranslation();
  const pageNavigator = usePageNavigation();
  const history = useHistory();

  return (
    <>
      {/* <BackArrow handleClick={() => pageNavigator(PAGES.PERSONAL_DETAILS)} /> */}
      <div className="title complete">{t("מזל טוב, נרשמת!")} </div>
      <MainImage
        componentName="RegistrationCompleted"
        customizedheight="auto"
        customizedwidth="35%"
      />
      <div className="titles-container">
        <div className="title what-now">{t("מה עכשיו?")}</div>
        <p className="sub-title">
        {t("האפליקציה שלנו עובדת על בסיס מיקום גיאוגרפי, כשתהיה בקשה לסיוע בסביבת מקום המגורים שלך")}
          <br />
          <b>{t("נשלח לך SMS.")}</b>
          <br />
           {t("אל דאגה! זה יקרה בקרוב")} 💜
      </p>
      </div>
      <div className="buttons-container">
        <PrimaryBtn
          handleClick={() => {
            history.push(Config.AppRoutes.Homepage);
          }}>{t("דף הבית")}</PrimaryBtn>
      </div>

    </>
  );
};
