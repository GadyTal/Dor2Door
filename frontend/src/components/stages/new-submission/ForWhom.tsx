import React from "react";
import {
  Header,
  Stack,
  SectionTitle,
  Section,
  Description,
  Space,
} from "./Style";
import { RadioButtons, RadioButton } from "./RadioButtons";
import { CheckboxLabel, CheckboxIcon, CheckboxText } from "./Checkbox";
import { NextStepButton, Result, ErroredField } from "./NextStepButton";
import { useSessionState } from "./useStringInput";
import { useHistory } from "react-router-dom";
import { useSetStepState, Whom } from "./StepState";

export function ForWhomForm() {
  const [whom, setWhom] = useSessionState<Whom>({
    initialValue: "me",
    key: "toWhom:whom",
  });
  const [agreeToTerms, setAgreeToTerms] = useSessionState({
    initialValue: false,
    key: "toWhom:agreeToAppTerms",
  });
  const agreeToTermsRef = React.useRef<HTMLHeadingElement>(null);
  const [requestAgreement, setRequestAgreement] = useSessionState({
    initialValue: false,
    key: "toWhom:requestAgreement",
  });
  const requestAgreementRef = React.useRef<HTMLHeadingElement>(null);
  const history = useHistory();
  const setStepState = useSetStepState();

  function buildResult(): Result<{ whom: Whom }, ErroredField[]> {
    const errors: ErroredField[] = [];

    if (!agreeToTerms) {
      errors.push({
        ref: agreeToTermsRef,
        title: "אישור שימוש",
      });
    }

    if (whom !== "me" && !requestAgreement) {
      errors.push({
        ref: requestAgreementRef,
        title: "אישור מבקש הסיוע",
      });
    }

    if (errors.length > 0) {
      return { _tag: "err", error: errors };
    }

    return {
      _tag: "ok",
      value: {
        whom,
      },
    };
  }

  return (
    <Stack>
      <Header>טופס בקשת סיוע</Header>
      <SectionTitle>מהות הפעילות</SectionTitle>
      <Section>
        <Description>
          ידוע לי האתר/האפליקציה מהווה כלי התנדבותי-טכנולוגי שנועד לחבר בין
          אנשים הזקוקים לסיוע לבין אנשים אחרים המעוניינים להתנדב. לפיכך, אני
          עושה זאת על דעת עצמי ובאחריותי. ידוע לי הארגון ו/או המיזם ו/או הפועלים
          מטעמם, אינם אחראים לאופי, טיב, מיהות ההתנדבות ו/או מפקחים על המתנדבים
          ו/או על כל עניין אחר הקשור עימם, ולא אבוא אליכם ו/או למי מטעמכם
          בכל טענה ו/או דרישה עקב כך ו/או עקב השירות באתר ו/או ההתנדבות, לרבות
          בגין הדבקות ו/או נזקי וירוס הקורונה ואני פוטר אתכם מכל אחריות לכל
          האמור.
        </Description>
      </Section>
      <SectionTitle>אני מבקש את הסיוע:</SectionTitle>
      <Section>
        <RadioButtons value={whom} onSelect={setWhom}>
          <Stack>
            <RadioButton value="me">עבורי</RadioButton>
            <RadioButton value="other">עבור אדם אחר</RadioButton>
          </Stack>
        </RadioButtons>
      </Section>
      {whom !== "me" && (
        <Stack>
          <SectionTitle passRef={requestAgreementRef}>
            אישור מבקש הסיוע
          </SectionTitle>
          <Section>
            <CheckboxLabel
              checked={requestAgreement}
              onStateChange={setRequestAgreement}
            >
              <CheckboxIcon />
              <Space horizontal />
              <CheckboxText>
                אני מאשר שקיבלתי את הסכמת האדם שמבקש סיוע למסור את פרטיו
              </CheckboxText>
            </CheckboxLabel>
          </Section>
        </Stack>
      )}
      <SectionTitle passRef={agreeToTermsRef}>
        אישור תנאי שימוש באפליקציה ובאתר
      </SectionTitle>
      <Section>
        <CheckboxLabel checked={agreeToTerms} onStateChange={setAgreeToTerms}>
          <CheckboxIcon />
          <Space horizontal />
          <CheckboxText>
            אני מצהיר שקראתי את{" "}
            <a
              href="https://docs.google.com/document/d/e/2PACX-1vQQDj6FSqZODsGPFWYlg_w3Aak80LkQ1yIzq3tk9bvRLWaJ5c5gQicsFrJNv-SK52nx3iSXctuW94uP/pub"
              target="blank"
              rel="noopener noreferrer"
            >
              תנאי השימוש ואת מדיניות הפרטיות
            </a>{" "}
            ואני מסכים להם.
          </CheckboxText>
        </CheckboxLabel>
      </Section>
      <NextStepButton
        result={buildResult()}
        onNext={(v) => {
          setStepState({ maxStep: 1, whom: v.whom });
          history.push("/new-submission/1");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        בואו נתחיל
      </NextStepButton>
    </Stack>
  );
}
