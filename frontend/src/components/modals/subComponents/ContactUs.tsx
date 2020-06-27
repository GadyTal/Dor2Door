import React, { FC } from 'react';

import whatsappIcon from '../../../assets/icons/whatsapp2.png';
import CallIcon from '../../../assets/icons/purple/purple-call2.png';
import emailIcon from '../../../assets/icons/purple/purple-email2.png';

import { SecondaryBtn } from '../../core';
import { Stack } from '../../stages/new-submission/Style';
type contactType = {
  title: string;
  iconSrc: string;
  href: any;
  handleClick: () => void;
};

const contactDetails: contactType[] = [
  // {
  //   title: 'Whatsapp',
  //   iconSrc: whatsappIcon,
  //   handleClick: () => {},
  // },
  {
    title: 'תתקשרו אלינו',
    iconSrc: CallIcon,
    href: 'tel:+972772231220',
    handleClick: () => { },
  },
  {
    title: 'שליחת אימייל',
    iconSrc: emailIcon,
    handleClick: () => { },
    href: 'mailto:info@door2dor.co.il',
  },
];

export const ContactUs: FC = () => (
  <>
    <Stack>

      {contactDetails.map((contact, i) => (

        <SecondaryBtn handleClick={contact.handleClick} key={i}>
          <a href={contact.href}>
            <img src={contact.iconSrc} width="18px" alt={`${contact.iconSrc}`} />
        &nbsp;
        {contact.title}
          </a>
        </SecondaryBtn>
      ))}
    </Stack>
  </>
);
