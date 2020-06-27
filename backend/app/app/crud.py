# Using for uuid4 (Random generated uuid)
import datetime
import logging
import typing
import uuid

from fastapi import HTTPException
from pydantic import UUID4
from sqlalchemy import and_, func
from sqlalchemy.orm import Session
from starlette import status
from starlette.background import BackgroundTasks

from app.db.session import get_db_session
from app.models import MissionPreferedHours, MissionState, VolunteerMissionState, MissionErrorState, VolunteerRole
from app.exceptions import MissionAlreadyAccepted
from app.search import search_and_notify_nearby_volunteers, search_task_caller, schedule_search
from . import models, schemas
from .core import config, jwt

PHONE_VERIFICATION_TIMEOUT_SECONDS = 240
PHONE_VALIDATION_TIMEOUT_SECONDS = 120
PHONE_VALIDATION_ATTEMPTS_COUNT = 5

logger = logging.getLogger(__name__)


def get_all_missions(db: Session):
    return db.query(models.Mission).all()


def get_pending_missions(db: Session):
    return db.query(models.Mission).filter(models.Mission.state.in_((MissionState.pending, MissionState.error)))


def elevate_volunteer(db: Session, volunteer: models.Volunteer, volunteer_role: models.VolunteerRole):
    volunteer.role = volunteer_role
    db.commit()


def get_access_token_for_volunteer(volunteer: models.Volunteer):
    return f'bearer {jwt.create_access_token(volunteer.uuid.hex).decode("utf-8")}'


def create_mission(db: Session, mission: schemas.CreateMission):
    db_mission = models.Mission(**(mission.dict(exclude={'elder_address'})), uuid=uuid.uuid4(),
                                elder_address_str=mission.elder_address.address_str,
                                elder_address_lat=mission.elder_address.address_lat,
                                elder_address_lng=mission.elder_address.address_lng)
    db.add(db_mission)
    db.commit()
    return db_mission.uuid


def update_mission(db: Session, update_mission_request: schemas.UpdateMission, coordinator: models.Volunteer):
    mission = get_mission_by_uuid(db, _uuid=update_mission_request.uuid)
    db.query(models.Mission).filter(models.Mission.uuid == update_mission_request.uuid).update(
        update_mission_request.to_dict()
    )
    mission.owner_id = coordinator.id
    db.commit()
    return


def create_volunteer(db: Session, volunteer: schemas.CreateVolunteer):
    db_volunteer = models.Volunteer(**(volunteer.dict(exclude={'address', 'first_name', 'last_name'})),
                                    **volunteer.address.__dict__,
                                    first_name=volunteer.first_name, last_name=volunteer.last_name, uuid=uuid.uuid4())
    db.add(db_volunteer)
    db.commit()
    db.refresh(db_volunteer)
    return get_access_token_for_volunteer(db_volunteer)


def get_volunteer_by_id(db: Session, id_: UUID4):
    return db.query(models.Volunteer).filter(models.Volunteer.id == id_).first()


def get_volunteer_by_uuid(db: Session, uuid_: UUID4):
    return db.query(models.Volunteer).filter(models.Volunteer.uuid == uuid_).first()


def get_volunteer_by_phone_number(db: Session, phone_number: str):
    return db.query(models.Volunteer).filter(models.Volunteer.phone_number == phone_number).first()


def get_coordinators_managers_volunteers(db: Session):
    return db.query(models.Volunteer).filter(models.Volunteer.role == VolunteerRole.coordinator_manager)



def update_last_phone_verification_date(db: Session, volunteer: models.Volunteer, now):
    volunteer.last_phone_verification = now
    db.commit()


def get_otp_record_by_phone_number(db: Session, phone_number: str):
    return db.query(models.OtpVerification).filter(models.OtpVerification.phone_number == phone_number).first()


def delete_db_record_by_phone_number(db: Session, phone_number: str):
    otp_record = db.query(models.OtpVerification).filter(models.OtpVerification.phone_number == phone_number)
    if otp_record:
        otp_record.delete()
    volunteer_record = db.query(models.Volunteer).filter(models.Volunteer.phone_number == phone_number)
    if volunteer_record:
        volunteer_record.delete()
    db.commit()


def delete_mission_by_elder_first_name(db: Session, first_name: str):
    mission_record = db.query(models.Mission).filter(models.Mission.elder_first_name == first_name)
    if mission_record:
        mission_record.delete()
        db.commit()


