export enum MissionState {
  pending = "pending", // Waiting for Volunteer to pick up the mission
  acquired = "acquired", // מובטח שיש מתנבדVolunteer took the mission but didn't report that he made the call TODO: Verify this statement with Roee
  started = "started", // מובטח שיש מתנדבVolunteer took the mission but didn't report it as completed yet
  canceled = "canceled", // Elder canceled the mission
  completed = "completed", // Volunteer took the mission and completed (we received ack from him)
  approved = "approved", // פעילה Mission approved by a coordinator(?)
  error = "error",
}

export interface Elder {
  id: string;
  phone_number: string;
  name: string;
  address: [number, number];
  address_str: string;
  is_active: boolean;
  mission?: Mission;
}

interface FromInput {
  name: string;
  value: string;
  hasError: boolean;
}

export interface PersonalDetailsBase {
  email: FromInput;
  address_str: FromInput;
}
export interface PersonalDetails extends PersonalDetailsBase {
  first_name: FromInput;
  last_name: FromInput;
  birthday: FromInput;
}

export type addressObj = {
  address_str: string;
  address_lat: number;
  address_lng: number;
};

export interface Volunteer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  birthday: string;
  phone_number: string;
  address: addressObj;
  address_name: string;
  is_active: boolean;
  is_subscribed: boolean;
  age: number;
  missionsAmount: number;
  signedForWhatsapp: boolean;
  lastMission?: Mission;
  active_mission?: Mission;
}

export type MissionPurpose = "grocery" | "pharmacy" | "grocery_and_pharmacy" | "general";

export const missionsPurposeDictionary: {
  [key in MissionPurpose]: string;
} = {
  general: "כללי",
  grocery: "קניות מהסופר",
  grocery_and_pharmacy: "קניות סופר ומרקחת",
  pharmacy: "בית מרקחת",
};

export interface Mission {
  uuid: string;
  volunteer?: Volunteer;
  elder_first_name: string;
  elder_last_name: string;
  elder_phone_number: string;
  elder_address?: addressObj;
  scheduled_to_date: string; // "2020-04-04";
  prefered_hours: dayTimes;
  payment_method: "cash" | "bank_transfer" | "check" | "no_payment";
  additional_contact_name?: string;
  additional_contact_phone?: string;
  additional_contact_email?: string;
  additional_contact_role?: "doctor" | "family" | "other";
  use_additional_contact: boolean;
  pickup_point: string;
  is_elder_need_visit_before: "yes" | "no" | "unknown";
  purpose: MissionPurpose;
  description: string;
  state: MissionState;
  state_last_updated_at?: string;
  error_state?: DeclineReason;
  owner_id?: number;
}

export type dayTimes = "morning" | "afternoon" | "evening";

export interface ErrorContainer {
  active: boolean;
  message: string;
}

export enum DeclineReason {
  no_one_answered = 'no_one_answered_call',
  not_relevant = 'not_relevant_anymore',
  refuse = 'refuse_mission',
  error_by_admin = 'error_by_admin',
}

export const HebrewDictionary: { [key: string]: string } = {
  yes: 'כן',
  no: 'לא',
  unknown: 'לא ידוע',
  cash: 'מזומן',
  bank_transfer: 'העברה בנקאית',
  check: 'צק',
  no_payment: 'ללא תשלום',
  pending: 'טופס ממתין לאישור',
  [MissionState.started]: 'מתנדב לקח משימה וכרגע בתהליך',
  [MissionState.acquired]: 'מתנדב אישר תנאים, אך טרם אישר משימה',
  [MissionState.approved]: 'הבקשה פעילה',
  [MissionState.canceled]: 'הבקשה בוטלה',
  [MissionState.completed]: 'המשימה הסתיימה בהצלחה',
  [MissionState.error]: 'שגיאה טכנית',
  [DeclineReason.refuse]: 'מתנדב אישר תנאים ולא המשיך',
  [DeclineReason.no_one_answered]: 'לא היה מענה ממבקש הסיוע',
  [DeclineReason.not_relevant]: 'הבקשה סווגה כלא רלוונטית',
  [DeclineReason.error_by_admin]: 'שגיאת מנהל מערכת',
};
export interface Homepage {
  volunteer: Volunteer;
  volunteers_count: number;
  elders_count: number;
  last_mission_elder_first_name: string;
  last_mission_completed_date: string;
  missions_amount: number;
}

export interface Coordinator {
  uuid: string;
  name: string;
  is_active: boolean;
}
