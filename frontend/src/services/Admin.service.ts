import { makeRequest } from "./webApi.service";
import { Config } from "../shared/Config";
import { Coordinator } from "../shared/Contracts";

export const GetCoordinators = (): Promise<{ coordinators: Coordinator[] }> => {
  return makeRequest(Config.EndPoints.Volunteer.Coordinators, null, "GET", null, true);
};
