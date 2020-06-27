import { ErrorContainer } from '../shared/Contracts';

export const setError = (error: string): ErrorContainer => ({
  active: true,
  message: error,
});

export const setNoError = (): ErrorContainer => ({
  active: false,
  message: "",
});
