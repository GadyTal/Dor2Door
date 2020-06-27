from typing import List

import pydantic
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, schemas, models
from app.exceptions import MissionAlreadyAccepted
from app.api.utils.db import get_db
from app.api.utils.security import get_current_active_volunteer, get_current_active_coordinator_volunteer
from app.core import utils
from app.crud import check_volunteer_mission

router = APIRouter()


@router.put("/create", response_model=schemas.VolunteerCreatedResponse, status_code=status.HTTP_201_CREATED,
            description="Use this method to to create a new volunteer (OTP verification is prerequisite to this step)",
            responses={status.HTTP_400_BAD_REQUEST: {"model": schemas.PhoneNumberAlreadyRegistered,
                                                     "description": schemas.PhoneNumberAlreadyRegistered.description()},
                       status.HTTP_401_UNAUTHORIZED: {"model": schemas.PhoneNumberNeedSMSAuthenticate,
                                                      "description": schemas.PhoneNumberNeedSMSAuthenticate.description()}})
def create_volunteer(volunteer: schemas.CreateVolunteer, db: Session = Depends(get_db)):
    # Check if user exists
    db_volunteer = crud.get_volunteer_by_phone_number(db, phone_number=volunteer.phone_number)
    if db_volunteer:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=schemas.PhoneNumberAlreadyRegistered.description())
    db_otp_record = crud.get_otp_record_by_phone_number(db, volunteer.phone_number)
    # If user never authenticated via OTP block this registration request
    if not db_otp_record or not db_otp_record.authenticated:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail=schemas.PhoneNumberNeedSMSAuthenticate.description())
    jwt_token = crud.create_volunteer(db=db, volunteer=volunteer)
    # Set auth cookie
    # response.set_cookie(**get_cookie_params(jwt_token))
    return schemas.VolunteerCreatedResponse(token=jwt_token)


@router.post("/subscription", status_code=status.HTTP_200_OK,
             description="Use this method to subscribe or unsubscribe from Whatsapp notifications")
def set_subscription(set_subscription_request: schemas.SetSubscriptionRequest, background_tasks: BackgroundTasks,
                     db: Session = Depends(get_db),
                     volunteer: models.Volunteer = Depends(get_current_active_volunteer)):
    is_message_sent = False
    # If WhatsApp subscription changed from Off to On we probably should send whatsapp notification
    if not volunteer.is_subscribed and set_subscription_request.enabled:
        # if we never sent welcome message send now
        if not volunteer.last_whatsapp_welcome_at:
            background_tasks.add_task(utils.notifications_handler.send_whatsapp_welcome_message, volunteer.phone_number,
                                      volunteer.full_name)
        # Verify that enough time passed since last welcome message and send resubscribed notification
        elif crud.need_to_send_welcome_message(volunteer.last_whatsapp_welcome_at):
            background_tasks.add_task(utils.notifications_handler.send_volunteer_resubscribed, volunteer.phone_number,
                                      volunteer.full_name)
        is_message_sent = True
    crud.set_volunteer_whatsapp_subscription(db, volunteer, update_whatsapp_timestamp=is_message_sent,
                                             enabled=set_subscription_request.enabled)


@router.get("/homepage", response_model=schemas.GetHomePageResponse, status_code=status.HTTP_200_OK,
            description="Use this method to receive all the information required for home page")
def get_volunteer_home_page(db: Session = Depends(get_db),
                            volunteer: models.Volunteer = Depends(get_current_active_volunteer)):
    last_mission_completed_date = volunteer.last_completed_mission.state_changed_at.date() if volunteer.last_completed_mission else 0
    last_mission_elder_first_name = volunteer.missions[-1].elder_first_name if len(volunteer.missions) > 0 else ""
    last_mission_elder_address = volunteer.missions[-1].elder_address_str if len(volunteer.missions) > 0 else ""

    return schemas.GetHomePageResponse(
        volunteer=dict(volunteer.__dict__, age=volunteer.age, address=volunteer.__dict__),
        is_subscribed=volunteer.is_subscribed,
        volunteers_count=8266,
        elders_count=2729,
        # volunteers_count=crud.get_volunteers_count(db),
        # elders_count=volunteer.count_elders(),
        last_mission_elder_first_name=last_mission_elder_first_name,
        last_mission_elder_address=last_mission_elder_address,
        last_mission_completed_date=last_mission_completed_date,
        missions_amount=volunteer.completed_mission_count())


@router.post("/update_information", status_code=status.HTTP_200_OK,
             description="Update volunteer details (email and address)")
def set_volunteer_details(request: schemas.UpdateVolunteerInfoRequest, db: Session = Depends(get_db),
                          volunteer: models.Volunteer = Depends(get_current_active_volunteer)):
    if volunteer.email != request.new_email:
        if db.query(models.Volunteer).filter(models.Volunteer.email == request.new_email).first():
            raise HTTPException(status.HTTP_409_CONFLICT, detail="Volunteer already exists with the provided email")
        volunteer.email = request.new_email
    volunteer.address_lat = request.new_address.address_lat
    volunteer.address_lng = request.new_address.address_lng
    volunteer.address_str = request.new_address.address_str
    db.commit()


