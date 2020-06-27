import React, { FC } from "react";
import { Detail, PersonDetails } from "./";
import {
  Mission,
  missionsPurposeDictionary,
  HebrewDictionary,
} from "../../../../shared/Contracts";
import moment from "moment";
import { Config } from "../../../../shared/Config";

type Props = {
  mission: Mission;
};

type DetailProps = {
  title: string;
  content: string;
  last?: boolean;
};

export const ElderInfo: FC<Props> = ({ mission }) => {
  const wantedTimeTranslations: any = {
    morning: "בוקר",
    afternoon: "צהריים",
    evening: "ערב",
  };

  const detailsList: DetailProps[] = [
    {
      title: "מה המבקש צריך",
      content: missionsPurposeDictionary[mission.purpose],
    },
    { title: "נקודת איסוף ספציפית", content: mission.pickup_point },
    {
      title: "האם יש צורך לעבור אצל מבקש הסיוע לפני",
      content: HebrewDictionary[mission.is_elder_need_visit_before],
    },
    { title: "תאריך ביצוע הבקשה", content: mission.scheduled_to_date },
    { title: "שעות מועדפות", content: wantedTimeTranslations[mission.prefered_hours] },
    { title: "אופי התשלום", content: HebrewDictionary[mission.payment_method] },
    { title: "סטטוס השתנה לאחרונה", content: moment(mission.state_last_updated_at).format(Config.dateTimeFormat) },
    { title: "הערות ומידע נוסף", content: mission.description, last: true },
  ];
  
  return (
    <>
      <div className="info-container">
        <div className="title-container border">
          <div className="title">מידע על מבקש הסיוע</div>
          <div className="date">{mission.scheduled_to_date}</div>
        </div>
        <PersonDetails
          name={`${mission.elder_first_name} ${mission.elder_last_name}`}
          phone={mission.elder_phone_number}
          address={mission.elder_address!.address_str}
        // address_others="(קומה 2, כניסה 4)" //address others field?!@
        />
        <div className="details-title border"> פרטי בקשה</div>
        {detailsList.map((detail, index) => (
          <Detail
            key={index}
            content={detail.content}
            title={detail.title}
            last={index === detailsList.length - 1}
          />
        ))}
      </div>
    </>
  );
};
