import http.cookies

import jwt
from fastapi import Depends, HTTPException, Request, Security, status
from fastapi.security import OAuth2, OAuth2PasswordBearer
from fastapi.openapi.models import OAuthFlows as OAuthFlowsModel
from fastapi.security.utils import get_authorization_scheme_param
from sqlalchemy.orm import Session

from app import crud, models
from app.api.utils.db import get_db
from app.core import config

def get_cookie_params(jwt_token: str):
    cookie_params = config.COOKIE_PARAMS_TEMPLATE
    cookie_params["value"] = f'bearer {jwt_token}'
    return cookie_params


class OAuth2PasswordBearerWithCookie(OAuth2):
    def __init__(
        self,
        tokenUrl: str,
        scheme_name: str = None,
        scopes: dict = None,
        auto_error: bool = True,
    ):
        if not scopes:
            scopes = {}
        flows = OAuthFlowsModel(password={"tokenUrl": tokenUrl, "scopes": scopes})
        super().__init__(flows=flows, scheme_name=scheme_name, auto_error=auto_error)

    async def __call__(self, request: Request):
        authorization: str = request.cookies.get(config.COOKIE_KEY_NAME)
        print(request.cookies)
        scheme, param = get_authorization_scheme_param(authorization)
        if not authorization or scheme.lower() != "bearer":
            if self.auto_error:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated", headers={"WWW-Authenticate": "Bearer"})
            else:
                return None

        return param

#oauth2_scheme = OAuth2PasswordBearerWithCookie(tokenUrl="/token")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")


def get_current_volunteer(db: Session = Depends(get_db), token: str = Security(oauth2_scheme)):
    try:
        payload = jwt.decode(token, config.JWT_SECRET_KEY, algorithms=[config.JWT_ALGORITHM])
        uuid = payload["sub"]
    except (jwt.PyJWTError, KeyError):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Could not validate credentials")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_408_REQUEST_TIMEOUT, detail="Token expired please generate new one")
    
    volunteer = crud.get_volunteer_by_uuid(db, uuid_=uuid)
    if not volunteer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Volunteer doesn't exist anymore")
    return volunteer


def check_role_or_above(volunteer: models.Volunteer, role: models.VolunteerRole):
    if not has_role_or_above(volunteer, role):
        raise HTTPException(status_code=status.HTTP_412_PRECONDITION_FAILED,
                            detail="insufficient permissions for volunteer")


def has_role_or_above(volunteer: models.Volunteer, role: models.VolunteerRole):
    return volunteer.role in {role, models.VolunteerRole.admin}


def get_current_active_volunteer(volunteer: models.Volunteer = Security(get_current_volunteer)):
    if not volunteer.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")
    return volunteer


def get_current_active_callcenter_volunteer(volunteer: models.Volunteer = Security(get_current_active_volunteer)):
    check_role_or_above(volunteer, models.VolunteerRole.call_center)
    return volunteer


def get_current_active_coordinator_volunteer(volunteer: models.Volunteer = Security(get_current_active_volunteer)):
    if not (has_role_or_above(volunteer, models.VolunteerRole.coordinator)
            or has_role_or_above(volunteer, models.VolunteerRole.coordinator_manager)):
        raise HTTPException(status_code=status.HTTP_412_PRECONDITION_FAILED,
                            detail="insufficient permissions for volunteer")

    return volunteer


def get_current_active_admin_volunteer(volunteer: models.Volunteer = Security(get_current_active_volunteer)):
    check_role_or_above(volunteer, models.VolunteerRole.admin)
    return volunteer
