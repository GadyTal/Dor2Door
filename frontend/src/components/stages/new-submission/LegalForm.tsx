import React, { useState } from "react";
import {
  Description,
  SectionTitle,
  Space,
  Section,
  Header,
  Stack,
} from "./Style";
import {
  useWhom,
  useFirstStepResult,
  useSecondStepResult,
  useThirdStepResult,
} from "./StepState";
import { Redirect, useHistory } from "react-router-dom";
import { useSessionState } from "./useStringInput";
import { Result, ErroredField, NextStepButton } from "./NextStepButton";
import { CheckboxLabel, CheckboxIcon, CheckboxText } from "./Checkbox";
import { Steps, StepIcon, StepSeparator } from "./Step";
import { CreateMission } from "../../../services/Mission.service";

export function LegalForm() {
  const history = useHistory();
  const whom = useWhom();
  const firstStepResult = useFirstStepResult();
  const secondStepResult = useSecondStepResult();
  const thirdStepResult = useThirdStepResult();
  const [personalSafetyChecked, setPersonalSafetyChecked] = useSessionState({
    initialValue: false,
    key: "personal_safety_check",
  });
  const personalSafetyCheckedRef = React.useRef<HTMLHeadingElement>(null);
  const [volunteerAgreement, setVolunteerAgreement] = useSessionState({
    initialValue: false,
    key: "volunteer_agreement",
  });
  const volunteerAgreementRef = React.useRef<HTMLHeadingElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  if (!whom || !firstStepResult || !secondStepResult || !thirdStepResult) {
    return <Redirect to="/new-submission" />;
  }

  function buildResult(): Result<null, ErroredField[]> {
    const errors: ErroredField[] = [];
    if (!personalSafetyChecked) {
      errors.push({
        ref: personalSafetyCheckedRef,
        title: "אישור על בטחון אישי",
      });
    }

    if (!volunteerAgreement) {
      errors.push({
        ref: volunteerAgreementRef,
        title: "אישור על פעילות התנדבות",
      });
    }

    if (errors.length > 0) {
      return { _tag: "err", error: errors };
    }

    return { _tag: "ok", value: null };
  }

  return (
    <Stack>
      <Header canGoBack>טופס בקשת סיוע</Header>
      <SectionTitle passRef={personalSafetyCheckedRef}>
        שמירה על בטחון אישי
      </SectionTitle>
      <Section>
        <Stack>
          <Description>
            {whom !== "me" ? (
              <>
                המתנדב יניח את המצרכים מחוץ לדלת ביתו הסגורה של מבקש הסיוע,
                במטרה לשמור על בריאותו ובטחונו
              </>
            ) : (
                <>
                  המתנדב יניח את המצרכים שביקשת מחוץ לדלת ביתך הסגורה, במטרה לשמור
                  על בריאותך ובטחונך
              </>
              )}
          </Description>
          <CheckboxLabel
            checked={personalSafetyChecked}
            onStateChange={setPersonalSafetyChecked}
          >
            <CheckboxIcon />
            <Space horizontal />
            <CheckboxText>
              {whom !== "me" ? (
                <>
                  אני מאשר שהסברתי למבקש הסיוע כי אין לפתוח את דלת ביתו בפני
                  המתנדב ו/או למסור לו פרטי אשראי
                </>
              ) : (
                  <>
                    ידוע לי כי אין לפתוח את דלת דירתי בפני המתנדב, ו/או למסור לו
                    פרטים אישיים שלי, זאת על מנת לשמור על בריאותי ובטחוני האישי.
                </>
                )}
            </CheckboxText>
          </CheckboxLabel>
        </Stack>
      </Section>

      <SectionTitle passRef={volunteerAgreementRef}>
        אישור פעילות ההתנדבות
      </SectionTitle>
      <Section>
        <CheckboxLabel
          checked={volunteerAgreement}
          onStateChange={setVolunteerAgreement}
        >
          <CheckboxIcon />
          <Space horizontal />
          <CheckboxText>
            {whom !== "me" ? (
              <>
                אני מאשר שהסברתי למבקש הסיוע כי המתנדבים שקיבלו את פרטיו לצורך
                הסיוע המבוקש ייצרו עימו קשר טלפוני ויגיעו למקום מגוריו על מנת
                למסור את המבוקש
              </>
            ) : (
                <>
                  אני מסכים כי אתם ו/או המתנדבים שקיבלו את פרטיי לצורך הסיוע
                  שביקשתי, ייצרו עימי קשר טלפוני ויגיעו למקום מגוריי למסור את
                  שביקשתי.
              </>
              )}
          </CheckboxText>
        </CheckboxLabel>
      </Section>
      <Steps>
        <StepIcon number={1} state="previous" />
        <StepSeparator />
        <StepIcon number={2} state="previous" />
        <StepSeparator />
        <StepIcon number={3} state="previous" />
        <StepSeparator />
        <StepIcon number={4} state="current" />
      </Steps>
      {errorMessage ? <div>{errorMessage}</div> : null}
      <NextStepButton
        result={buildResult()}
        onNext={async () => {
          setErrorMessage("");
          if (isLoading) return;
          setIsLoading(false);
          try {
            await CreateMission({
              ...firstStepResult,
              ...secondStepResult,
              ...thirdStepResult,
            });
            history.push("/new-submission/success");
            window.scrollTo({ top: 0, behavior: "smooth" });
          } catch (e) {
            setErrorMessage("נכשל ביצירת משימה");
            setIsLoading(false);
          }
        }}
      >
        שלח בקשה
      </NextStepButton>
    </Stack>
  );
}