def check_if_enough_time_passed(db_otp_record: models.OtpVerification):
    return True
    # TODO Change here
    if db_otp_record:
        # Check if this phone number allowed another verification in the current time frame
        if (
                models.get_utc_now() - db_otp_record.updated_at).total_seconds() < config.PHONE_VERIFICATION_TIMEOUT_SECONDS:
            return False
    return True


def decrement_otp_verification_attempts(db: Session, db_otp_record: models.OtpVerification):
    db_otp_record.attempts_left -= 1
    db.commit()
    db.refresh(db_otp_record)


def authenticate_otp(db: Session, db_otp_record: models.OtpVerification):
    db_otp_record.authenticated = True
    db_otp_record.otp_code = ""
    db.commit()


def request_otp_verification_for_phone_number(db: Session, phone_number: str, otp: str,
                                              existing_db_otp: models.OtpVerification = None):
    if not existing_db_otp:
        existing_db_otp = models.OtpVerification(phone_number=phone_number, otp_code=otp)
        db.add(existing_db_otp)
    # Reset attempt count
    existing_db_otp.attempts_left = config.PHONE_VALIDATION_MAX_ATTEMPTS
    # Update OTP code
    existing_db_otp.otp_code = otp
    # Apply change to db
    db.commit()
    return schemas.OtpSentToVolunteerResponse(
        expired_at=existing_db_otp.updated_at + datetime.timedelta(seconds=config.PHONE_VERIFICATION_TIMEOUT_SECONDS),
        attempts_left=existing_db_otp.attempts_left)


def need_to_send_welcome_message(last_sent: datetime.datetime):
    return models.get_utc_now() > last_sent + datetime.timedelta(days=config.WELCOME_WHATSAPP_DAYS_BEFORE_SEND_AGAIN)


def set_volunteer_whatsapp_subscription(db: Session, volunteer: models.Volunteer, update_whatsapp_timestamp: bool,
                                        enabled: bool):
    if update_whatsapp_timestamp:
        volunteer.last_whatsapp_welcome_at = models.get_utc_now()
    volunteer.is_subscribed = enabled
    db.commit()


def get_mission_by_uuid(db: Session, _uuid) -> models.Mission:
    return db.query(models.Mission).filter(models.Mission.uuid == _uuid).first()


def set_mission_approved_task(mission_uuid: str):
    with get_db_session() as db_session:
        mission = db_session.query(models.Mission).filter(models.Mission.uuid == mission_uuid).first()
        set_mission_state(db_session, mission, models.MissionState.approved)
        schedule_search(db_session, mission)
        db_session.commit()


def accept_mission_for_volunteer(db: Session, volunteer: models.Volunteer, mission: models.Mission):
    if not check_mission_not_accepted(db, mission):
        raise MissionAlreadyAccepted(f"Mission {mission.id} was already accepted by another volunteer")
    try:
        with db.begin_nested():
            db.execute(f'LOCK TABLE {models.Mission.__tablename__} IN EXCLUSIVE MODE;')
            db.execute(f'LOCK TABLE {models.VolunteerMission.__tablename__} IN EXCLUSIVE MODE;')
            set_volunteer_mission_state(db, volunteer, mission, models.VolunteerMissionState.accepted)
            set_mission_state(db, mission, models.MissionState.acquired, commit=False)
        logger.info(f"Set mission {mission.uuid} to acquired and missionVolunteer {volunteer.uuid} to accepted")
        # TODO: Add here task to check what's going on with the missions
    except Exception as e:
        logger.error(f"Failed to accept mission. mission:{mission.uuid}, volunteer:{volunteer.uuid}")
        db.rollback()
        raise e
    finally:
        # Double commit one for the db.begin_nested() and one for the global db transaction
        db.commit()
        db.commit()


def set_mission_error(db: Session, mission: models.Mission, error_state: models.MissionErrorState):
    mission.error_state = error_state
    set_mission_state(db, mission, models.MissionState.error)


def set_mission_state(db: Session, mission: models.Mission, state: models.MissionState, commit=True,
                      error_state: models.MissionErrorState = None):
    mission.state = state
    if error_state:
        mission.error_state = error_state
    mission.state_changed_at = models.get_utc_now()
    if commit:
        db.commit()


