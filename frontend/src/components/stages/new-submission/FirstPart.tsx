import React from "react";
import { useStringInput, useSessionState } from "./useStringInput";
import { AutocompleteRes } from "../../stages/login/subComponents/AddressesAutocomplete";
import { RadioButton, RadioButtons } from "./RadioButtons";
import {
  Stack,
  Space,
  Section,
  Header,
  SectionTitle,
  SectionSubtitle,
  Description,
} from "./Style";
import { DropdownContainer, Option } from "./SimpleDropdown";
import { ErroredField, Result, NextStepButton } from "./NextStepButton";
import { StepIcon, Steps, StepSeparator } from "./Step";
import { useHistory, Redirect } from "react-router-dom";
import { useSetStepState, useWhom } from "./StepState";
import { Input } from "./Input";
import { Config } from "../../../shared/Config";
import { useAddressAutocomplete } from "./useAddressAutocomplete";
import { Mission } from "../../../shared/Contracts";
import { getRelevantDays, DateDef, getTimeForDate } from './getRelevantDays';

export type PreferredHours = "morning" | "afternoon" | "evening";

export type FirstPartResult = {
  elder_first_name: string;
  elder_last_name: string;
  elder_phone_number: string;
  elder_address: Mission["elder_address"];
  prefered_hours: PreferredHours;
  scheduled_to_date: string;
};

