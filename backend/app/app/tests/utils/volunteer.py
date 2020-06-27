import requests
from app import crud
from app.tests.db.session import db_session
from app.tests.utils.utils import get_server_api
from app.core import config
from app import models
from app.api.utils.security import get_cookie_params

server_api = get_server_api()


def create_volunteer(volunteer: dict, session: requests.Session):
    return session.put(f"{server_api}{config.API_V1_STR}/volunteer/create", json=volunteer)


def remove_everything_for_phone_number(phone_number: str):
    crud.delete_db_record_by_phone_number(db=db_session, phone_number=phone_number)


def set_volunteer_subscription(enabled: bool, session: requests.Session):
    return session.options(f"{server_api}{config.API_V1_STR}/volunteer/subscription", json={'enabled': enabled})


def get_volunteer_by_phone_number(phone_number: str):
    return crud.get_volunteer_by_phone_number(db_session, phone_number)


def get_call_center_cookie(phone_number: str):
    volunteer = get_volunteer_by_phone_number(phone_number)
    crud.elevate_volunteer(db_session, volunteer, models.VolunteerRole.call_center)
    token = crud.get_access_token_for_volunteer(volunteer)
    return get_cookie_params(token)
