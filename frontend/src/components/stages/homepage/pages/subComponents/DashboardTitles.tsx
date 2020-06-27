import React, { FC } from "react";
import { useTranslation } from "react-i18next";

type DashboardTitlesProps = {
  firstName: string;
  missionsAmount: number;
};
export const DashboardTitles: FC<DashboardTitlesProps> = ({
  firstName,
  missionsAmount,
}) => {
  const { t } = useTranslation();

  return (
    <div className='homepage-titles-container'>
      <div className='title'>
        {t('שלום')}, {firstName} &#128075;
      </div>
      <div className='missions-amount-label'>
        {t("עד כה ביצעת")} <b>{missionsAmount}</b> {t("התנדבויות")!}
      </div>
    </div>
  );
};
