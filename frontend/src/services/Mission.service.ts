import { makeRequest } from "./webApi.service";
import { Config } from "../shared/Config";
import {
  ChangeMissionStateErrorResponse,
  GetMissionsResponse,
  scheduleMissionData,
} from "../shared/Responses.Contracts";
import { MissionState, Mission } from "../shared/Contracts";

export const ChangeMissionState = (
  missionID: string,
  missionState: MissionState,
  errorState?: string
): Promise<any>=> {
  return makeRequest(
    Config.EndPoints.Mission.ChangeState,
    {
      mission_id: missionID,
      mission_state: missionState,
    },
    "POST",
    null,
    false
  );
};

export const CreateMission = (form: Omit<Mission, "uuid" | "state">): Promise<any> => {
  return makeRequest(Config.EndPoints.Mission.Create, form, "PUT", null, true);
};

export const UpdateMission = (mission: Mission): Promise<any> => {
  return makeRequest(Config.EndPoints.Mission.Update, mission, "PUT", null, true);
};

export const getMissions = (): Promise<GetMissionsResponse> | Promise<any> => {
  return new Promise((resolve, reject) =>
    makeRequest(Config.EndPoints.Mission.GetMissions, null, "GET", null, true).then((response: any) =>
      resolve(response.data)
    )
  ).catch((error) => console.log(error));
};

export const getMissionsSearch = (value: string): Promise<GetMissionsResponse> | Promise<any> => {
  return new Promise((resolve, reject) =>
    makeRequest(
      Config.EndPoints.Mission.GetMissionsSearch,
      { value: value },
      "POST",
      null,
      true
    ).then((response: any) => resolve(response.data))
  ).catch((error) => console.log(error));
};
export const scheduleMission = (scheduleTime: scheduleMissionData): Promise<any> => {
  return makeRequest(Config.EndPoints.Mission.ScheduleMission, scheduleTime, "POST", null, true);
};