export function FirstPartForm() {
  const whom = useWhom();
  const [wantedTime, setWantedTime] = useSessionState({
    initialValue: "morning",
    key: "prefered_hours",
  });
  const firstNameCfg = useStringInput({
    required: true,
    title: "שם פרטי",
    storageKey: "elder_first_name",
  });
  const lastNameCfg = useStringInput({
    required: true,
    title: "שם משפחה",
    storageKey: "elder_last_name",
  });
  const phoneNumberCfg = useStringInput({
    required: true,
    storageKey: "elder_phone_number",
    title: "מספר טלפון",
    validate(number) {
      if (number && !number.match(Config.Reggex.phone)) {
        return "מספר לא תקין";
      }
    },
    mapFn: (s) =>
      s
        .split("-")
        .map((x) => x.trim())
        .join(""),
  });
  const entranceCfg = useStringInput({
    required: false,
    title: "כניסה",
    storageKey: "entrance",
  });
  const floorCfg = useStringInput({
    required: false,
    title: "קומה",
    storageKey: "floor",
  });
  const apartmentCfg = useStringInput({
    required: false,
    title: "דירה",
    storageKey: "apartment",
  });
  const locationTxt = useStringInput({
    required: true,
    title: "כתובת",
    storageKey: "elder_address_str",
  });
  const [location, setLocation] = useSessionState<null | AutocompleteRes>({
    initialValue: null,
    key: "location_geo",
  });

  const history = useHistory();
  useAddressAutocomplete({
    inputRef: locationTxt.focusOnErrorRef,
    onChange(autocomplete) {
      setLocation(autocomplete);
      locationTxt.setValue(autocomplete.address);
    },
  });

  const relevantDays = getRelevantDays();
  const [date, setDate] = useSessionState<DateDef>({
    initialValue: relevantDays[0],
    key: "date",
  });
  const wantedTimeForThisDate = getTimeForDate(date, wantedTime as any);

  function buildResult(): Result<FirstPartResult, ErroredField[]> {
    const cfgs = [
      firstNameCfg,
      lastNameCfg,
      locationTxt,
      phoneNumberCfg,
      entranceCfg,
      floorCfg,
      apartmentCfg,
    ];
    const errored = cfgs
      .filter((c) => c.hasError)
      .map(
        (cfg): ErroredField => {
          return {
            title: cfg.title,
            ref: cfg.focusOnErrorRef,
          };
        }
      );

    if (!location && !locationTxt.hasError) {
      errored.push({
        title: locationTxt.title,
        ref: locationTxt.focusOnErrorRef,
      });
    }

    if (location && errored.length === 0) {
      return {
        _tag: "ok",
        value: {
          elder_first_name: firstNameCfg.value,
          elder_last_name: lastNameCfg.value,
          elder_phone_number: "972" + phoneNumberCfg.value,
          elder_address: {
            address_lng: location.geometry.lng,
            address_lat: location.geometry.lat,
            address_str: [
              locationTxt.value,
              floorCfg.value && `קומה: ${floorCfg.value}`,
              apartmentCfg.value && `דירה: ${apartmentCfg.value}`,
            ]
              .filter(Boolean)
              .join("\n"),
          },
          prefered_hours: wantedTimeForThisDate as FirstPartResult["prefered_hours"],
          scheduled_to_date: date.dateString,
        },
      };
    }

    return { _tag: "err", error: errored };
  }

  const result = buildResult();
  const setStepState = useSetStepState();

  if (!whom) {
    return <Redirect to="/new-submission" />;
  }

  return (
    <>
      <Stack>
        <Header canGoBack>טופס בקשת סיוע</Header>
        <SectionTitle>עבור מי הסיוע?</SectionTitle>
        <Section>
          <Stack>
            <Input
              required
              name="firstName"
              placeholder="שם פרטי"
              value={firstNameCfg.value}
              inputRef={firstNameCfg.focusOnErrorRef}
              error={firstNameCfg.validationError}
              onChange={firstNameCfg.onChange}
            />
            <Input
              required
              name="lastName"
              placeholder="שם משפחה"
              value={lastNameCfg.value}
              inputRef={lastNameCfg.focusOnErrorRef}
              error={lastNameCfg.validationError}
              onChange={lastNameCfg.onChange}
            />
            <Input
              required
              name="phoneNumber"
              placeholder="מספר טלפון"
              value={phoneNumberCfg.value}
              inputRef={phoneNumberCfg.focusOnErrorRef}
              error={phoneNumberCfg.validationError}
              onChange={phoneNumberCfg.onChange}
              type="tel"
            />
            <SectionSubtitle>כתובת</SectionSubtitle>
            <Input
              name="elder_address_str"
              placeholder="כתובת"
              demoInput="רוטשילד 54, תל אביב"
              required
              value={locationTxt.value}
              onChange={locationTxt.onChange}
              error={locationTxt.validationError}
              inputRef={locationTxt.focusOnErrorRef}
            />
            <div style={{ display: "flex" }}>
              <Input
                name="entrance"
                placeholder="כניסה"
                value={entranceCfg.value}
                inputRef={entranceCfg.focusOnErrorRef}
                error={entranceCfg.validationError}
                onChange={entranceCfg.onChange}
                containerProps={{
                  style: {
                    flex: 1,
                  },
                }}
              />
              <Space horizontal />
              <Input
                name="floor"
                placeholder="קומה"
                value={floorCfg.value}
                error={floorCfg.validationError}
                inputRef={floorCfg.focusOnErrorRef}
                onChange={floorCfg.onChange}
                containerProps={{
                  style: {
                    flex: 1,
                  },
                }}
              />
            </div>
            <div style={{ display: "flex" }}>
              <Input
                name="apartment"
                placeholder="דירה"
                value={apartmentCfg.value}
                error={apartmentCfg.validationError}
                inputRef={apartmentCfg.focusOnErrorRef}
                onChange={apartmentCfg.onChange}
                containerProps={{
                  style: {
                    flex: 1,
                  },
                }}
              />
              <Space horizontal />
              <div style={{ flex: 1 }} />
            </div>
          </Stack>
        </Section>

        <SectionTitle>מתי תרצו שהמתנדב יגיע?</SectionTitle>

        <Section>
          <Stack>
            <Description>תאריך</Description>
            <DropdownContainer value={date} onChange={(v) => setDate(v)}>
              {relevantDays.map((day) => {
                return (
                  <Option key={day.dateString} value={day}>
                    {day.title}
                  </Option>
                );
              })}
            </DropdownContainer>
            <Description>זמן מועדף</Description>
            <RadioButtons
              value={wantedTimeForThisDate}
              onSelect={setWantedTime}
            >
              <Stack>
                {date.times.map((time) => {
                  return (
                    <RadioButton key={time} value={time}>
                      {wantedTimeTranslations[time]}
                    </RadioButton>
                  );
                })}
              </Stack>
            </RadioButtons>
          </Stack>
        </Section>
        <Steps>
          <StepIcon number={1} state="current" />
          <StepSeparator after />
          <StepIcon number={2} state="next" />
          <StepSeparator after />
          <StepIcon number={3} state="next" />
          <StepSeparator after />
          <StepIcon number={4} state="next" />
        </Steps>
        <NextStepButton
          result={result}
          onNext={(firstStepResult) => {
            setStepState({ maxStep: 2, whom, firstStepResult });
            history.push({
              pathname: "/new-submission/2",
            });
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </Stack>
    </>
  );
}

const wantedTimeTranslations: Record<
  FirstPartResult["prefered_hours"],
  string
> = {
  morning: "בוקר",
  afternoon: "צהריים",
  evening: "ערב",
};
