import requests
from app import crud
from app.tests.db.session import db_session
from app.tests.utils.utils import get_server_api
from app.core import config

server_api = get_server_api()


def request_sms_verification(phone_number: str):
    data = {"phone_number": phone_number}
    return requests.post(
        f"{server_api}{config.API_V1_STR}/sms_verification/request_otp",
        json=data,
    )


def request_sms_validation(phone_number: str, otp: str):
    data = {"phone_number": phone_number, "otp": otp}
    return requests.post(
        f"{server_api}{config.API_V1_STR}/sms_verification/validate_otp",
        json=data,
    )


def get_otp_record_by_phone_number(phone_number: str):
    return crud.get_otp_record_by_phone_number(db_session, phone_number)
