import datetime

from app import crud, schemas, models
from app.core import config

from app.db import session
# make sure all SQL Alchemy models are imported before initializing DB
# otherwise, SQL Alchemy might fail to initialize relationships properly
# for more details: https://github.com/tiangolo/full-stack-fastapi-postgresql/issues/28
from app.db import base


def init_db(db_session):
    # If we are not in production let's have some dummy database
    if not config.IS_PRODUCTION:
        crud.delete_db_record_by_phone_number(db_session, config.TEST_PHONE_NUMBER)
        crud.delete_mission_by_elder_first_name(db_session, "First")
        crud.delete_mission_by_elder_first_name(db_session, "Yoni")
        crud.delete_mission_by_elder_first_name(db_session, "Michal")
        volunteer_create = schemas.CreateVolunteer(phone_number=config.TEST_PHONE_NUMBER,
                                                   first_name="David",
                                                   last_name="Levi",
                                                   email="david@gmail.com",
                                                   address=dict(address_lat=32.0716333,
                                                                address_lng=34.78104769999999,
                                                                address_str="asdasd asdasd"),
                                                   birthday=datetime.date(year=1996, month=3, day=29).strftime(
                                                       "%Y-%m-%d"))
        print(crud.create_volunteer(db_session, volunteer_create))
        new_mission = schemas.CreateMission(elder_first_name="First",
                                            elder_last_name="Last",
                                            elder_phone_number="972525286478",
                                            elder_address=dict(address_str="Tel Aviv, Habima",
                                                               address_lat=32.0728234,
                                                               address_lng=34.7791532),
                                            scheduled_to_date="2020-04-02",
                                            prefered_hours="morning",
                                            payment_method="cash",
                                            use_additional_contact=False,
                                            is_elder_need_visit_before="yes",
                                            purpose="grocery",
                                            description="string")
        print(crud.create_mission(db_session, new_mission))
        new_mission2 = schemas.CreateMission(elder_first_name="Yoni",
                                             elder_last_name="Shuki",
                                             elder_phone_number="972525286475",
                                             elder_address=dict(address_str="Tel Aviv, Habima",
                                                                address_lat=32.0728234,
                                                                address_lng=34.7791532),
                                             scheduled_to_date="2020-04-02",
                                             prefered_hours="afternoon",
                                             payment_method="cash",
                                             use_additional_contact=False,
                                             is_elder_need_visit_before="yes",
                                             purpose="grocery",
                                             description="string")
        print(crud.create_mission(db_session, new_mission2))
        new_mission3 = schemas.CreateMission(elder_first_name="Michal",
                                             elder_last_name="Kremer",
                                             elder_phone_number="972525284475",
                                             elder_address=dict(address_str="Tel Aviv, Habima",
                                                                address_lat=32.0728234,
                                                                address_lng=34.7791532),
                                             scheduled_to_date="2020-04-02",
                                             prefered_hours="afternoon",
                                             payment_method="cash",
                                             use_additional_contact=False,
                                             is_elder_need_visit_before="no",
                                             purpose="grocery",
                                             description="string")
        print(crud.create_mission(db_session, new_mission3))
