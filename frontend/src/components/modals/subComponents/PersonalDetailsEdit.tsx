import React, { FC, useState, useCallback, useEffect } from "react";

import { FormInput } from "../../stages/login/subComponents/FormInput";
import {
  useHomepageState,
  useModalNavigation,
} from "../../hooks";
import { AddressesAutocomplete } from "../../stages/login/subComponents/AddressesAutocomplete";
import { PersonalDetailsBase, ErrorContainer } from "../../../shared/Contracts";
import { setNoError, setError } from "../../../services/error.service";
import {
  inputIsNotEmpty,
  inputIsValidEmail,
} from "../../../shared/formValidator";
import { ButtonsContainer } from "../../stages/login/subComponents/ButtonsContainer";
import { updateVolunteer } from "../../../services/Volunteer.service";
import { SETTINGS_PAGES } from "../SettingsModal";
import { AutocompleteRes } from "../../stages/new-submission/useAddressAutocomplete";
import { useTranslation } from "react-i18next";

const setFormInput = (name: string, value: string) => ({
  name,
  value,
  hasError: false,
});

const getInitialFormState = (email: string, address_str: string) => {
  return {
    email: setFormInput("email", email),
    address_str: setFormInput("address_str", address_str),
  };
};
export const PersonalDetailsEdit: FC = () => {
  const { t } = useTranslation()
  const modalNavigator = useModalNavigation();
  const { volunteer } = useHomepageState()!;
  const [errorContainer, setErrorContainer] = useState<ErrorContainer>(
    setNoError()
  );
  const [isLoading, setLoading] = useState<boolean>(false);
  const [form, setForm] = useState<PersonalDetailsBase>(
    getInitialFormState(volunteer.email, volunteer.address.address_str)
  );

  const [formIsValid, setFormIsValid] = useState(true);
  const [
    autocompleteRes,
    setAutocompleteRes,
  ] = useState<AutocompleteRes | null>(null);

  const handleAutocompleteChange = (value: AutocompleteRes) => {
    setAutocompleteRes(value);
  };

  const highlightErrors = () => {
    setForm((oldForm) => ({
      address_str: {
        ...oldForm.address_str,
        hasError: !inputIsNotEmpty(oldForm.address_str.value),
      },
      email: {
        ...oldForm.email,
        hasError: !inputIsValidEmail(oldForm.email.value),
      },
    }));
  };

  const validateInputs = useCallback(() => {
    return (
      inputIsNotEmpty(form.address_str.value) &&
      inputIsValidEmail(form.email.value)
    );
  }, [form.address_str.value, form.email.value]);

  useEffect(() => {
    setFormIsValid(validateInputs());
  }, [validateInputs, form.address_str.value, form.email.value]);

  const handleFormChange = (e: any) => {
    const changedFormInput = e.target.value;
    const inputType = e.target.name;

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

  const handleFormSubmission = async () => {
    if (!formIsValid) {
      highlightErrors();
      setErrorContainer(setError("פרטים שגויים"));
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

    const updatedData = {
      new_email: convertToValues.email,
      new_address: autocompleteRes
        ? {
          address_str: autocompleteRes?.address,
          address_lat: autocompleteRes?.geometry.lat,
          address_lng: autocompleteRes?.geometry.lng,
        }
        : volunteer.address,
    };

    try {
      await updateVolunteer(updatedData);
      window.location.reload();
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="personal-edits-container" style={{ position: 'relative', width: '100%' }}>
      <FormInput
        title={t('אימייל')}
        placeholder='email@gmail.com'
        name='email'
        handleChange={handleFormChange}
        hasError={form.email.hasError}
        value={form.email.value}
      />

      <AddressesAutocomplete
        handleChange={handleFormChange}
        locationChoosed={handleAutocompleteChange}
        hasError={form.address_str.hasError}
        value={
          autocompleteRes?.address
            ? autocompleteRes?.address
            : form.address_str.value
        }
      />

      <div
        onClick={() => {
          modalNavigator(SETTINGS_PAGES.DELETE_VOLUNTEER_CONFIRMATION);
        }}
        className='delete-account-label'
      > {t('מחיקת משתמש')}
      </div>

      <ButtonsContainer
        handleClick={handleFormSubmission}
        btnTitle={t('שמירה')}
        errorContainer={errorContainer}
        isLoading={isLoading}
      ></ButtonsContainer>
    </div>
  );
};
