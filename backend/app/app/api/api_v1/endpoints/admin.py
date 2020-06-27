import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, schemas, models
from app.api.utils.db import get_db
from app.api.utils.security import get_current_active_admin_volunteer, get_current_active_volunteer

router = APIRouter()

@router.get("/", status_code=status.HTTP_200_OK, description="Use this function to receive statistics about the system")
def get_statistics(db: Session = Depends(get_db), volunteer: models.Volunteer = Depends(get_current_active_admin_volunteer)):
    return

@router.post("/elevate", status_code=status.HTTP_200_OK,
         description="Use this method to to elevate volunteer to higher permissions",
         responses={status.HTTP_412_PRECONDITION_FAILED : {'model': schemas.VolunteerIsNotAdmin,
                                                           'description': schemas.VolunteerIsNotAdmin.description()},})
def elevate_volunteer(elevation_request: schemas.ElevateVolunteer, db: Session = Depends(get_db), volunteer: models.Volunteer = Depends(get_current_active_admin_volunteer)):
    crud.elevate_volunteer(db, volunteer, elevation_request.role)
