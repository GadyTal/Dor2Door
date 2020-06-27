declare namespace Components {
    namespace Schemas {
        /**
         * Address
         */
        export interface Address {
            /**
             * Address Str
             */
            address_str: string;
            /**
             * Address Lat
             */
            address_lat: number;
            /**
             * Address Lng
             */
            address_lng: number;
        }
        /**
         * ChangeMissionStateRequest
         */
        export interface ChangeMissionStateRequest {
            /**
             * Mission Id
             */
            mission_id: string; // uuid4
            /**
             * Mission State
             */
            mission_state: "pending" | "approved" | "acquired" | "started" | "completed" | "canceled" | "error";
            /**
             * Error State
             */
            error_state?: "no_one_answered_call" | "not_relevant_anymore" | "no_volunteers_found" | "refuse_mission" | "error_by_admin";
        }
        /**
         * Coordinator
         */
        export interface Coordinator {
            /**
             * Uuid
             */
            uuid: string; // uuid4
            /**
             * Name
             */
            name: string;
            /**
             * Is Active
             */
            is_active: boolean;
        }
        /**
         * CreateMission
         */
        export interface CreateMission {
            /**
             * Elder First Name
             */
            elder_first_name: string; // ^[A-Za-z֐-׿][A-Za-z֐-׿'\-]+([\ A-Za-z֐-׿][A-Za-z֐-׿'\-]+)*
            /**
             * Elder Last Name
             */
            elder_last_name: string; // ^[A-Za-z֐-׿][A-Za-z֐-׿'\-]+([\ A-Za-z֐-׿][A-Za-z֐-׿'\-]+)*
            /**
             * Elder Phone Number
             */
            elder_phone_number: string; // ^[0-9]{12,15}$
            elder_address: Address;
            /**
             * Scheduled To Date
             */
            scheduled_to_date: string; // date
            /**
             * Prefered Hours
             */
            prefered_hours: "morning" | "afternoon" | "evening";
            /**
             * Payment Method
             */
            payment_method: "cash" | "bank_transfer" | "check" | "no_payment";
            /**
             * Additional Contact Name
             */
            additional_contact_name?: string; // ^[A-Za-z֐-׿][A-Za-z֐-׿'\-]+([\ A-Za-z֐-׿][A-Za-z֐-׿'\-]+)*
            /**
             * Additional Contact Phone
             */
            additional_contact_phone?: string; // ^[0-9]{12,15}$
            /**
             * Additional Contact Email
             */
            additional_contact_email?: string; // email
            /**
             * Additional Contact Role
             */
            additional_contact_role?: "doctor" | "family" | "other";
            /**
             * Use Additional Contact
             */
            use_additional_contact: boolean;
            /**
             * Pickup Point
             */
            pickup_point?: string;
            /**
             * Is Elder Need Visit Before
             */
            is_elder_need_visit_before: "yes" | "no" | "unknown";
            /**
             * Purpose
             */
            purpose: "grocery" | "pharmacy" | "grocery_and_pharmacy" | "general";
            /**
             * Description
             */
            description?: string;
        }
        /**
         * CreateVolunteer
         */
        export interface CreateVolunteer {
            /**
             * First Name
             */
            first_name: string; // ^[A-Za-z֐-׿][A-Za-z֐-׿'\-]+([\ A-Za-z֐-׿][A-Za-z֐-׿'\-]+)*
            /**
             * Last Name
             */
            last_name: string; // ^[A-Za-z֐-׿][A-Za-z֐-׿'\-]+([\ A-Za-z֐-׿][A-Za-z֐-׿'\-]+)*
            address: Address;
            /**
             * Phone Number
             */
            phone_number: string; // ^[0-9]{12,15}$
            /**
             * Email
             */
            email: string; // email
            /**
             * Birthday
             */
            birthday: string; // date
        }
        /**
         * DeclineMissionRequest
         */
        export interface DeclineMissionRequest {
            /**
             * Reason
             */
            reason: "no_one_answered_call" | "not_relevant_anymore" | "no_volunteers_found" | "refuse_mission" | "error_by_admin";
        }
        /**
         * ElevateVolunteer
         */
        export interface ElevateVolunteer {
            /**
             * Phone Number
             */
            phone_number: string; // ^[0-9]{12,15}$
            /**
             * Role
             */
            role: "user" | "coordinator" | "call_center" | "support" | "admin" | "coordinator_manager";
        }
        /**
         * GetCoordinators
         */
        export interface GetCoordinators {
            /**
             * Coordinators
             */
            coordinators: Coordinator[];
        }
        /**
         * GetHomePageResponse
         */
        export interface GetHomePageResponse {
            volunteer: Volunteer;
            /**
             * Missions Amount
             */
            missions_amount: number;
            /**
             * Volunteers Count
             */
            volunteers_count: number;
            /**
             * Elders Count
             */
            elders_count: number;
            /**
             * Last Mission Elder First Name
             */
            last_mission_elder_first_name: string;
            /**
             * Last Mission Elder Address
             */
            last_mission_elder_address: string;
            /**
             * Last Mission Completed Date
             */
            last_mission_completed_date: string; // date
        }
        /**
         * GetMissions
         */
        export interface GetMissions {
            /**
             * Missions
             */
            missions: VolunteerMission[];
        }
        /**
         * HTTPValidationError
         */
        export interface HTTPValidationError {
            /**
             * Detail
             */
            detail?: ValidationError[];
        }
        /**
         * Mission
         */
        export interface Mission {
            /**
             * Elder First Name
             */
            elder_first_name: string; // ^[A-Za-z֐-׿][A-Za-z֐-׿'\-]+([\ A-Za-z֐-׿][A-Za-z֐-׿'\-]+)*
            /**
             * Elder Last Name
             */
            elder_last_name: string; // ^[A-Za-z֐-׿][A-Za-z֐-׿'\-]+([\ A-Za-z֐-׿][A-Za-z֐-׿'\-]+)*
            /**
             * Elder Phone Number
             */
            elder_phone_number: string; // ^[0-9]{12,15}$
            elder_address: Address;
            /**
             * Scheduled To Date
             */
            scheduled_to_date: string; // date
            /**
             * Prefered Hours
             */
            prefered_hours: "morning" | "afternoon" | "evening";
            /**
             * Payment Method
             */
            payment_method: "cash" | "bank_transfer" | "check" | "no_payment";
            /**
             * Additional Contact Name
             */
            additional_contact_name?: string; // ^[A-Za-z֐-׿][A-Za-z֐-׿'\-]+([\ A-Za-z֐-׿][A-Za-z֐-׿'\-]+)*
            /**
             * Additional Contact Phone
             */
            additional_contact_phone?: string; // ^[0-9]{12,15}$
            /**
             * Additional Contact Email
             */
            additional_contact_email?: string; // email
            /**
             * Additional Contact Role
             */
            additional_contact_role?: "doctor" | "family" | "other";
            /**
             * Use Additional Contact
             */
            use_additional_contact: boolean;
            /**
             * Pickup Point
             */
            pickup_point?: string;
            /**
             * Is Elder Need Visit Before
             */
            is_elder_need_visit_before: "yes" | "no" | "unknown";
            /**
             * Purpose
             */
            purpose: "grocery" | "pharmacy" | "grocery_and_pharmacy" | "general";
            /**
             * Description
             */
            description?: string;
        }
        /**
         * MissionNotApproved
         */
        export interface MissionNotApproved {
        }
        /**
         * MissionStartedResponse
         */
        export interface MissionStartedResponse {
            /**
             * Elder First Name
             */
            elder_first_name: string; // ^[A-Za-z֐-׿][A-Za-z֐-׿'\-]+([\ A-Za-z֐-׿][A-Za-z֐-׿'\-]+)*
            /**
             * Elder Phone Number
             */
            elder_phone_number: string; // ^[0-9]{12,15}$
            elder_address: Address;
            /**
             * Additional Contact Name
             */
            additional_contact_name?: string; // ^[A-Za-z֐-׿][A-Za-z֐-׿'\-]+([\ A-Za-z֐-׿][A-Za-z֐-׿'\-]+)*
            /**
             * Additional Contact Phone
             */
            additional_contact_phone?: string; // ^[0-9]{12,15}$
            /**
             * Additional Contact Role
             */
            additional_contact_role?: "doctor" | "family" | "other";
        }
        /**
         * OtpExpired
         */
        export interface OtpExpired {
        }
        /**
         * OtpMismatchResponse
         */
        export interface OtpMismatchResponse {
            /**
             * Attempts Left
             */
            attempts_left: number;
        }
        /**
         * OtpNeverSentForThisPhoneNumber
         */
        export interface OtpNeverSentForThisPhoneNumber {
        }
        /**
         * OtpSentToVolunteerResponse
         */
        export interface OtpSentToVolunteerResponse {
            /**
             * Expired At
             */
            expired_at: string; // date-time
            /**
             * Attempts Left
             */
            attempts_left: number;
        }
        /**
         * PhoneNumberAlreadyRegistered
         */
        export interface PhoneNumberAlreadyRegistered {
        }
        /**
         * PhoneNumberNeedSMSAuthenticate
         */
        export interface PhoneNumberNeedSMSAuthenticate {
        }
        /**
         * PhoneVerificationNotEnoughTimePassedError
         */
        export interface PhoneVerificationNotEnoughTimePassedError {
        }
        /**
         * RequestPhoneVerification
         */
        export interface RequestPhoneVerification {
            /**
             * Phone Number
             */
            phone_number: string; // ^[0-9]{12,15}$
        }
        /**
         * ScheduleMissionRequest
         */
        export interface ScheduleMissionRequest {
            /**
             * Mission Id
             */
            mission_id: string; // uuid4
            /**
             * Schedule Date
             */
            schedule_date: string; // date
            /**
             * Preferred Hours
             */
            preferred_hours: "morning" | "afternoon" | "evening";
        }
        /**
         * SearchMissionsRequest
         */
        export interface SearchMissionsRequest {
            /**
             * Value
             */
            value: string;
        }
        /**
         * SetSubscriptionRequest
         */
        export interface SetSubscriptionRequest {
            /**
             * Enabled
             */
            enabled: boolean;
        }
        /**
         * SlimMissionResponse
         */
        export interface SlimMissionResponse {
            /**
             * Elder First Name
             */
            elder_first_name: string; // ^[A-Za-z֐-׿][A-Za-z֐-׿'\-]+([\ A-Za-z֐-׿][A-Za-z֐-׿'\-]+)*
            /**
             * Purpose
             */
            purpose: "grocery" | "pharmacy" | "grocery_and_pharmacy" | "general";
            /**
             * Distance
             */
            distance: number;
            /**
             * State
             */
            state: "pending" | "approved" | "acquired" | "started" | "completed" | "canceled" | "error";
            /**
             * Error State
             */
            error_state?: "no_one_answered_call" | "not_relevant_anymore" | "no_volunteers_found" | "refuse_mission" | "error_by_admin";
        }
        /**
         * UpdateVolunteerInfoRequest
         */
        export interface UpdateVolunteerInfoRequest {
            /**
             * New Email
             */
            new_email: string; // email
            new_address: Address;
        }
        /**
         * ValidatePhoneVerification
         */
        export interface ValidatePhoneVerification {
            /**
             * Phone Number
             */
            phone_number: string; // ^[0-9]{12,15}$
            /**
             * Otp
             */
            otp: string; // ^[0-9]+$
        }
        /**
         * ValidationError
         */
        export interface ValidationError {
            /**
             * Location
             */
            loc: string[];
            /**
             * Message
             */
            msg: string;
            /**
             * Error Type
             */
            type: string;
        }
        /**
         * Volunteer
         */
        export interface Volunteer {
            /**
             * First Name
             */
            first_name: string; // ^[A-Za-z֐-׿][A-Za-z֐-׿'\-]+([\ A-Za-z֐-׿][A-Za-z֐-׿'\-]+)*
            /**
             * Last Name
             */
            last_name: string; // ^[A-Za-z֐-׿][A-Za-z֐-׿'\-]+([\ A-Za-z֐-׿][A-Za-z֐-׿'\-]+)*
            address?: Address;
            /**
             * Phone Number
             */
            phone_number: string; // ^[0-9]{12,15}$
            /**
             * Email
             */
            email: string; // email
            /**
             * Age
             */
            age: number;
            /**
             * Is Subscribed
             */
            is_subscribed: boolean;
        }
        /**
         * VolunteerCreatedResponse
         */
        export interface VolunteerCreatedResponse {
            /**
             * Token
             */
            token: string;
            /**
             * User Role
             */
            user_role?: string;
        }
        /**
         * VolunteerIsNotAdmin
         */
        export interface VolunteerIsNotAdmin {
        }
        /**
         * VolunteerIsNotCallCenter
         */
        export interface VolunteerIsNotCallCenter {
        }
        /**
         * VolunteerLoggedInResponse
         */
        export interface VolunteerLoggedInResponse {
            /**
             * Token
             */
            token: string;
            /**
             * User Role
             */
            user_role?: string;
        }
        /**
         * VolunteerMission
         */
        export interface VolunteerMission {
            /**
             * Elder First Name
             */
            elder_first_name: string; // ^[A-Za-z֐-׿][A-Za-z֐-׿'\-]+([\ A-Za-z֐-׿][A-Za-z֐-׿'\-]+)*
            /**
             * Elder Last Name
             */
            elder_last_name: string; // ^[A-Za-z֐-׿][A-Za-z֐-׿'\-]+([\ A-Za-z֐-׿][A-Za-z֐-׿'\-]+)*
            /**
             * Elder Phone Number
             */
            elder_phone_number: string; // ^[0-9]{12,15}$
            elder_address: Address;
            /**
             * Scheduled To Date
             */
            scheduled_to_date: string; // date
            /**
             * Prefered Hours
             */
            prefered_hours: "morning" | "afternoon" | "evening";
            /**
             * Payment Method
             */
            payment_method: "cash" | "bank_transfer" | "check" | "no_payment";
            /**
             * Additional Contact Name
             */
            additional_contact_name?: string; // ^[A-Za-z֐-׿][A-Za-z֐-׿'\-]+([\ A-Za-z֐-׿][A-Za-z֐-׿'\-]+)*
            /**
             * Additional Contact Phone
             */
            additional_contact_phone?: string; // ^[0-9]{12,15}$
            /**
             * Additional Contact Email
             */
            additional_contact_email?: string; // email
            /**
             * Additional Contact Role
             */
            additional_contact_role?: "doctor" | "family" | "other";
            /**
             * Use Additional Contact
             */
            use_additional_contact: boolean;
            /**
             * Pickup Point
             */
            pickup_point?: string;
            /**
             * Is Elder Need Visit Before
             */
            is_elder_need_visit_before: "yes" | "no" | "unknown";
            /**
             * Purpose
             */
            purpose: "grocery" | "pharmacy" | "grocery_and_pharmacy" | "general";
            /**
             * Description
             */
            description?: string;
            /**
             * Uuid
             */
            uuid: string; // uuid4
            /**
             * State
             */
            state: "pending" | "approved" | "acquired" | "started" | "completed" | "canceled" | "error";
            /**
             * Error State
             */
            error_state?: "no_one_answered_call" | "not_relevant_anymore" | "no_volunteers_found" | "refuse_mission" | "error_by_admin";
            volunteer?: Volunteer;
        }
    }
}
declare namespace Paths {
    namespace AcceptMissionApiV1VolunteerMission_Uuid_AcceptPost {
        namespace Parameters {
            /**
             * Uuid
             */
            export type Uuid = string; // uuid4
        }
        export interface PathParameters {
            uuid: Parameters.Uuid; // uuid4
        }
        namespace Responses {
            export type $200 = Components.Schemas.MissionStartedResponse;
            export type $422 = Components.Schemas.HTTPValidationError;
        }
    }
    namespace ChangeMissionStateApiV1MissionChangeStatePost {
        export type RequestBody = Components.Schemas.ChangeMissionStateRequest;
        namespace Responses {
            export type $200 = any;
            export type $422 = Components.Schemas.HTTPValidationError;
        }
    }
    namespace CompleteMissionApiV1VolunteerMission_Uuid_CompletePost {
        namespace Parameters {
            /**
             * Uuid
             */
            export type Uuid = string; // uuid4
        }
        export interface PathParameters {
            uuid: Parameters.Uuid; // uuid4
        }
        namespace Responses {
            export type $200 = Components.Schemas.MissionStartedResponse;
            export type $422 = Components.Schemas.HTTPValidationError;
        }
    }
    namespace ConsiderTakingMissionApiV1Mission_Uuid_Get {
        namespace Parameters {
            /**
             * Uuid
             */
            export type Uuid = string;
        }
        export interface PathParameters {
            uuid: Parameters.Uuid;
        }
        namespace Responses {
            export type $302 = any;
            export type $422 = Components.Schemas.HTTPValidationError;
        }
    }
    namespace CreateMissionApiV1MissionCreatePut {
        export type RequestBody = Components.Schemas.CreateMission;
        namespace Responses {
            export type $201 = any;
            export type $412 = Components.Schemas.VolunteerIsNotCallCenter;
            export type $422 = Components.Schemas.HTTPValidationError;
        }
    }
    namespace CreateVolunteerApiV1VolunteerCreatePut {
        export type RequestBody = Components.Schemas.CreateVolunteer;
        namespace Responses {
            export type $201 = Components.Schemas.VolunteerCreatedResponse;
            export type $400 = Components.Schemas.PhoneNumberAlreadyRegistered;
            export type $401 = Components.Schemas.PhoneNumberNeedSMSAuthenticate;
            export type $422 = Components.Schemas.HTTPValidationError;
        }
    }
    namespace DeclineMissionApiV1VolunteerMission_Uuid_DeclinePost {
        namespace Parameters {
            /**
             * Uuid
             */
            export type Uuid = string; // uuid4
        }
        export interface PathParameters {
            uuid: Parameters.Uuid; // uuid4
        }
        export type RequestBody = Components.Schemas.DeclineMissionRequest;
        namespace Responses {
            export type $200 = Components.Schemas.SlimMissionResponse;
            export type $422 = Components.Schemas.HTTPValidationError;
        }
    }
    namespace DeleteVolunteerApiV1VolunteerDeleteDelete {
        namespace Responses {
            export type $200 = any;
        }
    }
    namespace ElevateVolunteerApiV1AdminElevatePost {
        export type RequestBody = Components.Schemas.ElevateVolunteer;
        namespace Responses {
            export type $200 = any;
            export type $412 = Components.Schemas.VolunteerIsNotAdmin;
            export type $422 = Components.Schemas.HTTPValidationError;
        }
    }
    namespace GetCoordinatorsApiV1VolunteerCoordinatorsGet {
        namespace Responses {
            export type $200 = Components.Schemas.GetCoordinators;
        }
    }
    namespace GetMissionsApiV1Mission_Get {
        namespace Responses {
            export type $200 = Components.Schemas.GetMissions;
        }
    }
    namespace GetStatisticsApiV1Admin_Get {
        namespace Responses {
            export type $200 = any;
        }
    }
    namespace GetVolunteerHomePageApiV1VolunteerHomepageGet {
        namespace Responses {
            export type $200 = Components.Schemas.GetHomePageResponse;
        }
    }
    namespace GetVolunteerMissionApiV1VolunteerMission_Uuid_Get {
        namespace Parameters {
            /**
             * Uuid
             */
            export type Uuid = string; // uuid4
        }
        export interface PathParameters {
            uuid: Parameters.Uuid; // uuid4
        }
        namespace Responses {
            export type $200 = any;
            export type $422 = Components.Schemas.HTTPValidationError;
        }
    }
    namespace RequestPhoneVerificationApiV1SmsVerificationRequestOtpPost {
        export type RequestBody = Components.Schemas.RequestPhoneVerification;
        namespace Responses {
            export type $202 = Components.Schemas.OtpSentToVolunteerResponse;
            export type $403 = Components.Schemas.PhoneVerificationNotEnoughTimePassedError;
            export type $422 = Components.Schemas.HTTPValidationError;
        }
    }
    namespace ScheduleMissionApiV1MissionSchedulePost {
        export type RequestBody = Components.Schemas.ScheduleMissionRequest;
        namespace Responses {
            export type $200 = Components.Schemas.Mission;
            export type $412 = Components.Schemas.MissionNotApproved;
            export type $422 = Components.Schemas.HTTPValidationError;
        }
    }
    namespace SearchMissionsApiV1MissionSearchPost {
        export type RequestBody = Components.Schemas.SearchMissionsRequest;
        namespace Responses {
            export type $200 = Components.Schemas.GetMissions;
            export type $422 = Components.Schemas.HTTPValidationError;
        }
    }
    namespace SetSubscriptionApiV1VolunteerSubscriptionPost {
        export type RequestBody = Components.Schemas.SetSubscriptionRequest;
        namespace Responses {
            export type $200 = any;
            export type $422 = Components.Schemas.HTTPValidationError;
        }
    }
    namespace SetVolunteerDetailsApiV1VolunteerUpdateInformationPost {
        export type RequestBody = Components.Schemas.UpdateVolunteerInfoRequest;
        namespace Responses {
            export type $200 = any;
            export type $422 = Components.Schemas.HTTPValidationError;
        }
    }
    namespace ValidatePhoneVerificationApiV1SmsVerificationValidateOtpPost {
        export type RequestBody = Components.Schemas.ValidatePhoneVerification;
        namespace Responses {
            export type $200 = Components.Schemas.VolunteerLoggedInResponse;
            export type $400 = Components.Schemas.OtpNeverSentForThisPhoneNumber;
            export type $403 = Components.Schemas.OtpMismatchResponse;
            export type $408 = Components.Schemas.OtpExpired;
            export type $422 = Components.Schemas.HTTPValidationError;
        }
    }
    namespace VerifyMissionApiV1TasksVerifyMission_MissionUuid_InternalToken_Token_Get {
        namespace Parameters {
            /**
             * Mission Uuid
             */
            export type MissionUuid = string; // uuid4
            /**
             * Token
             */
            export type Token = string;
        }
        export interface PathParameters {
            mission_uuid: Parameters.MissionUuid; // uuid4
            token: Parameters.Token;
        }
        namespace Responses {
            export type $200 = any;
            export type $422 = Components.Schemas.HTTPValidationError;
        }
    }
}
