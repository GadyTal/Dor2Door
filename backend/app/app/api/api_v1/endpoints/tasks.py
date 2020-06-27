import logging
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import UUID4
from sqlalchemy.orm import Session

from app import search
from app import crud, models
from app.api.utils.db import get_db
from app.core import config

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get('/verify_mission/{mission_uuid}', status_code=status.HTTP_200_OK,
            description="Use this endpoint in order to schedule volunteers lookup")
def verify_mission(mission_uuid: UUID4, internal_token: str, db: Session = Depends(get_db)):
    if internal_token != config.INTERNAL_API_TOKEN:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Not allowed to call this API")
    try:
        mission: models.Mission = crud.get_mission_by_uuid(db, mission_uuid)
        # If mission doesn't exists any more raise exception
        if not mission:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail=f"Mission {mission_uuid} no longer exists.")
        # If mission state is not approved (approved meaning it's waiting for volunteers) we want to return
        if mission.state != models.MissionState.approved:
            return f"Mission state ({mission.state.name}) doesn't need more volunteers lookup"
        # Ask for the second group since if we came here the first group doesn't respond
        return search.search_and_notify_nearby_volunteers(db, mission)

    except Exception as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail=f"Exception raised while handling this task: {str(e)}")
