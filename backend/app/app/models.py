import geopy.distance
import enum
import datetime
from collections import namedtuple

from sqlalchemy import Boolean, Column, Date, DateTime, Enum, Float, ForeignKey, Integer, String, Text, func, case, \
    BigInteger
from sqlalchemy.orm import relationship, validates, backref
from sqlalchemy.sql.expression import and_
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.hybrid import hybrid_property, hybrid_method

import geopy
from .core import config

from .db.base_class import Base, object_to_dict


def get_utc_now():
    return datetime.datetime.utcnow()

Coordinates = namedtuple('Coordinates', ['lat', 'lng'])

# Note: Enums names (strings) will be persisted in DB not values


class AutoName(enum.Enum):
    def _generate_next_value_(name, start, count, last_values):
        return name


@enum.unique
class MissionErrorState(AutoName):
    no_one_answered_call = enum.auto()
    not_relevant_anymore = enum.auto()
    no_volunteers_found  = enum.auto()
    refuse_mission       = enum.auto()
    error_by_admin       = enum.auto()


@enum.unique
class MissionPurpose(AutoName):
    grocery              = enum.auto()
    pharmacy             = enum.auto()
    grocery_and_pharmacy = enum.auto()
    general              = enum.auto()


@enum.unique
class MissionState(AutoName):
    pending   = enum.auto()  # Waiting for coordinator to approve the request
    approved  = enum.auto()  # Waiting for Volunteer to pick up the mission (get_near_by_volunteer)
    acquired  = enum.auto()  # Volunteer (possibly more than one) took the mission but didn't report that he made the call
    started   = enum.auto()  # Volunteer took the mission but didn't report it as completed yet
    completed = enum.auto()  # Volunteer took the mission and completed (we received ack from him)
    canceled  = enum.auto()  # Mission have been canceled by cooridnator
    error     = enum.auto()  # Mission is in error case please look at MissionErrorState Enum


@enum.unique
class VolunteerMissionState(AutoName):
    pending        = enum.auto()  # The mission has been sent to volunteers. Pending for volunteer accept.
    declined       = enum.auto()  # The mission has been sent to volunteers. Declined by the volunteer.
    accepted       = enum.auto()  # The mission has been accepted by volunteer.


@enum.unique
class VolunteerRole(AutoName):
    user        = enum.auto()
    coordinator = enum.auto()
    call_center = enum.auto()
    support     = enum.auto()
    admin       = enum.auto()
    coordinator_manager = enum.auto()


@enum.unique
class MissionIsElderNeedVisitBefore(AutoName):
    yes     = enum.auto()
    no      = enum.auto()
    unknown = enum.auto()


@enum.unique
class MissionPreferedHours(AutoName):
    morning   = enum.auto()
    afternoon = enum.auto()
    evening   = enum.auto()


@enum.unique
class MissionPaymentMethod(AutoName):
    cash          = enum.auto()
    bank_transfer = enum.auto()
    check         = enum.auto()
    no_payment    = enum.auto()


@enum.unique
class MissionAdditionalContactRole(AutoName):
    doctor        = enum.auto()
    family        = enum.auto()
    other         = enum.auto()


class OtpVerification(Base):
    __tablename__ = 'otp_verifications'

    id             = Column(Integer, primary_key=True, index=True)
    phone_number   = Column(String, unique=True, index=True)
    created_at     = Column(DateTime, default=get_utc_now)
    updated_at     = Column(DateTime, default=get_utc_now, onupdate=get_utc_now)
    otp_code       = Column(String)
    attempts_left  = Column(Integer, default=config.PHONE_VALIDATION_MAX_ATTEMPTS)
    authenticated  = Column(Boolean, default=False)