@router.delete("/delete", status_code=status.HTTP_200_OK,
               description="Use this method to delete the volunteer that you're authenticated from")
def delete_volunteer(db: Session = Depends(get_db),
                     volunteer: models.Volunteer = Depends(get_current_active_volunteer)):
    db.delete(volunteer)
    db.commit()


@router.get("/mission/{uuid}", status_code=status.HTTP_200_OK,
            description="Use this method to receive waiting mission for volunteer")
def get_volunteer_mission(uuid: pydantic.UUID4, db: Session = Depends(get_db),
                          volunteer: models.Volunteer = Depends(get_current_active_volunteer)):
    mission = crud.get_mission_by_uuid(db, uuid)
    if not mission:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="No such mission")

    volunteer_mission_statuses = crud.get_all_volunteer_mission_statuses(db, mission)
    if any(s == models.VolunteerMissionState.accepted for s in volunteer_mission_statuses):
        check_volunteer_mission(db, mission, volunteer, in_state=models.VolunteerMissionState.accepted)
    else:
        check_volunteer_mission(db, mission, volunteer)

    if mission.state.name == models.MissionState.approved.name:
        return schemas.SlimMissionResponse(**mission.__dict__, distance=utils.distance_to_string(
            volunteer.calculate_distance_from(mission.elder_address)))
    elif mission.state.name in {models.MissionState.acquired.name,
                                models.MissionState.started.name}:
        return schemas.VolunteerMission(**mission.to_dict())
    else:
        raise HTTPException(status.HTTP_403_FORBIDDEN, detail="Mission is not longer required volunteer")


@router.post("/mission/{uuid}/decline", status_code=status.HTTP_200_OK,
             description="Use this method to either cancel mission or decline it",
             response_model=schemas.SlimMissionResponse)
def decline_mission(uuid: pydantic.UUID4,
                    decline_request: schemas.DeclineMissionRequest,
                    background_tasks: BackgroundTasks,
                    db: Session = Depends(get_db),
                    volunteer: models.Volunteer = Depends(get_current_active_volunteer)):
    mission: models.Mission = crud.get_mission_by_uuid(db, uuid)
    if not mission:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="No such mission")

    crud.handle_decline_mission(db, mission.uuid, volunteer.id, decline_request.reason, background_tasks)

    return schemas.SlimMissionResponse(**mission.to_dict(),
                                       distance=utils.distance_to_string(
                                           volunteer.calculate_distance_from(mission.elder_address)))


@router.post("/mission/{uuid}/accept", status_code=status.HTTP_200_OK, response_model=schemas.MissionStartedResponse,
             description="Use this method to accept mission")
def accept_mission(uuid: pydantic.UUID4,
                   db: Session = Depends(get_db),
                   volunteer: models.Volunteer = Depends(get_current_active_volunteer)):
    mission = crud.get_mission_by_uuid(db, uuid)
    if not mission:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="No such mission")
    try:
        crud.accept_mission_for_volunteer(db, volunteer, mission)
    except MissionAlreadyAccepted:
        raise HTTPException(status.HTTP_405_METHOD_NOT_ALLOWED, detail="Mission was already accepted by another volunteer")
    except Exception as e:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR)

    db.refresh(volunteer)
    db.refresh(mission)
    return schemas.MissionStartedResponse(**mission.__dict__,
                                          elder_address=dict(address_str=mission.elder_address_str,
                                                             address_lat=mission.elder_address_lat,
                                                             address_lng=mission.elder_address_lng))


@router.post("/mission/{uuid}/complete", status_code=status.HTTP_200_OK, response_model=schemas.MissionStartedResponse,
             description="Use this method to report mission completion")
def complete_mission(uuid: pydantic.UUID4,
                     db: Session = Depends(get_db),
                     volunteer: models.Volunteer = Depends(get_current_active_volunteer)):
    mission = crud.get_mission_by_uuid(db, uuid)
    check_volunteer_mission(db, mission, volunteer)
    crud.set_mission_state(db, mission, models.MissionState.completed)


@router.get("/coordinators", status_code=status.HTTP_200_OK,
            description="Use this method to retrieve all coordinators: VolunteerRole.coordinator & VolunteerRole.coordinator_manager.",
            response_model=schemas.GetCoordinators)
def get_coordinators(db: Session = Depends(get_db),
                     coordinator: models.Volunteer = Depends(get_current_active_coordinator_volunteer)):
    coordinators: List[models.Volunteer] = crud.get_coordinators_managers_volunteers(db)
    return {'coordinators': [{'id': coordinator.id, 'name': coordinator.full_name, 'is_active': coordinator.is_active}
                             for coordinator in coordinators]}
