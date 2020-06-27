import React, { FC, useState, useCallback, useEffect } from "react";
import formatDate from "date-fns/format";
import { FormInput } from "../../../core";
import { usePageNavigation, usePhoneNumberState } from "../../../hooks";
import { PAGES } from "../";
import { ButtonsContainer } from "../subComponents/ButtonsContainer";
import { AddressesAutocomplete } from "../subComponents/AddressesAutocomplete";
import { createVolunteer } from "../../../../../src/services/Volunteer.service";
import { PersonalDetails } from "../../../../shared/Contracts";
import { ErrorContainer } from "../../../../shared/Contracts";
import { setError, setNoError } from "../../../../services/error.service";
import { DatePicker } from "@material-ui/pickers";
import {
  inputIsValidEmail,
  inputIsNotEmpty,
  inputIsValidName,
  inputAbove18
} from "../../../../shared/formValidator";
import { AutocompleteRes } from "../../new-submission/useAddressAutocomplete";
import { useTranslation } from 'react-i18next';


const setInitialFormInput = (name: string) => ({
  name,
  value: "",
  hasError: false,
});

const initialFormState: PersonalDetails = {
  first_name: setInitialFormInput("first_name"),
  last_name: setInitialFormInput("last_name"),
  email: setInitialFormInput("email"),
  birthday: setInitialFormInput("birthday"),
  address_str: setInitialFormInput("address_str"),
};


