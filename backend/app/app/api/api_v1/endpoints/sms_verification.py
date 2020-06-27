import datetime

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app import crud, schemas
from app.api.utils.db import get_db
from app.api.utils.security import get_cookie_params
from app.core import config, utils

router = APIRouter()


@router.post('/request_otp', response_model=schemas.OtpSentToVolunteerResponse, status_code=status.HTTP_202_ACCEPTED,
          description='Use this method to send OTP code to specific phone number',
          responses={status.HTTP_403_FORBIDDEN: {'model': schemas.PhoneVerificationNotEnoughTimePassedError,
                                                   'description': schemas.PhoneVerificationNotEnoughTimePassedError.description()}})
def request_phone_verification(verification_request: schemas.RequestPhoneVerification, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    db_otp_record = crud.get_otp_record_by_phone_number(db, phone_number=verification_request.phone_number)
    if not crud.check_if_enough_time_passed(db_otp_record):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=schemas.PhoneVerificationNotEnoughTimePassedError.description())

    otp_code = utils.generate_otp(config.OTP_LENGTH)
    response: schemas.OtpSentToVolunteerResponse = crud.request_otp_verification_for_phone_number(db, verification_request.phone_number, otp_code, existing_db_otp=db_otp_record)
    background_tasks.add_task(utils.notifications_handler.send_verification_code, verification_request.phone_number, otp_code)
    return response


@router.post('/validate_otp', response_model=schemas.VolunteerLoggedInResponse, status_code=status.HTTP_200_OK,
          description='Use this method to assert otp with server otp (in order to login or make registration possible)',
          responses={status.HTTP_400_BAD_REQUEST: {'model': schemas.OtpNeverSentForThisPhoneNumber,
                                                   'description': schemas.OtpNeverSentForThisPhoneNumber.description()},
                     status.HTTP_408_REQUEST_TIMEOUT: {'model': schemas.OtpExpired,
                                                       'description': schemas.OtpExpired.description()},
                     status.HTTP_403_FORBIDDEN: {'model': schemas.OtpMismatchResponse,
                                                 'description': 'Otp sent didn\'t match the Otp in server, try again'}})
def validate_phone_verification(response: Response, verification_request: schemas.ValidatePhoneVerification, db: Session = Depends(get_db)):
    # Check if user exists
    db_otp_record = crud.get_otp_record_by_phone_number(db, phone_number=verification_request.phone_number)
    if not db_otp_record:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=schemas.OtpNeverSentForThisPhoneNumber.description())
    # Check if this phone number allowed another verification validation in the current time frame
    if db_otp_record.attempts_left == 0 or db_otp_record.otp_code == '':
        raise HTTPException(status_code=status.HTTP_408_REQUEST_TIMEOUT, detail=schemas.OtpExpired.description())
    crud.decrement_otp_verification_attempts(db, db_otp_record=db_otp_record)
    # In case of success match
    if db_otp_record.otp_code == verification_request.otp:
        db_existed_volunteer = crud.get_volunteer_by_phone_number(db, phone_number=db_otp_record.phone_number)
        if db_existed_volunteer:
            # If volunteer already exist on this phone number set cookie
            #response.set_cookie(**get_cookie_params(crud.get_access_token_for_volunteer(db_existed_volunteer)))
            jwt_token = crud.get_access_token_for_volunteer(db_existed_volunteer)
            print(jwt_token)
            return schemas.VolunteerLoggedInResponse(user_role=db_existed_volunteer.role.value, token=jwt_token)
        # If no volunteer is registered enable registration for this otp phone number
        crud.authenticate_otp(db, db_otp_record)
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={'attempts_left': db_otp_record.attempts_left})
    return schemas.VolunteerLoggedInResponse(user_role="", token="")
