import React, { FC, useState, useEffect } from "react";
import { BackArrow, MainImage } from "../../../core";
import { usePageNavigation, usePhoneNumberState } from "../../../hooks";
import { PAGES } from "../";
import {
  ServerValidateOTP,
  ServerRequestOTP,
} from "../../../../services/Login.service";
import { ButtonsContainer } from "../subComponents/ButtonsContainer";
import { ErrorContainer } from "../../../../shared/Contracts";
import { setError, setNoError } from "../../../../services/error.service";
import { CodeLetters } from "../subComponents/CodeLetters";
import { UserRoles } from "../../../../shared/Responses.Contracts";
import { useHistory } from "react-router-dom";
import { getRouteBack } from "../../../../services/webApi.service";
import { Config } from "../../../../shared/Config";
import { useTranslation } from "react-i18next";

const SECONDS_TO_RESEND = 10;

export const VerificationCode: FC = () => {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const OTP_AMOUNT = 4;
  const pageNavigator = usePageNavigation();
  const phoneNumber = usePhoneNumberState()[0];
  const [canSendCodeAgain, setCanSendCodeAgain] = useState<boolean>(false);

  const [OTP, setOTP] = useState("");
  const [errorContainer, setErrorContainer] = useState<ErrorContainer>(
    setNoError()
  );
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (canSendCodeAgain === false) {
      setTimeout(() => setCanSendCodeAgain(true), SECONDS_TO_RESEND * 1000);
    }
  }, [canSendCodeAgain, setCanSendCodeAgain]);

  const handleCodeResend = async () => {
    setLoading(true);
    await ServerRequestOTP(phoneNumber);
    setCanSendCodeAgain(false);
    setLoading(false);
  };
  const submitCodeLetters = async () => {
    if (OTP.length < OTP_AMOUNT) {
      setErrorContainer(setError(t("קוד חסר")));
      return;
    }

    try {
      setLoading(true);
      const response = await ServerValidateOTP(phoneNumber, OTP);
      if (!response) {
        // New user
        pageNavigator(PAGES.ACTIVITY_ESSENCE);
      } else {
        // check if have any saved routes in local storage
        let backRoutes: any = getRouteBack();
        if (backRoutes) {
          return window.location.href = backRoutes;
        }
        switch (response) {
          case UserRoles.USER:
            history.push(Config.AppRoutes.Homepage);
            break;
          case UserRoles.COORDINATOR_MANAGER:
          case UserRoles.COORDINATOR:
            history.push(Config.AppRoutes.Coordinator);
            break;
          case UserRoles.ADMIN:
            history.push(Config.AppRoutes.Coordinator);
            break;
          default:
            console.error("User doesn't have any role!!!");
            break;
        }
      }
    } catch (e) {
      let errorType = e.type;
      if (errorType === 403) {
        errorType = t("קוד שגוי. אנא נסה שנית");
      } else if (errorType === 408) {
        errorType = t("קוד אינו תקף. התחבר בשנית");
      } else if (errorType === 422) {
        errorType = t("ישנה בעיה בשרת. אנא נסה שנית");
      } else {
        errorType = e.err;
      }
      setErrorContainer(setError(errorType));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BackArrow handleClick={() => pageNavigator(PAGES.PHONE_VALIDATION)} />
      <div className='title'>{t("קוד אימות")}</div>
      <MainImage componentName='VerificationCode' />
      <CodeLetters
        amount={OTP_AMOUNT}
        setCode={setOTP}
        error={errorContainer.active}
      />
      <div>
        <button
          className='send-again-label'
          disabled={!canSendCodeAgain}
          onClick={handleCodeResend}
        >
          {t("שלחו לי שוב")}
        </button>
      </div>
      <ButtonsContainer
        handleClick={submitCodeLetters}
        btnTitle={t('אישור')}
        errorContainer={errorContainer}
        isLoading={isLoading}
      />
    </>
  );
};