class Volunteer(Base):
    __tablename__ = 'volunteers'

    id                       = Column(Integer, primary_key=True, index=True)
    uuid                     = Column(UUID(as_uuid=True), unique=True, nullable=False)
    created_at               = Column(DateTime, default=get_utc_now)
    updated_at               = Column(DateTime, onupdate=get_utc_now)
    phone_number             = Column(String, unique=True, index=True)
    email                    = Column(String, unique=True, index=True)
    first_name               = Column(String)
    last_name                = Column(String)
    role                     = Column(Enum(VolunteerRole), index=True, default=VolunteerRole.user)
    address_lat              = Column(Float, index=True, nullable=False)
    address_lng              = Column(Float, index=True, nullable=False)
    address_str              = Column(Text)
    birthday                 = Column(Date)
    is_subscribed            = Column(Boolean, default=True)
    last_whatsapp_welcome_at = Column(DateTime, default=None, nullable=True)
    last_whatsapp_mission_at = Column(DateTime, default=None, nullable=True)
    is_active                = Column(Boolean, default=True)
    missions                 = relationship('Mission', secondary='volunteer_mission')
    coordinator_missions     = relationship("Mission", backref='owner')

    # Not reflects in database (just for comfort)
    # active_mission = relationship('Mission', back_populates='volunteer')

    @hybrid_method
    def is_inside_great_square(self, down_left_coord: Coordinates, up_right_coord: Coordinates):
        # Tries to figure out wether or not this volunteer within the great square provided.
        return self.address_lat <= down_left_coord.lat and self.address_lat >= up_right_coord.lat and \
               self.address_lng <= down_left_coord.lng and self.address_lng >= up_right_coord.lng
        #rows = db.execute(f'SELECT * FROM volunteers WHERE volunteers.address_lat <= {square_down_left_point.lat} AND volunteers.address_lat >= {square_up_right_point.lat} AND volunteers.address_lng <= {square_down_left_point.lng} AND volunteers.address_lng >= {square_up_right_point.lng} LIMIT 10').fetchall()# TODO change limit

    @is_inside_great_square.expression
    def is_inside_great_square(cls, down_left_coord: Coordinates, up_right_coord: Coordinates):
        return and_(cls.address_lat >= down_left_coord.lat, cls.address_lat <= up_right_coord.lat,
            cls.address_lng >= down_left_coord.lng, cls.address_lng <= up_right_coord.lng).label('is_inside_great_square')

    @hybrid_property
    def first_name_capitalized(self):
        return self.first_name.capitalize()

    @hybrid_property
    def last_name_capitalized(self):
        return self.last_name.capitalize()

    @hybrid_property
    def name(self):
        return f'{self.first_name} {self.last_name}'

    @hybrid_property
    def address_coords(self):
        return Coordinates(lat=self.address_lat, lng=self.address_lng)

    @hybrid_property
    def age(self):
        return get_utc_now().year - self.birthday.year

    @hybrid_property
    def last_completed_mission(self):
        return self.last_mission_with_state(MissionState.completed)

    @hybrid_property
    def active_mission(self):
        return self.last_mission_with_state(MissionState.started)

    @hybrid_property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    @hybrid_property
    def address(self):
        return Coordinates(lat=self.address_lat, lng=self.address_lng)

    def calculate_distance_from(self, point: Coordinates):
        return geopy.distance.vincenty((self.address_lat, self.address_lng), (point.lat, point.lng))

    def last_mission_with_state(self, state):
        missions = list(filter(lambda m: m.state == state, self.missions))
        if len(missions) > 0:
            return sorted(missions, key=lambda m: m.state_changed_at)[-1]
        return None

    def count_elders(self):
        return len({m.elder_first_name + m.elder_last_name for m in self.missions})

    def completed_mission_count(self):
        return self.volunteer_missions.join(Mission).filter(and_(VolunteerMission.state == VolunteerMissionState.accepted,
                                                   Mission.state == MissionState.completed)).count()

    @validates('first_name', 'last_name')
    def convert_lower(self, key, value):
        return value.lower()

    def __eq__(self, other):
        return self.uuid == other.uuid

    def __hash__(self):
        return hash(self.uuid)


