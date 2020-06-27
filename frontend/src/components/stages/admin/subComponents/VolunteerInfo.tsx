import React, { FC } from 'react';
import { Detail, PersonDetails } from './';
import { Volunteer } from '../../../../shared/Contracts';

type Props = {
  volunteer: Volunteer | undefined
};

export const VolunteerInfo: FC<Props> = ({ volunteer }) => {
  // if(volunteer)
  const VolunteerMissing = <div className="volunteer-missing">עדיין מחפשים מתנדב</div>
  // const VolunteerExist = 
  const VolunteerDetails = volunteer ? <>
    <PersonDetails
      name={volunteer.first_name}
      phone={volunteer.phone_number}
      address={volunteer.address.address_str}
      // name={"שגיא חתן"}
      // phone="054-665-3433"
      // address="ירושלים, דב סדן 8"
    // address_others="(קומה 2, כניסה 4)"
    />
    <div className="details-title border"> פרטים נוספים</div>
    <Detail title="אימייל" content={volunteer.email} />
    <Detail title="גיל" content={`${volunteer.age}`} last />
  </>
    : VolunteerMissing;

  return (
    <div className="info-container">
      <div className="title-container border">
        <div className="title">מידע על המתנדב</div>
      </div>
      {VolunteerDetails}
    </div>
  );
}