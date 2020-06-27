import typing
import logging
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.orm import Session
from starlette.responses import RedirectResponse

from app import crud, schemas, models
from app.api.utils.db import get_db
from app.api.utils.security import get_current_active_coordinator_volunteer, get_current_active_volunteer, \
    has_role_or_above
from app.crud import check_volunteer_mission
from app.models import VolunteerMissionState

router = APIRouter()
logger = logging.getLogger(__name__)


@router.put("/create", status_code=status.HTTP_201_CREATED,
            description="Use this method to to create a new Mission",
            responses={status.HTTP_412_PRECONDITION_FAILED: {'model': schemas.VolunteerIsNotCallCenter,
                                                             'description': schemas.VolunteerIsNotCallCenter.description()}
                       })
def create_mission(mission: schemas.CreateMission, db: Session = Depends(get_db)):
    # TODO - Approve mission automatically if admin/moderator
    crud.create_mission(db, mission)


@router.put("/update", status_code=status.HTTP_200_OK,
            description="Use this method to to update a Mission",
            responses={status.HTTP_412_PRECONDITION_FAILED: {'model': schemas.VolunteerIsNotCallCenter,
                                                             'description': schemas.VolunteerIsNotCallCenter.description()}
                       })
def update_mission(update_mission_request: schemas.UpdateMission,
                   background_tasks: BackgroundTasks,
                   db: Session = Depends(get_db),
                   coordinator: models.Volunteer = Depends(get_current_active_coordinator_volunteer)):
    mission_before_update = crud.get_mission_by_uuid(db, _uuid=update_mission_request.uuid)
    mission_state_before_update: models.MissionState = mission_before_update.state
    if update_mission_request.owner_id:
        coordinator = crud.get_volunteer_by_id(db, update_mission_request.owner_id)
    crud.update_mission(db, update_mission_request, coordinator)
    handle_mission_state_changed(db, mission_before_update,
                                 update_mission_request.state,
                                 update_mission_request.error_state,
                                 background_tasks,
                                 state_before_changed=mission_state_before_update)


@router.post("/change_state", status_code=status.HTTP_200_OK,
             description="Use this method to change mission state (Only for coordinators)",
             responses={status.HTTP_404_NOT_FOUND: {'models': schemas.MissionNotFound,
                                                    "description": schemas.MissionNotFound.description()},
                        status.HTTP_204_NO_CONTENT: {'description': 'State is the same as it was before'}})
def change_mission_state(state_request: schemas.ChangeMissionStateRequest, background_tasks: BackgroundTasks,
                         db: Session = Depends(get_db),
                         volunteer: models.Volunteer = Depends(get_current_active_volunteer)):
    mission = crud.get_mission_by_uuid(db, _uuid=state_request.mission_id)
    if not mission:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail=schemas.MissionNotFound.description())
    if not has_role_or_above(volunteer, models.VolunteerRole.coordinator) \
            and volunteer.role != models.VolunteerRole.call_center:
        crud.check_volunteer_mission(db, mission, volunteer, models.VolunteerMissionState.accepted)

    handle_mission_state_changed(db, mission, state_request.mission_state, state_request.error_state, background_tasks,
                                 state_before_changed=mission.state)


def handle_mission_state_changed(db: Session,
                                 mission: models.Mission,
                                 requested_state: models.MissionState,
                                 requested_error_state: models.MissionErrorState,
                                 background_tasks: BackgroundTasks,
                                 state_before_changed: models.MissionState = None):
    if requested_state == mission.state and state_before_changed == mission.state:
        raise HTTPException(status.HTTP_204_NO_CONTENT)
    # If mission is approved we want to send notifications for nearby volunteers
    elif requested_state == models.MissionState.approved:
        print(f'Mission {mission.uuid} changed from {state_before_changed} to {mission.state}')
        background_tasks.add_task(crud.set_mission_approved_task, mission.uuid)
        return
    else:
        crud.set_mission_state(db, mission, requested_state, error_state=requested_error_state)
        if requested_state == models.MissionState.completed:
            crud.clear_mission_pickup_point(db, mission)


@router.get("/", status_code=status.HTTP_200_OK,
            description="Use this method to retrieve 50 missions (Only for coordinators)",
            response_model=schemas.GetMissions)
def get_missions(db: Session = Depends(get_db),
                 coordinator: models.Volunteer = Depends(get_current_active_coordinator_volunteer)):
    missions: typing.List[models.Mission] = crud.get_all_missions(db)
    return {'missions': [mission.to_dict() for mission in missions]}


@router.get("/{uuid}", status_code=status.HTTP_302_FOUND,
            description="This is the endpoint that the volunteer is referred from notification, Redirects to volunteer/mission/{uuid}")
def consider_taking_mission(uuid: str, db: Session = Depends(get_db)):
    return RedirectResponse(url=f'/#/mission/{uuid}')


@router.post('/search', status_code=status.HTTP_200_OK, response_model=schemas.GetMissions,
             description="Use this function to search missions by volunteer name or by elder name")
def search_missions(request: schemas.SearchMissionsRequest, db: Session = Depends(get_db),
                    coordinator: models.Volunteer = Depends(get_current_active_coordinator_volunteer)):
    missions = crud.get_missions_contains_elder_name(db, request.value)
    return {'missions': [mission.to_dict() for mission in missions]}


@router.post('/schedule', status_code=status.HTTP_200_OK, response_model=schemas.Mission,
             description="Use this function to schedule a mission to a given date",
             responses={status.HTTP_412_PRECONDITION_FAILED: {'model': schemas.MissionNotApproved,
                                                              'description': schemas.MissionNotApproved.description()}
                        }
             )
def schedule_mission(request: schemas.ScheduleMissionRequest,
                     background_tasks: BackgroundTasks,
                     db: Session = Depends(get_db),
                     volunteer: models.Volunteer = Depends(get_current_active_volunteer)):
    mission = crud.get_mission_by_uuid(db, _uuid=request.mission_id)
    if not mission:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail=schemas.MissionNotFound.description())
    if not has_role_or_above(volunteer, models.VolunteerRole.coordinator):
        check_volunteer_mission(db, mission, volunteer, VolunteerMissionState.accepted)

    crud.set_mission_schedule(db, mission, request.schedule_date, request.preferred_hours)
    background_tasks.add_task(crud.set_mission_approved_task, mission.uuid)
    return mission.to_dict()
