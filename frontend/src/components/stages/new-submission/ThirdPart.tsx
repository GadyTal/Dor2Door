import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { Header, Stack, SectionTitle, Section, SectionSubtitle } from "./Style";
import { RadioButtons, RadioButton } from "./RadioButtons";
import { useSessionState, useStringInput } from "./useStringInput";
import { Result, ErroredField, NextStepButton } from "./NextStepButton";
import {
  useFirstStepResult,
  useSecondStepResult,
  useSetStepState,
  useWhom,
} from "./StepState";
import { Config } from "../../../shared/Config";
import { Input } from "./Input";
import { Steps, StepSeparator, StepIcon } from "./Step";

type AdditionalContactRole = "doctor" | "family" | "other";

export type ThirdPartResult = {
  additional_contact_name?: string;
  additional_contact_phone?: string;
  additional_contact_email?: string;
  additional_contact_role?: AdditionalContactRole;
  use_additional_contact: boolean;
};

export function ThirdPartForm() {
  const history = useHistory();
  const whom = useWhom();
  const firstResult = useFirstStepResult();
  const secondResult = useSecondStepResult();
  const [hasAdditionalContact, setHasAdditionalContact] = useSessionState({
    initialValue: true,
    key: "has_additional_contact",
  });
  const [
    shouldUseAdditionalContact,
    setShouldUseAdditionalContact,
  ] = useSessionState({ initialValue: false, key: "use_additional_contact" });
  const [additionalContactRole, setAdditionalContactRole] = useSessionState<
    AdditionalContactRole
  >({
    initialValue: "family",
    key: "additional_contact_role",
  });
  const additionalContactName = useStringInput({
    title: "שם איש קשר נוסף",
    required: hasAdditionalContact,
    storageKey: "additional_contact_name",
    validate(name) {
      if (!hasAdditionalContact) {
        return;
      }

      if (!name.match(Config.Reggex.name)) {
        return "אנא מלאו שם מלא";
      }

      return;
    },
  });
  const additionalContactPhone = useStringInput({
    title: "טלפון איש קשר נוסף",
    required: hasAdditionalContact,
    storageKey: "additional_contact_phone",
    validate(number) {
      if (number && !number.match(Config.Reggex.phone)) {
        return "מספר לא תקין";
      }
    },
  });
  const additionalContactEmail = useStringInput({
    title: "אימייל איש קשר נוסף",
    required: hasAdditionalContact,
    storageKey: "additional_contact_email",
    validate(name) {
      if (!hasAdditionalContact) {
        return;
      }

      if (!name.match(Config.Reggex.email)) {
        return "אנא מלאו מייל תקין";
      }

      return;
    },
  });
  const setStepState = useSetStepState();

  if (!firstResult || !secondResult || !whom) {
    return <Redirect to="/new-submission" />;
  }

  function buildResult(): Result<ThirdPartResult, ErroredField[]> {
    const cfgs = [
      additionalContactName,
      additionalContactPhone,
      additionalContactEmail,
    ];
    const errored = cfgs
      .filter((x) => x.hasError)
      .map(
        (x): ErroredField => ({
          title: x.title,
          ref: x.focusOnErrorRef,
        })
      );

    if (errored.length > 0) {
      return {
        _tag: "err",
        error: errored,
      };
    }

    return {
      _tag: "ok",
      value: {
        use_additional_contact: false,
        ...(hasAdditionalContact && {
          use_additional_contact: shouldUseAdditionalContact,
          additional_contact_phone: "972" + additionalContactPhone.value,
          additional_contact_name: additionalContactName.value,
          additional_contact_role: additionalContactRole,
          additional_contact_email: additionalContactEmail.value,
        }),
      },
    };
  }

  return (
    <Stack>
      <Header canGoBack>טופס בקשת סיוע</Header>
      <SectionTitle>האם יש איש קשר נוסף?</SectionTitle>
      <Section>
        <RadioButtons
          value={String(hasAdditionalContact)}
          onSelect={(x) => setHasAdditionalContact(x === "true")}
        >
          <Stack>
            <RadioButton value="true">כן</RadioButton>
            <RadioButton value="false">לא</RadioButton>
          </Stack>
        </RadioButtons>
      </Section>
      {hasAdditionalContact && (
        <Stack>
          <SectionTitle>פרטי איש הקשר הנוסף</SectionTitle>
          <Section>
            <Stack>
              <Input
                required
                name="additional_contact_name"
                value={additionalContactName.value}
                onChange={additionalContactName.onChange}
                error={additionalContactName.validationError}
                placeholder="שם מלא"
              />
              <Input
                required
                name="additional_contact_phone"
                value={additionalContactPhone.value}
                onChange={additionalContactPhone.onChange}
                error={additionalContactPhone.validationError}
                placeholder="טלפון"
              />
              <Input
                required
                name="additional_contact_email"
                value={additionalContactEmail.value}
                onChange={additionalContactEmail.onChange}
                error={additionalContactEmail.validationError}
                type="email"
                placeholder="כתובת אימייל"
              />
              <SectionSubtitle>קירבה</SectionSubtitle>
              <RadioButtons
                value={additionalContactRole}
                onSelect={(x) => setAdditionalContactRole(x as any)}
              >
                <Stack>
                  <RadioButton value="family">קרוב משפחה</RadioButton>
                  <RadioButton value="doctor">רופא</RadioButton>
                  <RadioButton value="other">אחר</RadioButton>
                </Stack>
              </RadioButtons>
            </Stack>
          </Section>
          <SectionTitle>עם מי ליצור קשר</SectionTitle>
          <Section>
            <RadioButtons
              value={String(shouldUseAdditionalContact)}
              onSelect={(s) => setShouldUseAdditionalContact(s === "true")}
            >
              <Stack>
                <RadioButton value="false">עם מבקש הסיוע</RadioButton>
                <RadioButton value="true">עם איש הקשר הנוסף</RadioButton>
              </Stack>
            </RadioButtons>
          </Section>
        </Stack>
      )}
      <Steps>
        <StepIcon number={1} state="previous" />
        <StepSeparator />
        <StepIcon number={2} state="previous" />
        <StepSeparator />
        <StepIcon number={3} state="current" />
        <StepSeparator after />
        <StepIcon number={4} state="next" />
      </Steps>
      <NextStepButton
        result={buildResult()}
        onNext={async (third) => {
          setStepState({
            maxStep: 4,
            firstStepResult: firstResult,
            secondStepResult: secondResult,
            thirdStepResult: third,
            whom,
          });
          history.push("/new-submission/4");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </Stack>
  );
}
