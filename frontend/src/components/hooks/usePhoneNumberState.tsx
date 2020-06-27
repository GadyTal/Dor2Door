import { useContext } from 'react';
import { LoginContext } from '../stages/login';

export const usePhoneNumberState = () => useContext(LoginContext);
