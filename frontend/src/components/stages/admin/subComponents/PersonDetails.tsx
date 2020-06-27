import React, { FC } from 'react';
import recCallIcon from '../../../../assets/icons/rec-call.png';

type Props = {
  name: string;
  phone: string;
  address: string;
  address_others?: string;
};

export const PersonDetails: FC<Props> = ({
  name,
  phone,
  address,
  address_others,
}) => (
    <div className="person-details">
      <div className="person-title">
        <div className="name">{name}</div>
        <a href={`tel:${phone}`}>
          <img src={recCallIcon} alt="call" className="call-icon" />
        </a>
      </div>
      <div className="phone-number">{phone}</div>
      <div className="address">
        {address}
        {/* <span className="address others"> {address_others} </span> */}
      </div>
    </div>
  );