def handle_decline_mission(db: Session, mission_uuid: str, volunteer_id: int, error_state: models.MissionErrorState,
                           background_tasks: BackgroundTasks):
    # fetch models instances
    mission = db.query(models.Mission).filter(models.Mission.uuid == mission_uuid).first()
    volunteer_mission = db.query(models.VolunteerMission).filter(
        and_(models.VolunteerMission.mission_id == mission.id,
             models.VolunteerMission.volunteer_id == volunteer_id)).first()

    volunteer_mission.state = VolunteerMissionState.declined

    if error_state == MissionErrorState.no_one_answered_call:
        if mission.error_state == MissionErrorState.no_one_answered_call:
            # mission had already no answer, just set the state as error
            mission.state = MissionState.error
            db.commit()
        else:
            # schedule retry in 60 minutes, have in mind the the other volunteers will still have the chance to call the elder.
            mission.error_state = MissionErrorState.no_one_answered_call
            set_mission_state(db, mission, MissionState.approved)
    elif error_state == MissionErrorState.not_relevant_anymore:
        # mission will be handled by call center
        set_mission_error(db, mission, MissionErrorState.not_relevant_anymore)
    elif error_state == MissionErrorState.refuse_mission:
        # mission was refused by volunteer, rerun search now
        set_mission_state(db, mission, MissionState.approved)
        background_tasks.add_task(search_task_caller, mission.uuid)


def set_volunteer_mission_state(db: Session, volunteer: models.Volunteer,
                                mission: models.Mission, state: VolunteerMissionState):
    volunteer_mission = db.query(models.VolunteerMission).filter(
        and_(models.VolunteerMission.volunteer_id == volunteer.id,
             models.VolunteerMission.mission_id == mission.id)
    ).first()
    volunteer_mission.state = state


def set_mission_schedule(db: Session, mission: models.Mission,
                         schedule_date: datetime.date,
                         preferred_hours: MissionPreferedHours):
    mission.scheduled_to_date = schedule_date
    mission.prefered_hours = preferred_hours
    db.commit()


def get_volunteers_count(db: Session):
    return db.query(models.Volunteer).count()


def get_missions_count(db: Session):
    return db.query(models.Mission).count()


def get_missions_contains_elder_name(db: Session, value: str, limit: int = 10) -> typing.List[models.Mission]:
    return db.query(models.Mission).filter(func.concat(models.Mission.elder_first_name,
                                                       ' ',
                                                       models.Mission.elder_last_name) \
                                           .ilike(f"%{value}%")).limit(limit).all()


def get_volunteer_mission(db: Session, volunteer: models.Volunteer, mission: models.Mission):
    return db.query(models.VolunteerMission).filter(
        and_(models.VolunteerMission.mission_id == mission.id,
             models.VolunteerMission.volunteer_id == volunteer.id)).first()


def check_volunteer_mission(db: Session, mission: models.Mission, volunteer: models.Volunteer,
                            in_state: models.VolunteerMissionState = None):
    if not mission:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="No such mission")
    if mission not in volunteer.missions:
        raise HTTPException(status.HTTP_403_FORBIDDEN, detail="Mission does not belong to volunteer")

    if in_state:
        volunteer_mission = get_volunteer_mission(db, volunteer, mission)
        if volunteer_mission.state != in_state:
            raise HTTPException(status.HTTP_403_FORBIDDEN, detail=f"Volunteer mission is not {in_state}")


def check_mission_not_accepted(db: Session, mission: models.Mission):
    is_mission_accepted = db.query(models.VolunteerMission).filter(and_(models.VolunteerMission.mission_id == mission.id,
                                                                 models.VolunteerMission.state == VolunteerMissionState.accepted)).count()
    return not is_mission_accepted

def get_all_volunteer_mission_statuses(db: Session, mission: models.Mission):
    missions = db.query(models.VolunteerMission).filter(models.VolunteerMission.mission_id == mission.id)
    return {m.state for m in missions}


def clear_mission_pickup_point(db: Session, mission: models.Mission):
    mission.pickup_point = ''
    db.commit()


def del_scheduled_tasks_entries(db: Session, designated_endpoint: models.ScheduledTasks.endpoint):
    tasks = db.query(models.ScheduledTasks).filter(models.ScheduledTasks.endpoint == designated_endpoint)
    if tasks:
        tasks.delete()
    db.commit()
    return
