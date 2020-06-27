import React, { FC, createContext, useState } from "react";
import { StageRenderer } from "../../core";
import { PhoneValidation } from "./pages/PhoneValidation";
import { VerificationCode } from "./pages/VerificationCode";
import { PersonalDetailsForm } from "./pages/PersonalDetailsForm";
import { RegistrationCompleted } from "./pages/RegistrationCompleted";
import { ActivityEssence } from './pages/ActivityEssence';

export const PAGES = {
  PHONE_VALIDATION: 1,
  VERIFICATION_CODE: 2,
  PERSONAL_DETAILS: 3,
  ACTIVITY_ESSENCE: 4,
  REGISTRATION_COMPLETED: 5,
};

const pagesDictionary: { [key: number]: FC } = {
  [PAGES.PHONE_VALIDATION]: PhoneValidation,
  [PAGES.VERIFICATION_CODE]: VerificationCode,
  [PAGES.ACTIVITY_ESSENCE]: ActivityEssence,
  [PAGES.PERSONAL_DETAILS]: PersonalDetailsForm,
  [PAGES.REGISTRATION_COMPLETED]: RegistrationCompleted,
};

type LoginContextType = [string, React.Dispatch<React.SetStateAction<string>>];

export const LoginContext = createContext<LoginContextType>(["", () => { }]);

const LoginComponent: FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <LoginContext.Provider value={[phoneNumber, setPhoneNumber]}>
      <StageRenderer
        pages={pagesDictionary}
        startingPage={PAGES.PHONE_VALIDATION}
        wrapperClass='login-component-container page-padding'
      />
    </LoginContext.Provider>
  );
};

export default LoginComponent;
