import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const WaitForACallMsg: FC = () => {
  const { t } = useTranslation();

  return (<div className="homepage-msg-container">
    {t("נשלח לך הודעת SMS")}
    <br />
      {t("ברגע שנזהה התנדבות באיזורך")}
  </div>
  )
};
