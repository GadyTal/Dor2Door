import React, { FC } from 'react';

import whatsappIcon from '../../assets/icons/white-whatsapp.png';

type whatsappBtnProps = {
  handleClick: () => void;
};

export const WhatsappBtn: FC<whatsappBtnProps> = ({ handleClick }) => (
  <button
    className="whatsapp-verify-button"
    onClick={() => {
      handleClick();
      // alert("signed for whatsapp");
    }}
  >
    <img src={whatsappIcon} className="whatsapp-icon" alt="whatsapp" />
    שלחו לי התנדבויות
  </button>
);
