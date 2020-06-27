import datetime, enum

from typing import List, Optional
from pydantic import BaseModel, constr, EmailStr, UUID4, confloat

from app.models import MissionPreferedHours, MissionState, MissionErrorState
from .core import config
from . import models

# Constants
PHONE_NUMBER_REGEX = '^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$'
OTP_REGEX = '^[0-9]+$'
NAME_REGEX = '^[A-Za-z\u0590-\u05FF][A-Za-z\u0590-\u05FF\'\-]+([\ A-Za-z\u0590-\u05FF][A-Za-z\u0590-\u05FF\'\-]+)*'


@enum.unique
class SearchBy(models.AutoName):
    elder_name = enum.auto()


# volunteer_name = enum.auto()

#  --------- Common Types ---------
class Address(BaseModel):
    address_str: str
    address_lat: confloat(strict=True, ge=-90.0, le=90.0)
    address_lng: confloat(strict=True, ge=-180.0, le=180.0)

    def to_dict(self):
        return self.dict()


class ElderAddress(Address):
    def to_dict(self):
        return {'elder_address_str': self.address_str,
                'elder_address_lat': self.address_lat,
                'elder_address_lng': self.address_lng}


# Volunteer
class VolunteerBase(BaseModel):
    first_name: constr(regex=NAME_REGEX)
    last_name: constr(regex=NAME_REGEX)
    address: Optional[Address]
    phone_number: constr(regex=PHONE_NUMBER_REGEX)
    email: EmailStr


class Volunteer(VolunteerBase):
    age: int
    is_subscribed: bool

    class Config:
        orm_mode = True


# Mission
class Mission(BaseModel):
    elder_first_name: constr(regex=NAME_REGEX)
    elder_last_name: constr(regex=NAME_REGEX)
    elder_phone_number: constr(regex=PHONE_NUMBER_REGEX)
    elder_address: ElderAddress
    scheduled_to_date: datetime.date
    prefered_hours: models.MissionPreferedHours
    payment_method: models.MissionPaymentMethod
    additional_contact_name: Optional[constr(regex=NAME_REGEX)]
    additional_contact_phone: Optional[constr(regex=PHONE_NUMBER_REGEX)]
    additional_contact_email: Optional[EmailStr]
    additional_contact_role: Optional[models.MissionAdditionalContactRole]
    use_additional_contact: bool
    pickup_point: Optional[str]
    is_elder_need_visit_before: models.MissionIsElderNeedVisitBefore
    purpose: models.MissionPurpose
    description: Optional[str]


class VolunteerMission(Mission):
    uuid: UUID4
    state: models.MissionState
    error_state: Optional[models.MissionErrorState]
    volunteer: Optional[Volunteer]
    owner_id: Optional[int]
    state_changed_at: Optional[datetime.datetime]


class Coordinator(BaseModel):
    id: int
    name: str
    is_active: bool


# Authentication


class VolunteerAuthenticated(BaseModel):
    token: str
    user_role: str = models.VolunteerRole.user.value


#  --------- Requests ---------
class SearchMissionsRequest(BaseModel):
    value: constr(min_length=2, max_length=1024)


class GetMissions(BaseModel):
    missions: List[VolunteerMission]


class GetCoordinators(BaseModel):
    coordinators: List[Coordinator]


class RequestPhoneVerification(BaseModel):
    phone_number: constr(regex=PHONE_NUMBER_REGEX)


class ValidatePhoneVerification(BaseModel):
    phone_number: constr(regex=PHONE_NUMBER_REGEX)
    otp: constr(regex=OTP_REGEX, min_length=config.OTP_LENGTH, max_length=config.OTP_LENGTH)


class CreateMission(Mission):
    class Config:
        orm_mode = True

    def to_dict(self):
        mission_dict = self.dict(exclude={'elder_address', 'owner_id'})
        mission_dict.update(self.elder_address.to_dict())
        return mission_dict


class UpdateMission(CreateMission):
    uuid: UUID4
    owner_id: Optional[int]
    state: models.MissionState
    error_state: Optional[models.MissionErrorState]


