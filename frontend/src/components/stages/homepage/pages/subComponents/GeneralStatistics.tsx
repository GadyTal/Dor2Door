import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

type GeneralStatisticsProps = {
  volunteers_count: number,
  elders_count: number
}
export const GeneralStatistics: FC<GeneralStatisticsProps> = ({ volunteers_count, elders_count }) => {
  const { t } = useTranslation();

  return (<div className="stats-container">
    <div className="right-stat-container">
      <p className="title">{t("מבקשי סיוע")}</p>
      <p className="amount">{elders_count}</p>
    </div>
    <div className="left-stat-container">
      <p className="title">{t("מתנדבים")}</p>
      <p className="amount">{volunteers_count}</p>
    </div>
  </div>)
};
