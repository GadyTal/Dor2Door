import datetime, requests

from fastapi import status

from app.core import config
from app.tests.utils import sms_verification, volunteer, mission

from backend.app.app.models import Volunteer

new_volunteer = {"phone_number": config.TEST_PHONE_NUMBER,
                 "first_name": "David",
                 "last_name": "Levi",
                 "email": "dev@door2dor.co.il",
                 "address_str": "Tel Aviv",
                 "address_lat": 32.0716378,
                 "address_lng": 34.778859,
                 "birthday": datetime.date(year=1996, month=3, day=29).strftime("%Y-%m-%d")}

# address_lat + 0.0
# 
# 

new_mission = {
    "elder_first_name": "First",
    "elder_last_name": "Last",
    "elder_phone_number": "972525286478",
    "elder_address_str": "Tel Aviv",
    "elder_address_lat": -80.9060,
    "elder_address_lng": 41.2237,
    "scheduled_to_date": "2020-04-02",
    "prefered_hours": "morning",
    "payment_method": "cash",
    "use_additional_contact": False,
    "is_elder_need_visit_before": "yes",
    "purpose": "grocery",
    "description": "string"
}
'''
Note: The order here is important, since each test have dependency.
      We should refactor those tests one day to be independent from each other.
'''

requests_session = requests.Session()


def test_volunteer_create_before_otp():
    # This test should fail since the volunteer not authenticate
    response = volunteer.create_volunteer(new_volunteer, requests_session)
    # import pdb;pdb.set_trace()
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_request_sms_verification_phone_number_not_in_format():
    # Send another request with invalid info and validate error
    assert sms_verification.request_sms_verification(
        config.TEST_PHONE_NUMBER + 's').status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_request_sms_verification():
    response = sms_verification.request_sms_verification(config.TEST_PHONE_NUMBER)
    assert response.status_code == status.HTTP_202_ACCEPTED
    content = response.json()
    print(content["expired_at"])
    assert datetime.datetime.strptime(content["expired_at"], "%Y-%m-%dT%H:%M:%S.%f") > datetime.datetime.utcnow()
    assert content["attempts_left"] == config.PHONE_VALIDATION_MAX_ATTEMPTS


def test_request_sms_verification_second_request_no_wait():
    # Send another request and validate that not enough time passed
    assert sms_verification.request_sms_verification(
        config.TEST_PHONE_NUMBER).status_code == status.HTTP_400_BAD_REQUEST


def test_request_sms_validation_otp_not_in_format():
    # Send otp not in format, server should reply with validation error
    assert sms_verification.request_sms_validation(config.TEST_PHONE_NUMBER, '0' * (
                config.OTP_LENGTH - 1)).status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_request_sms_validation_phone_number_never_requested_verification():
    # Send otp for phone number that never asked for otp
    assert sms_verification.request_sms_validation("972525286472",
                                                   '0' * config.OTP_LENGTH).status_code == status.HTTP_400_BAD_REQUEST


def test_request_sms_validation():
    # Send incorrect otp
    incorrect_otp = sms_verification.request_sms_validation(config.TEST_PHONE_NUMBER, '0' * config.OTP_LENGTH)
    assert incorrect_otp.status_code == status.HTTP_403_FORBIDDEN
    assert incorrect_otp.json()["detail"]["attempts_left"] == config.PHONE_VALIDATION_MAX_ATTEMPTS - 1
    otp_code = sms_verification.get_otp_record_by_phone_number(config.TEST_PHONE_NUMBER).otp_code
    validate_otp = sms_verification.request_sms_validation(config.TEST_PHONE_NUMBER, otp_code)
    print(otp_code)
    assert validate_otp.status_code == status.HTTP_202_ACCEPTED
    assert sms_verification.get_otp_record_by_phone_number(config.TEST_PHONE_NUMBER).authenticated
    # TODO Validate too many attempts


def test_volunteer_create():
    response = volunteer.create_volunteer(new_volunteer, requests_session)
    assert response.status_code == status.HTTP_201_CREATED
    assert response.cookies.get(config.COOKIE_KEY_NAME, False)
    assert response.json().get("role", "user")


def test_volunteer_create_duplicate():
    # Try creating another one with same credentials
    assert volunteer.create_volunteer(new_volunteer, requests_session).status_code == status.HTTP_400_BAD_REQUEST


def test_volunteer_whatsapp_subscribe():
    # No welcome message should be sent before user subscribed to notifications so this field should be None
    assert not volunteer.get_volunteer_by_phone_number(config.TEST_PHONE_NUMBER).last_whatsapp_welcome_at
    # Turn on whatsapp notifications for the new created volunteer
    assert volunteer.set_volunteer_subscription(enabled=True,
                                                session=requests_session).status_code == status.HTTP_200_OK
    assert volunteer.get_volunteer_by_phone_number(config.TEST_PHONE_NUMBER).is_subscribed == True
    first_welcome_message_datetime = volunteer.get_volunteer_by_phone_number(
        config.TEST_PHONE_NUMBER).last_whatsapp_welcome_at
    assert first_welcome_message_datetime
    # Turn off whatsapp notifications
    assert volunteer.set_volunteer_subscription(enabled=False,
                                                session=requests_session).status_code == status.HTTP_200_OK
    assert volunteer.get_volunteer_by_phone_number(config.TEST_PHONE_NUMBER).is_subscribed == False
    # No whatsapp notification should be sent since we turned off notifications
    assert first_welcome_message_datetime == volunteer.get_volunteer_by_phone_number(
        config.TEST_PHONE_NUMBER).last_whatsapp_welcome_at


def test_davack():
    cookie = volunteer.get_call_center_cookie(config.TEST_PHONE_NUMBER)
    # import pdb;pdb.set_trace()
    print(cookie)
    assert mission.create_mission(new_mission, cookie).status_code == status.HTTP_201_CREATED


def test_first_name_and_last_name_expect_david_levi():
    # This test should fail since the volunteer not authenticate
    volunteer.create_volunteer(new_volunteer, requests_session)
    volunteer: Volunteer = volunteer.get_volunteer_by_phone_number(config.TEST_PHONE_NUMBER)

    # import pdb;pdb.set_trace()
    assert volunteer.first_name == "David"
    assert volunteer.last_name == "Levi"
    assert volunteer.full_name == "David Levi"
