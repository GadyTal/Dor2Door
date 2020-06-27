import { makeRequest, setToken, setRole } from "./webApi.service";
import { Config } from "../shared/Config";
import {
  VerificationResponse,
  VerificationErrorResponse,
  ValidateVerificationResponse,
  ValidateVerificationErrorResponse,
} from "../shared/Responses.Contracts";
import { AxiosResponse } from "axios";

export const ServerRequestOTP = (
  phoneNumber: string
): Promise<VerificationResponse> | Promise<VerificationErrorResponse> => {
  return makeRequest(
    Config.EndPoints.Login.RequestOtp,
    { phone_number: phoneNumber },
    "POST",
    null,
    false
  );
};

export const ServerValidateOTP = (
  phoneNumber: string,
  otp: string
): Promise<any> | Promise<ValidateVerificationErrorResponse> => {
  return new Promise((resolve: any, reject: any) => {
    makeRequest(
      Config.EndPoints.Login.ValidateOtp,
      { phone_number: phoneNumber, otp },
      "POST",
      null,
      false
    ).then(
      (res: AxiosResponse<ValidateVerificationResponse>) => {
        switch (res.status) {
          case 202: // new user
            resolve(null);
            break;
          case 200: // registered user
            setToken(res.data.token);
            setRole(res.data.user_role);
            resolve(res.data.user_role);
            break;
          default:
            reject({
              err: "Unknown error code",
            });
            break;
        }
      },
      (error: any) => {
        switch (error.response.status) {
          case 400:
            reject(400);
            break;
          case 403:
            reject({
              type: 403,
              attempts_left: error.response.data.attempts_left,
              err: "Wrong OTP",
            });
            break;
          case 408:
            reject({
              type: 408,
              attempts_left: error.response.data.attempts_left,
              err: "OTP expired, please generate new one",
            });
            break;
          case 422:
            reject({ type: 422, err: error.response.data.detail.msg });
            break;
          default:
            reject({
              err: "Unknown Error code",
            });
            break;
        }
      }
    );
  });
};