class Mission(Base):
    __tablename__ = 'missions'

    id                         = Column(Integer, primary_key=True, index=True)
    uuid                       = Column(UUID(as_uuid=True), unique=True, nullable=False)
    created_at                 = Column(DateTime, default=get_utc_now)
    updated_at                 = Column(DateTime, onupdate=get_utc_now)
    state_changed_at           = Column(DateTime, nullable=True)
    elder_first_name           = Column(String)
    elder_last_name            = Column(String)
    elder_phone_number         = Column(String, index=True)
    elder_address_lat          = Column(Float, index=True, nullable=False)
    elder_address_lng          = Column(Float, index=True, nullable=False)
    elder_address_str          = Column(Text)
    scheduled_to_date          = Column(Date)
    prefered_hours             = Column(Enum(MissionPreferedHours))
    payment_method             = Column(Enum(MissionPaymentMethod), default=MissionPaymentMethod.no_payment, nullable=False)
    error_state                = Column(Enum(MissionErrorState), nullable=True)
    additional_contact_name    = Column(String, nullable=True)
    additional_contact_phone   = Column(String, nullable=True)
    additional_contact_email   = Column(String, nullable=True)
    additional_contact_role    = Column(Enum(MissionAdditionalContactRole), nullable=True)
    use_additional_contact     = Column(Boolean, nullable=False, default=False)
    state                      = Column(Enum(MissionState), index=True, default=MissionState.pending)
    pickup_point               = Column(Text, nullable=True, default='')
    is_elder_need_visit_before = Column(Enum(MissionIsElderNeedVisitBefore), default=MissionIsElderNeedVisitBefore.no)
    purpose                    = Column(Enum(MissionPurpose), index=True)
    description                = Column(Text)
    volunteers                 = relationship(Volunteer, secondary='volunteer_mission')
    owner_id                   = Column(Integer, ForeignKey('volunteers.id'), nullable=True)

    def __str__(self):
        return f"Mission {self.uuid} for {self.elder_name} in state {self.state}"

    @hybrid_property
    def elder_name(self):
        return f'{self.elder_first_name} {self.elder_last_name}'

    @hybrid_property
    def elder_first_name_capitalized(self):
        return self.elder_first_name.capitalize()

    @hybrid_property
    def elder_last_name_capitalized(self):
        return self.elder_last_name.capitalize()

    @hybrid_property
    def elder_address(self):
        return Coordinates(lat=self.elder_address_lat, lng=self.elder_address_lng)

    @hybrid_property
    def volunteer(self):
        accepted_volunteer_mission = self.volunteer_missions.filter(VolunteerMission.state == VolunteerMissionState.accepted).first()
        if accepted_volunteer_mission is None:
            return None
        return accepted_volunteer_mission.volunteer

    @validates('elder_first_name', 'elder_last_name')
    def convert_lower(self, key, value):
        return value.lower()

    def __eq__(self, other):
        return self.uuid == other.uuid

    def __hash__(self):
        return hash(self.uuid)

    def to_dict(self):
        mission_dict = object_to_dict(self)
        mission_dict['elder_address'] = dict(address_lat=self.elder_address_lat,
                                             address_lng=self.elder_address_lng,
                                             address_str=self.elder_address_str)
        if self.volunteer:
            mission_dict['volunteer'] = object_to_dict(self.volunteer)
            mission_dict['volunteer']['age'] = self.volunteer.age
            mission_dict['volunteer']['address'] = dict(address_lat=self.volunteer.address_lat,
                                                        address_lng=self.volunteer.address_lng,
                                                        address_str=self.volunteer.address_str)

        return mission_dict


class VolunteerMission(Base):
    __tablename__ = 'volunteer_mission'

    volunteer_id = Column(
        BigInteger,
        ForeignKey('volunteers.id'),
        primary_key=True)

    mission_id = Column(
        BigInteger,
        ForeignKey('missions.id'),
        primary_key=True)

    state = Column(Enum(VolunteerMissionState), default=VolunteerMissionState.pending)

    mission   = relationship("Mission", backref=backref("volunteer_missions", cascade="all, delete-orphan", lazy="dynamic"))
    volunteer = relationship("Volunteer", backref=backref("volunteer_missions", cascade="all, delete-orphan", lazy="dynamic"))


class ScheduledTasks(Base):
    __tablename__ = 'scheduled_tasks'

    id                         = Column(Integer, primary_key=True, index=True)
    created_at                 = Column(DateTime, default=get_utc_now, index=True)
    updated_at                 = Column(DateTime, onupdate=get_utc_now)
    scheduled_at               = Column(DateTime, nullable=False, index=True)
    executed_at                = Column(DateTime, nullable=True, default=None, index=True)
    completed_at               = Column(DateTime, nullable=True, default=None, index=True)
    failed_at                  = Column(DateTime, nullable=True, default=None, index=True)
    failure_description        = Column(Text, default='')
    endpoint                   = Column(String)