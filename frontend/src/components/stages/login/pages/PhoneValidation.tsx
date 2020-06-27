import React, { FC, useState } from 'react';
import { PhoneInput, MainImage } from '../../../core';
import { usePageNavigation, usePhoneNumberState } from '../../../hooks';
import { PAGES } from '../';
import { Config } from '../../../../shared/Config';
import { ServerRequestOTP } from '../../../../services/Login.service';
import { ButtonsContainer } from '../subComponents/ButtonsContainer';
import { ErrorContainer } from '../../../../shared/Contracts';
import { setError, setNoError } from '../../../../services/error.service';
import { useTranslation } from 'react-i18next';
import { handleDirection } from '../../../../i18n';

const {
  phone: phoneValidator,
  universalPhone: universalPhoneValidator,
} = Config.Reggex;
const phoneIsValid = (phone: string) => phone.match(phoneValidator);
const universalPhoneIsValid = (phone: string) =>
  phone.match(universalPhoneValidator);

const modifyToUniversalPhone = (phone: string) => phone.replace('0', '972');
export const PhoneValidation: FC = () => {
  const { t, i18n } = useTranslation();
  const pageNavigator = usePageNavigation();
  const [phoneNumber, setPhoneNumber] = usePhoneNumberState();

  const [errorContainer, setErrorContainer] = useState<ErrorContainer>(
    setNoError()
  );
  const [isLoading, setLoading] = useState<boolean>(false);

  const sumbitPhoneNumber = async () => {
    if (
      !phoneIsValid(phoneNumber) ||
      !universalPhoneIsValid(modifyToUniversalPhone(phoneNumber))
    ) {
      setErrorContainer(setError(t('מספר לא חוקי')));
      return;
    } else {
      setErrorContainer(setNoError());
    }
    setLoading(true)
    const universalPhoneNumber = modifyToUniversalPhone(phoneNumber);
    setPhoneNumber(universalPhoneNumber);
    // TODO - error handling
    try {
      const response = await ServerRequestOTP(universalPhoneNumber);
      setLoading(false)
      pageNavigator(PAGES.VERIFICATION_CODE);
    } catch (e) {
      setLoading(false)
      setErrorContainer(setError(t('נכשל בשליחת SMS')));
    }

  };

  const changeLanguage = (lng: string) => {
    // Save lang in local storage
    localStorage.setItem(Config.languagePrefix, lng);
    i18n.changeLanguage(lng);
    handleDirection(lng);
  }

  return (
    <>
      <div className="title">{t('אימות מספר טלפון')}</div>
      <MainImage componentName="PhoneValidation" />
      <PhoneInput handleChange={setPhoneNumber} error={errorContainer.active} />
      <ButtonsContainer
        handleClick={sumbitPhoneNumber}
        btnTitle={t('שלחו לי קוד אימות')}
        errorContainer={errorContainer}
        isLoading={isLoading}
      />
      {/* Todo - languages compoent */}

      <div style={{position: 'absolute', bottom: '5px', display: 'flex', fontSize: '10px'}}>
        <div onClick={() => changeLanguage('heb')}>עברית</div>
        &nbsp; &nbsp; | &nbsp; &nbsp;
        <div onClick={() => changeLanguage('en')}>English</div>
      </div>
    </>
  );
};
