import { setVolunteerMissionDecline } from '../services/Volunteer.service';

const SMS_Verification = 'sms_verification';
const Volunteer = 'volunteer';
const Mission = 'mission';
const Create = 'create';
const Update = 'update';

export const Config = {
  API_URL: process.env.REACT_APP_API_URL,
  GOOGLE_API_KEY: process.env.REACT_APP_GOOGLE_API_KEY,
  tokenPrefix: 'd2dSid',
  rolePrefix: 'd2dSid:role',
  routePrefix: 'd2dSid:route',
  languagePrefix: 'd2dSid:lang',
  supportedLanguages: ["heb", "en"],
  AppRoutes: {
    Login: '/login',
    Homepage: '/homepage',
    Mission: '/mission',
    CallCenter: '/call-center',
    Coordinator: '/coordinator',
    NewSubmission: '/new-submission',
  },
  EndPoints: {
    Login: {
      RequestOtp: `${SMS_Verification}/request_otp`,
      ValidateOtp: `${SMS_Verification}/validate_otp`,
    },
    // Volunteer
    Volunteer: {
      Create: `${Volunteer}/${Create}`,
      Get: `${Volunteer}/homepage`,
      GetVolunteerMission: `${Volunteer}/${Mission}/`,
      Update: `${Volunteer}/update_information`,
      Delete: `${Volunteer}/delete`,
      setVolunteerMissionAccept: `${Volunteer}/${Mission}/`,
      setVolunteerMissionDecline: `${Volunteer}/${Mission}/`,
      accept: '/accept',
      decline: '/decline',
      Subscribe: `${Volunteer}/subscription`,
      Coordinators: `${Volunteer}/coordinators`
    },
    Mission: {
      GetVolunteerMission: `${Volunteer}/${Mission}/`,
      ScheduleMission: `${Mission}/schedule`,
      ChangeState: `${Mission}/change_state`,
      Create: `${Mission}/${Create}`,
      Update: `${Mission}/${Update}`,
      GetMissions: `${Mission}/`,
      GetMissionsSearch: `${Mission}/search`,
    },
  },
  Reggex: {
    universalPhone: /^\d{12,15}$/,
    phone: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
    name: /^[A-Za-z\u0590-\u05FF][A-Za-z\u0590-\u05FF\'\-]+([\ A-Za-z\u0590-\u05FF][A-Za-z\u0590-\u05FF\'\-]+)*/,
    email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },
  dateTimeFormat: "DD.MM.YYYY  |  HH:mm"
};