export const PersonalDetailsForm: FC = () => {
  const { t, i18n } = useTranslation();
  const pageNavigator = usePageNavigation();
  const phoneNumber = usePhoneNumberState()[0];
  const [errorContainer, setErrorContainer] = useState<ErrorContainer>(setNoError());
  const [isLoading, setLoading] = useState<boolean>(false);
  const [form, setForm] = useState<PersonalDetails>(initialFormState);
  const [formIsValid, setFormIsValid] = useState(true);
  const [SMSchecked, setSMSchecked] = useState(false);
  const [autocompleteRes, setAutocompleteRes,] = useState<AutocompleteRes | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);


  const highlightErrors = () => {
    setForm((oldForm) => ({
      first_name: {
        ...oldForm.first_name, hasError: !inputIsValidName(oldForm.first_name.value) 
      },
      last_name: {
        ...oldForm.last_name, hasError: !inputIsValidName(oldForm.last_name.value)
      },
      address_str: {
        ...oldForm.address_str, hasError: !inputIsNotEmpty(oldForm.address_str.value)
      },
      birthday: { ...oldForm.birthday, hasError: !inputIsNotEmpty(oldForm.birthday.value) || !inputAbove18(oldForm.birthday.value) },
      email: { ...oldForm.email, hasError: !inputIsValidEmail(oldForm.email.value) },
    }))
  };
  const validateInputs = useCallback(() => {
    return (
      inputIsValidName(form.first_name.value) &&
      inputIsValidName(form.last_name.value) &&
      inputIsNotEmpty(form.address_str.value) &&
      inputIsNotEmpty(form.birthday.value) &&
      inputAbove18(form.birthday.value) &&
      inputIsValidEmail(form.email.value)
    );
  }, [
    form.first_name.value,
    form.last_name.value,
    form.address_str.value,
    form.birthday.value,
    form.email.value,
  ]);

  useEffect(() => {
    setFormIsValid(validateInputs())
  }, [
    validateInputs,
    form.first_name.value,
    form.last_name.value,
    form.address_str.value,
    form.birthday.value,
    form.email.value,
  ]);

  const updateForm = (inputType: string, changedFormInput: string) => {
    setForm((oldForm) => {
      return {
        ...oldForm,
        [inputType]: {
          value: changedFormInput,
          hasError: false,
          name: inputType,
        },
      };
    });
  };

  const handleFormChange = (e: any) => {
    const changedFormInput = e.target.value;
    const inputType = e.target.name;

    updateForm(inputType, changedFormInput);
  };

  const formTest = (fullFormData: any): boolean => {
    if (!fullFormData?.first_name.length) { setErrorContainer(setError("שם חסר")); return false; }
    if (!fullFormData?.last_name.length) { setErrorContainer(setError("שם משפחה חסר")); return false; }
    if (!(fullFormData.address?.address_str && fullFormData.address?.address_lat && fullFormData.address?.address_str === fullFormData.address_str)) { setErrorContainer(setError("אנא הזן כתובת מחדש")); return false; }
    if (!fullFormData?.birthday.length) { setErrorContainer(setError("תאריך לידה חסר")); return false; }
    if (!fullFormData?.email.length) { setErrorContainer(setError("כתובת דואר אלקטרוני חסרה")); return false; }
    return true;
  }

  const handleFormSubmission = async () => {
    if (!formIsValid) {
      highlightErrors();
      setErrorContainer(setError(""));
      return;
    }

    setErrorContainer(setNoError());

    setLoading(true);
    const convertToValues = Object.values(form).reduce(
      (formValues, input) => ({
        ...formValues,
        [input.name]: input.value,
      }),
      {}
    );

    const fullFormData = {
      ...convertToValues,
      phone_number: phoneNumber,
      address: {
        address_str: autocompleteRes?.address,
        address_lat: autocompleteRes?.geometry.lat,
        address_lng: autocompleteRes?.geometry.lng,
      },
    };

    try {
      if (!formTest(fullFormData)) return setLoading(false);
      if (fullFormData.address_str) delete fullFormData.address_str;
      const response = await createVolunteer(fullFormData);
      pageNavigator(PAGES.REGISTRATION_COMPLETED);
    } catch (e) {
      setLoading(false);
      setErrorContainer(setError(t("יצירת משתמש נכשלה")));
    }

  };

  const handleAutocompleteChange = (value: AutocompleteRes) => {
    updateForm('address_str', value.address);
    setAutocompleteRes(value);
  };
  function formatDateToServer(date: Date): string {
    return formatDate(date, "yyyy-MM-dd");
  }

  function formatDateToClient(date: Date): string {
    return formatDate(date, "dd/MM/yyyy");
  }
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    updateForm("birthday", formatDateToServer(date));
  };

  function getErrorMsg (input: string) {
    var errorMsgStr;
    switch(input){
      case "first_name": 
        !inputIsValidName(form.first_name.value) && (errorMsgStr = <div className="error-msg">{t("שם פרטי לא תקין")}</div>);
        !inputIsNotEmpty(form.first_name.value) && (errorMsgStr = <div className="error-msg">{t("נא למלא שם פרטי")}</div>);
        break;
      case "last_name": 
        !inputIsValidName(form.last_name.value) && (errorMsgStr = <div className="error-msg">{t("שם משפחה לא תקין")}</div>);
        !inputIsNotEmpty(form.last_name.value) && (errorMsgStr = <div className="error-msg">{t("נא למלא שם משפחה")}</div>); 
        break;
      case "address":
        !inputIsNotEmpty(form.address_str.value) && (errorMsgStr = <div className="error-msg">{t("נא למלא כתובת")}</div>);
        break;
      case "birthday":
        !inputAbove18(form.birthday.value) && (errorMsgStr = <div className="error-msg">{t("ההתנדבות מיועדת לגילאי 18 ומעלה")}</div>);
        !inputIsNotEmpty(form.birthday.value) && (errorMsgStr = <div className="error-msg">{t("נא למלא תאריך לידה")}</div>);
        break;
      case "email":
        !inputIsValidEmail(form.email.value) && (errorMsgStr = <div className="error-msg">{t("אימייל לא תקין")}</div>); 
        !inputIsNotEmpty(form.email.value) && (errorMsgStr = <div className="error-msg">{t("נא למלא אימייל")}</div>);  
        break;
    }
    return errorMsgStr;
  }
  return (
    <>
      <div className='title form' dir='rtl'> {t("כמה פרטים אחרונים")}</div>
      <form className='details' autoComplete="off">
        <FormInput
          title={t('שם פרטי')}
          name={form.first_name.name}
          hasError={form.first_name.hasError}
          placeholder={t('דוד')}
          handleChange={handleFormChange}
        />
       {form.first_name.hasError && getErrorMsg("first_name")}
        <FormInput
          title={t('שם משפחה')}
          name={form.last_name.name}
          hasError={form.last_name.hasError}
          placeholder={t('ישראלי')}
          handleChange={handleFormChange}
        />
        {form.last_name.hasError && getErrorMsg("last_name")}

        <AddressesAutocomplete
          handleChange={handleFormChange}
          locationChoosed={handleAutocompleteChange}
          hasError={form.address_str.hasError}
        />
        {form.address_str.hasError && getErrorMsg("address")}

        <FormInput
          title={t('אימייל')}
          name={form.email.name}
          hasError={form.email.hasError}
          placeholder='email@gmail.com'
          handleChange={handleFormChange}
        />
        {form.email.hasError && getErrorMsg("email")}


        <div
          style={{
            position: "relative",
            display: "inlineBlock",
          }}
        >
          <DatePicker
            disableFuture
            openTo='year'
            label='Date of birth'
            views={["year", "month", "date"]}
            autoOk
            value={selectedDate}
            onChange={(date: any) => handleDateChange(date)}
            variant='inline'
            TextFieldComponent={({ onClick, onKeyDown }) => {
              return (
                <FormInput
                  title={t('תאריך לידה')}
                  placeholder='12/05/1948'
                  name={form.birthday.name}
                  hasError={form.birthday.hasError}
                  handleClick={onClick}
                  handleKeyDown={onKeyDown}
                  value={selectedDate ? formatDateToClient(selectedDate) : ""}
                />
              );
            }}
          />
        </div>
        {form.birthday.hasError && getErrorMsg("birthday")}

      </form>
      <ButtonsContainer
        handleClick={handleFormSubmission}
        btnTitle={t('סיום')}
        errorContainer={errorContainer}
        isLoading={isLoading}
      />
    </>
  );
};