class CreateVolunteer(BaseModel):
    first_name: constr(regex=NAME_REGEX)
    last_name: constr(regex=NAME_REGEX)
    address: Address
    phone_number: constr(regex=PHONE_NUMBER_REGEX)
    email: EmailStr
    birthday: datetime.date


class SetSubscriptionRequest(BaseModel):
    enabled: bool


class ElevateVolunteer(BaseModel):
    phone_number: constr(regex=PHONE_NUMBER_REGEX)
    role: models.VolunteerRole


class ChangeMissionStateRequest(BaseModel):
    mission_id: UUID4
    mission_state: models.MissionState
    error_state: Optional[models.MissionErrorState]


class DeclineMissionRequest(BaseModel):
    reason: models.MissionErrorState


class ScheduleMissionRequest(BaseModel):
    mission_id: UUID4
    schedule_date: datetime.date
    preferred_hours: MissionPreferedHours


#  --------- Responses ---------
class GetHomePageResponse(BaseModel):
    volunteer: Volunteer
    missions_amount: int
    volunteers_count: int
    elders_count: int
    last_mission_elder_first_name: str
    last_mission_elder_address: str
    last_mission_completed_date: datetime.date


class OtpSentToVolunteerResponse(BaseModel):
    expired_at: datetime.datetime
    attempts_left: int


class OtpMismatchResponse(BaseModel):
    attempts_left: int


class VolunteerLoggedInResponse(VolunteerAuthenticated):
    class Config:
        orm_mode = True


class VolunteerCreatedResponse(VolunteerAuthenticated):
    class Config:
        orm_mode = True


# Slim mission before confirmations
class SlimMissionResponse(BaseModel):
    elder_first_name: constr(regex=NAME_REGEX)
    purpose: models.MissionPurpose
    distance: int
    state: MissionState
    error_state: Optional[MissionErrorState]


class MissionStartedResponse(BaseModel):
    elder_first_name: constr(regex=NAME_REGEX)
    elder_phone_number: constr(regex=PHONE_NUMBER_REGEX)
    elder_address: Address
    additional_contact_name: Optional[constr(regex=NAME_REGEX)]
    additional_contact_phone: Optional[constr(regex=PHONE_NUMBER_REGEX)]
    additional_contact_role: Optional[models.MissionAdditionalContactRole]


class UpdateVolunteerInfoRequest(BaseModel):
    new_email: EmailStr
    new_address: Address


#  --------- Errors ---------
class PhoneVerificationNotEnoughTimePassedError(BaseModel):
    @staticmethod
    def description():
        return "Not enough time passed since your last phone verification attempt, " \
               "please wait few minutes before trying again"


class OtpNeverSentForThisPhoneNumber(BaseModel):
    @staticmethod
    def description():
        return "OTP never sent to this phone number, " \
               "please generate new SMS verification"


class OtpExpired(BaseModel):
    @staticmethod
    def description():
        return "OTP expired, Too many attempts to to guess this OTP, " \
               "please generate new SMS verification"


class PhoneNumberAlreadyRegistered(BaseModel):
    @staticmethod
    def description():
        return "Phone number already registered"


class PhoneNumberNeedSMSAuthenticate(BaseModel):
    @staticmethod
    def description():
        return "Phone number need SMS verification via OTP, please authenticate first"


class AlreadyAuthenticated(BaseModel):
    @staticmethod
    def description():
        return "Phone number already authenticated via otp, please register"


class VolunteerIsNotCallCenter(BaseModel):
    @staticmethod
    def description():
        return "Only volunteer with call-center role can access"


class VolunteerIsNotAdmin(BaseModel):
    @staticmethod
    def description():
        return "Only volunteer with admin role can access"


class MissionNotFound(BaseModel):
    @staticmethod
    def description():
        return "There is no mission with this mission id"


class MissionNotApproved(BaseModel):
    @staticmethod
    def description():
        return "The mission status is not approved"
