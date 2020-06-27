import React from "react";
import { RadioButtons, RadioButton } from "./RadioButtons";
import {
  Section,
  Header,
  Stack,
  SectionTitle,
  Description,
  Space,
} from "./Style";
import { useStringInput, useSessionState } from "./useStringInput";
import { CheckboxText, CheckboxLabel, CheckboxIcon } from "./Checkbox";
import { useHistory, Redirect } from "react-router-dom";
import { Steps, StepIcon, StepSeparator } from "./Step";
import { NextStepButton, Result, ErroredField } from "./NextStepButton";
import { useFirstStepResult, useSetStepState, useWhom } from "./StepState";
import { Input } from "./Input";

type PaymentMethod = "cash" | "bank_transfer" | "check" | "no_payment";
type Purpose = "pharmacy" | "grocery" | "grocery_and_pharmacy" | "general";
type NeedsVisitBefore = "yes" | "no" | "unknown";

export type SecondPartResult = {
  purpose: Purpose;
  payment_method: PaymentMethod;
  is_elder_need_visit_before: NeedsVisitBefore;
  description: string;
  pickup_point: string;
};

export function SecondPartForm() {
  const [purpose, setPurpose] = useSessionState<Purpose>({
    initialValue: "pharmacy",
    key: "purpose",
  });
  const [paymentMethod, setPaymentMethod] = useSessionState<PaymentMethod>({
    initialValue: "cash",
    key: "payment_method",
  });
  const [needsVisitBefore, setNeedsVisitBefore] = useSessionState<
    NeedsVisitBefore
  >({ initialValue: "yes", key: "is_elder_need_visit_before" });
  const pickupPoint = useStringInput({
    required: false,
    title: "נקודת איסוף",
    storageKey: "pickup_point",
  });
  const description = useStringInput({
    required: false,
    title: "פרטים",
    storageKey: "description",
  });
  const [
    agreeThatPaymentIsOnTheOneAsking,
    setAgreeThatPaymentIsOnTheOneAsking,
  ] = useSessionState<boolean>({
    initialValue: false,
    key: "agreeThatPaymentIsOnTheOneAsking",
  });
  const agreeThatPaymentIsOnTheOneAskingRef = React.useRef(null);
  const whom = useWhom();
  const firstResult = useFirstStepResult();
  const setStepState = useSetStepState();
  const history = useHistory();

  if (!firstResult || !whom) {
    return <Redirect to="/new-submission" />;
  }

  function buildResult(): Result<SecondPartResult, ErroredField[]> {
    const errors: ErroredField[] = [];

    if (!agreeThatPaymentIsOnTheOneAsking) {
      errors.push({
        ref: agreeThatPaymentIsOnTheOneAskingRef,
        title: "אישור על החזרת התשלום",
      });
    }

    if (errors.length > 0) {
      return { _tag: "err", error: errors };
    }

    return {
      _tag: "ok",
      value: {
        is_elder_need_visit_before: needsVisitBefore,
        purpose: purpose as Purpose,
        payment_method: paymentMethod as PaymentMethod,
        description: description.value,
        pickup_point: pickupPoint.value,
      },
    };
  }

  return (
    <>
      <Stack>
        <Header canGoBack>טופס בקשת סיוע</Header>
        <SectionTitle>כיצד נוכל לסייע?</SectionTitle>
        <Section>
          <RadioButtons value={purpose} onSelect={(v) => setPurpose(v as any)}>
            <Stack>
              <RadioButton value="pharmacy">קניות בית מרקחת / פארם</RadioButton>
              <RadioButton value="grocery">קניות מהסופר</RadioButton>
              <RadioButton value="grocery_and_pharmacy">גם וגם</RadioButton>
              <RadioButton value="general">אחר</RadioButton>
            </Stack>
          </RadioButtons>
        </Section>
        <SectionTitle>איך יתבצע התשלום?</SectionTitle>
        <Section>
          <RadioButtons
            value={paymentMethod}
            onSelect={(v) => setPaymentMethod(v as any)}
          >
            <Stack>
              <RadioButton value="cash">מזומן</RadioButton>
              <RadioButton value="bank_transfer">
                העברה בנקאית/תשלום דיגיטלי
              </RadioButton>
              <RadioButton value="check">{"צ'ק"}</RadioButton>
              <RadioButton value="no_payment">אין צורך בתשלום</RadioButton>
            </Stack>
          </RadioButtons>
        </Section>
        <SectionTitle>החזרת עלות הקנייה</SectionTitle>
        <Section>
          <Stack>
            <Description>
              {whom !== "me" ? (
                <>
                  המתנדב ייצור קשר עם מבקש הסיוע קשר טלפוני וינחה אותו כיצד
                  להעביר את התשלום. כמובן שאנו לא גובים תשלום עבור העזרה,
                  והתשלום מיועד להחזרת עלות הקנייה למתנדב. בכל מקרה, אין למסור
                  כרטיס אשראי או את פרטי הכרטיס למתנדב
                </>
              ) : (
                <>
                  המתנדב שיצור איתך קשר טלפוני, ינחה אותך כיצד להעביר לו את
                  התשלום. כמובן שאנו לא גובים תשלום עבור העזרה, והתשלום מיועד
                  להחזרת עלות הקנייה למתנדב.
                </>
              )}
            </Description>
            <CheckboxLabel
              checked={agreeThatPaymentIsOnTheOneAsking}
              onStateChange={(v) => setAgreeThatPaymentIsOnTheOneAsking(v)}
            >
              <CheckboxIcon />
              <Space horizontal />
              <CheckboxText>
                {whom !== "me" ? (
                  <>
                    אני מאשר שהתשלום עבור הקניות חל על מבקש הסיוע ושהנחיתי אותו
                    שלא ימסור את פרטי כרטיס האשראי
                  </>
                ) : (
                  <>אני מאשר שהתשלום עבור הקניות חל על מבקש הסיוע</>
                )}
              </CheckboxText>
            </CheckboxLabel>
          </Stack>
        </Section>
        <SectionTitle>נקודת איסוף ספציפית</SectionTitle>
        <Section>
          <Stack>
            <Description>האם המתנדב צריך לאסוף דברים ממקום מסויים?</Description>
            <Input
              value={pickupPoint.value}
              inputRef={pickupPoint.focusOnErrorRef}
              name="pickup_point"
              placeholder="למשל סניף מכבי בלפור"
              onChange={pickupPoint.onChange}
              error={pickupPoint.validationError}
            />
          </Stack>
        </Section>
        <SectionTitle>איסוף מבית מבקש הסיוע</SectionTitle>
        <Section>
          <RadioButtons
            value={needsVisitBefore}
            onSelect={(v) => setNeedsVisitBefore(v as any)}
          >
            <Stack>
              <Description>
                האם יש צורך שהמתנדב יגיע אל בית מבקש הסיוע לפני היציאה להתנדבות?
                למשל לצורך איסוף מרשם או כרטיס קופת-חולים.
              </Description>
              <RadioButton value="yes">כן</RadioButton>
              <RadioButton value="no">לא</RadioButton>
              <RadioButton value="unknown">לא ידוע</RadioButton>
            </Stack>
          </RadioButtons>
        </Section>
        <SectionTitle>הערות ומידע נוסף</SectionTitle>
        <Section>
          <Stack>
            <Description>נא לא להזין פרטים אישיים או פרטים רפואיים.</Description>
            <textarea
              className="form-input shallow"
              style={{ fontSize: "1em" }}
              placeholder="משהו נוסף שאנחנו צריכים לדעת?"
              onChange={description.onChange}
            />
          </Stack>
        </Section>

        <Steps>
          <StepIcon number={1} state="previous" />
          <StepSeparator />
          <StepIcon number={2} state="current" />
          <StepSeparator after />
          <StepIcon number={3} state="next" />
          <StepSeparator after />
          <StepIcon number={4} state="next" />
        </Steps>
        <NextStepButton
          result={buildResult()}
          onNext={(secondStepResult) => {
            setStepState({
              maxStep: 3,
              whom,
              firstStepResult: firstResult,
              secondStepResult,
            });
            history.push({
              pathname: "/new-submission/3",
            });
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </Stack>
    </>
  );
}
