import React from "react";

export function useSessionState<T>(args: {
  key: string;
  initialValue: T;
}): [T, (t: T) => void] {
  const key = `new-submission-form:${args.key}`;
  const [state, setState] = React.useState(() => {
    const itemFromStorage = window.history.state?.[key];
    if (itemFromStorage) {
      return itemFromStorage;
    } else {
      return args.initialValue;
    }
  });
  const storingSetState = React.useCallback(
    (newState: T) => {
      window.history.replaceState(
        {
          ...window.history.state,
          [key]: newState,
        },
        document.title
      );
      setState(newState);
    },
    [setState]
  );

  return [state, storingSetState];
}

export function useStringInput<RefType = HTMLInputElement>({
  required = false,
  storageKey,
  title,
  validate: validateFn,
  mapFn,
}: {
  required?: boolean;
  storageKey: string;
  title: string;
  validate?(value: string): string | undefined;
  mapFn?(str: string): string;
}): {
  value: string;
  hasError: boolean;
  title: string;
  focusOnErrorRef: React.RefObject<RefType>;
  validationError?: string;
  onChange: NonNullable<
    React.InputHTMLAttributes<{ value: string }>["onChange"]
  >;
  setValue(s: string): void;
} {
  const focusOnErrorRef = React.useRef<RefType>(null);
  const [rawString, setString] = useSessionState<string>({
    initialValue: "",
    key: storageKey,
  });
  const cb = React.useCallback<
    NonNullable<React.InputHTMLAttributes<{ value: string }>["onChange"]>
  >((event) => {
    setString(event.target.value);
  }, []);
  const value = mapFn?.(rawString) ?? rawString;
  const validationError = validateFn?.(value);
  return {
    value,
    title,
    hasError: Boolean(validationError || (required && !value)),
    onChange: cb,
    validationError,
    focusOnErrorRef,
    setValue(s) {
      setString(s);
    },
  };
}
