import React from "react";
import { FirstPartResult } from "./FirstPart";
import { SecondPartResult } from "./SecondPart";
import { Children } from "./Children";
import { useSessionState } from "./useStringInput";
import { ThirdPartResult } from "./ThirdPart";

export type Whom = "me" | "other";

export type StepStates =
  | { maxStep: 0 }
  | { maxStep: 1; whom: Whom }
  | { maxStep: 2; whom: Whom; firstStepResult: FirstPartResult }
  | {
      maxStep: 3;
      whom: Whom;
      firstStepResult: FirstPartResult;
      secondStepResult: SecondPartResult;
    }
  | {
      maxStep: 4;
      whom: Whom;
      firstStepResult: FirstPartResult;
      secondStepResult: SecondPartResult;
      thirdStepResult: ThirdPartResult;
    };

const Context = React.createContext<{
  current: StepStates;
  setValue(state: StepStates): void;
}>({
  current: { maxStep: 0 },
  setValue: () => {},
});

export function StepState(props: { children: Children }) {
  const [current, setCurrent] = useSessionState<StepStates>({
    initialValue: { maxStep: 0 },
    key: `step_state`,
  });

  React.useEffect(() => {
    setCurrent(current); // store first thing
  });

  return (
    <Context.Provider value={{ current, setValue: setCurrent }}>
      {props.children}
    </Context.Provider>
  );
}

export function useFirstStepResult(): FirstPartResult | undefined {
  const states = React.useContext(Context).current;
  if (states.maxStep !== 1 && states.maxStep !== 0) {
    return states.firstStepResult;
  }
}

export function useSecondStepResult(): SecondPartResult | undefined {
  const states = React.useContext(Context).current;
  if (states.maxStep !== 1 && states.maxStep !== 2 && states.maxStep !== 0) {
    return states.secondStepResult;
  }
}

export function useThirdStepResult(): ThirdPartResult | undefined {
  const states = React.useContext(Context).current;
  if (states.maxStep === 4) {
    return states.thirdStepResult;
  }
}

export function useWhom(): Whom | undefined {
  const states = React.useContext(Context).current;
  if (states.maxStep !== 0) {
    return states.whom;
  }
}

export function useSetStepState(): (step: StepStates) => void {
  return React.useContext(Context).setValue;
}
