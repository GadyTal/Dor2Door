import React, { FC } from 'react';

import requestNavigationImage from '../../assets/images/req-nav.png';
import thanksImage from '../../assets/images/thanks.png';
import mainImage from '../../assets/images/main.png';
import homeImage from '../../assets/images/home.png';
import whatsappVerify from '../../assets/images/whatsapp-verify.png';
import requestCallImage from '../../assets/images/req-call.png';
import agreementImage from '../../assets/images/main.png';
import loginImg from '../../assets/images/phone.png';
import VerifyImg from '../../assets/images/verify.png';


import D2DLogo from '../../assets/images/Door2Dor.png';
import helpingImg from '../../assets/images/helping.png';

type MainImageProps = {
  componentName: string;
  customizedwidth?: string;
  customizedheight?: string;
};

const imagesDictionary: { [key: string]: string } = {
  MissionInProgress: requestNavigationImage,
  MissionStopped: thanksImage,
  MissionCompleted: thanksImage,
  Dashboard: homeImage,
  LastMission: thanksImage,
  WhatsappSignup: whatsappVerify,
  MakeACall: requestCallImage,
  MissionAgreement: agreementImage,
  VerificationCode: VerifyImg,
  PhoneValidation: loginImg,
  CallCenter: D2DLogo,
  RegistrationCompleted: helpingImg
};

export const MainImage: FC<MainImageProps> = ({
  componentName,
  customizedheight,
  customizedwidth,
}) => {
  return (
    <img
      src={imagesDictionary[componentName]}
      className="main-image"
      alt={`${componentName}`}
      style={{ height: customizedheight, width: customizedwidth }}
    />
  );
};
