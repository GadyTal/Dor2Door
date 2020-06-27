import React, { FC } from 'react';

import { WhatsappBtn } from '../../../../core/';

type SignUpMsgProps = {
  handleClick: () => void;
};

export const WhatsappSignupMsg: FC<SignUpMsgProps> = ({ handleClick }) => (
  <div className="whatsapp-msg-container">
    אנו צריכים את אישורך לקבלת <br />
    קריאות להתנדבות ל-WhatsApp
    <WhatsappBtn handleClick={handleClick} />
  </div>
);
