import { Volunteer,Mission, MissionPurpose } from './Contracts';
// errors response will change after change error codes in the server
//  ---------------------- Login verification -----------------------

export interface VerificationResponse {
  endTime: string; // need to verify with server
}

export interface VerificationErrorResponse {
  //  400 Not enough time passed since your last phone verification attempt, please wait few minutes before trying again
  //  422 Validation Error
  detail: {
    loc: [];
    msg: string; // relvent user error - will update to error code - then translate to string
    type: string;
  };
}

export interface ValidateVerificationResponse {
  user_role: UserRoles;  
  token: string;
}

export interface ValidateVerificationErrorResponse {
  // 400 OTP never sent to this phone number, please generate new SMS verification
  // 403 the provided OTP does not match server OTP, please try again
  // 408 OTP expired, Too many attempts to to guess this OTP, please generate new SMS verification
  attempts_left?: number;
  err?: string;
  // 422 Validation Error
  detail: {
    loc: [];
    msg: string; // relvent user error - will update to error code - then translate to string
    type: string;
  };
}

//  ---------------------- Volunteer -----------------------
export interface CreateVolunteerResponse {
  volunteer?: Volunteer; // exist user - should be verify with server
}

export interface CreateVolunteerErrorResponse {
  // 400 Phone number already registered
  // 401 Phone number need SMS verification via OTP, please authenticate first
  // 422 Validation Error
  detail: {
    loc: [];
    msg: string; // relvent user error - will update to error code - then translate to string
    type: string;
  };
}

export interface GetHomePageResponse {
  volunteer:Volunteer;
  name: string;
  is_subscribed: boolean; // for whatsaoo
  volunteers_count: number;
  elders_count: number;
  last_mission_elder_first_name: string;
  last_mission_completed_date: string; // check if need to parse to Date type.
}

export interface ChangeMissionStateErrorResponse {
  //  404 There is no mission with this mission id
  //  422 Validation Error
  detail: {
    loc: [];
    msg: string; // relvent user error - will update to error code - then translate to string
    type: string;
  };
}
export enum UserRoles {
  USER = "user",
  COORDINATOR = "coordinator",
  COORDINATOR_MANAGER = "coordinator_manager",
  CALL_CENTER = "call-center",
  ADMIN = "admin",
}
export interface GetMissionsResponse {
  // missions:Mission[];
  missions:Mission[];
}


export interface GetVolunteerMissionResponse {
  elder_first_name: string,
  purpose: MissionPurpose;
  distance: number;
}

export interface setVolunteerMissionResponseAccept {
  elder_first_name: string,
  elder_phone_number: string,
  elder_address_lat: number,
  elder_address_lng: number,
  elder_address_str: string,
  additional_contact_name: string,
  additional_contact_phone: string,
  additional_contact_role: "doctor" | "family" | "other";
}

export interface scheduleMissionData{
  mission_id: string,
  schedule_date: string, //date
  preferred_hours: "morning"| "afternoon" |"evening";
}