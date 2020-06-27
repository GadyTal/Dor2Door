import { Config } from "./Config";
import moment from 'moment';

export const inputIsNotEmpty = (input: string) => input.length !== 0;

export const inputIsValidEmail = (input: string) =>
  input.match(Config.Reggex.email) !== null;

export const inputIsValidName = (input: string) => {
  return input.match(Config.Reggex.name) !== null;
};

export const inputIsphone = (input: string) =>
  input.match(Config.Reggex.phone) !== null;

export const inputIsUniversalPhone = (input: string) =>
  input.match(Config.Reggex.universalPhone) !== null;

  export const inputAbove18 = (input: string) => {
    const isEmpty = input == "";
    return !isEmpty && moment().diff(input, 'years') >= 18;
}