import { Elder, Mission, Volunteer, MissionState } from "./Contracts";
import { GetVolunteerMissionResponse } from "./Responses.Contracts";

export const DemoVolunteer: Volunteer = {
  id: "123",
  email: "gadytal5@gmail.com",
  phone_number: "0549011312",
  first_name: "גדי",
  last_name: "טל",
  address: {
    address_str: "תל אביב, רוטשילד 74",
    address_lat: 31,
    address_lng: 30,
  },
  address_name: "Tel Aviv",
  is_active: true,
  is_subscribed: false,
  age: 27,
  signedForWhatsapp: false,
  missionsAmount: 7,
  birthday: "1991-08-06",
};

export const DemoElder: Elder = {
  id: "12345",
  phone_number: "0549011315",
  name: "אסף",
  address: [32, 32],
  address_str: "יבנה 32, תל אביב",
  is_active: true,
};

export const DemoMission: Mission = {
  uuid: "1",
  elder_first_name: "--דוגמא",
  elder_last_name: "שנירר",
  elder_phone_number: "0549011315",
  elder_address: {
    address_str: "יבנה 32, תל אביב",
    address_lat: 2,
    address_lng: 43,
  },
  scheduled_to_date: "2020-04-04",
  prefered_hours: "morning",
  payment_method: "cash",
  additional_contact_name: "רותם",
  additional_contact_phone: "0549014444",
  additional_contact_role: "family",
  use_additional_contact: true,
  pickup_point: "מהכתובת המקורית",
  is_elder_need_visit_before: "yes",
  purpose: "pharmacy",
  description: "אנשים אלופים יש פה",
  state: MissionState.approved,
};

export const DemoMission2: Mission = {
  uuid: "2",
  elder_first_name: "גילעד",
  elder_last_name: "אפרתי",
  elder_phone_number: "0549021345",
  elder_address: {
    address_str: "יבנה 32, רעננה",
    address_lat: 2,
    address_lng: 43,
  },
  scheduled_to_date: "2020-08-04",
  prefered_hours: "evening",
  payment_method: "check",
  additional_contact_name: "רותם",
  additional_contact_phone: "0549014444",
  additional_contact_role: "family",
  use_additional_contact: false,
  pickup_point: "מהכתובת המקורית",
  is_elder_need_visit_before: "no",
  purpose: "grocery",
  description: "חולה עליכם אנשים",
  state: MissionState.completed,
};
export const DemoMissionsArray: Mission[] = [DemoMission, DemoMission2];

export const DemoVolunteerMission: GetVolunteerMissionResponse = {
  elder_first_name: "דוגמא",
  distance: 750,
  purpose: "pharmacy",
};
