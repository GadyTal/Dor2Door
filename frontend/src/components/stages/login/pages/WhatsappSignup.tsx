import React, { FC } from "react";
import { usePageNavigation } from "../../../hooks";
import { PAGES } from "../";

import { WhatsappBtn, BackArrow, MainImage } from "../../../core/";
import { useHistory } from "react-router-dom";

export const WhatsappSignup: FC = () => {
  const pageNavigator = usePageNavigation();
  const history = useHistory();

  return (
    <>
      <BackArrow handleClick={() => pageNavigator(PAGES.PERSONAL_DETAILS)} />
      <MainImage
        componentName="WhatsappSignup"
        customizedwidth="30vh"
        customizedheight="30vh"
      />
      <div className="title">שלב אחרון</div>
      <p className="whatsapp-text">
        ברגע שתהיה התנדבות קרובה אליך,
        <br />
        נשלח לך הודעת WhatsApp.
      </p>
      <WhatsappBtn
        handleClick={() => {
          history.push("../homepage");
        }}
      />
      <p className="whatsapp-text bottom">
        מבטיחים לא להציק
        <span role="img" aria-label="thanks">
          🤗
        </span>
      </p>
    </>
  );
};
