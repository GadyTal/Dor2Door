import { makeRequest, setToken, setRole } from "./webApi.service";
import { Config } from "../shared/Config";
import {
  CreateVolunteerErrorResponse,
  GetHomePageResponse,
  GetVolunteerMissionResponse,
  setVolunteerMissionResponseAccept,
} from "../shared/Responses.Contracts";
import { PersonalDetails, DeclineReason } from "../shared/Contracts";

export const createVolunteer = (
  details: PersonalDetails,
): Promise<any> | Promise<CreateVolunteerErrorResponse> => {
  return new Promise((resolve: any, reject: any) => {
    makeRequest(
      Config.EndPoints.Volunteer.Create,
      details,
      "PUT",
      null,
      false,
    ).then(
      (res: any) => {
        switch (res.status) {
          case 200: // registered user
          case 201:
            setToken(res.data.token);
            setRole(res.data.user_role);
            resolve(res.data.user_role);
            break;
          default:
            console.error("unknown error code");
            break;
        }
      },
      (e: any) => {
        reject({
          err: e.response
            ? e.response.data.detail[0]?.msg
            : e.data.detail[0]?.msg,
        });
      }
    );
  });
};

// Get homepage
export const getVolunteer = ():
  | Promise<GetHomePageResponse>
  | Promise<any> => {
  return new Promise((resolve, reject) => {
    makeRequest(Config.EndPoints.Volunteer.Get, null, "GET", null, true)
      .then((response: any) => resolve(response.data))
      .catch((error: Error) => reject(error));
  });
};
export const getVolunteerMission = (
  id: string,
): Promise<GetVolunteerMissionResponse> => {
  return new Promise((resolve, reject) => {
    makeRequest(
      Config.EndPoints.Volunteer.GetVolunteerMission + id,
      null,
      "GET",
      null,
      true,
    )
      .then((response: any) => resolve(response.data))
      .catch((error: Error) => reject(error));
  });
};

export const updateVolunteer = (data: any) => {
  return new Promise((resolve, reject) => {
    makeRequest(Config.EndPoints.Volunteer.Update, data, "POST", null)
      .then((response: any) => resolve(response.data))
      .catch((error: Error) => reject(error));
  });
};

export const deleteVolunteer = () => {
  return new Promise((resolve, reject) => {
    makeRequest(Config.EndPoints.Volunteer.Delete, null, "DELETE", null)
      .then((response: any) => resolve(response.data))
      .catch((error: Error) => reject(error));
  });
};

export const setVolunteerMissionAccept = (
  id: string,
): Promise<setVolunteerMissionResponseAccept> => {
  return new Promise((resolve, reject) => {
    makeRequest(
      Config.EndPoints.Volunteer.setVolunteerMissionAccept +
        id +
        Config.EndPoints.Volunteer.accept,
      null,
      "POST",
      null,
      true,
    )
      .then((response: any) => resolve(response.data))
      .catch((error: Error) => reject(error));
  });
};
export const setVolunteerMissionDecline = (
  id: string,
  reason: DeclineReason
): Promise<null> | Promise<any> => {
  return new Promise((resolve, reject) => {
    makeRequest(
      Config.EndPoints.Volunteer.setVolunteerMissionDecline +
        id +
        Config.EndPoints.Volunteer.decline,
      { reason },
      "POST",
      null,
      true,
    )
      .then((response: any) => resolve(response.data))
      .catch((error: Error) => reject(error));
  });
};

export const setSubscription = (isSubscribed: boolean) => {
  return new Promise((resolve, reject) => {
    makeRequest(
      Config.EndPoints.Volunteer.Subscribe,
      {
        enabled: isSubscribed,
      },
      "POST",
      null,
      true,
    )
      .then((response: any) => resolve(response.data))
      .catch((error: Error) => reject(error));
  });
};
