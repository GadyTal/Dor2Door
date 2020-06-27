import logging
import typing
from datetime import datetime

from sqlalchemy import and_, or_
from sqlalchemy.orm import Session

from app import models, search_utils, crud
from app.core import utils, config
from app.db.session import get_db_session
from app.models import Mission

logger = logging.getLogger(__name__)


def get_square(square_center_point: models.Coordinates, expansion_in_meters: int):
    square_down_left_point = models.Coordinates(
        lat=square_center_point.lat + utils.convert_meters_to_earth_latitude(expansion_in_meters),
        lng=square_center_point.lng + utils.convert_meters_to_earth_longtitude(expansion_in_meters))

    square_up_right_point = models.Coordinates(
        lat=square_center_point.lat - utils.convert_meters_to_earth_latitude(expansion_in_meters),
        lng=square_center_point.lng - utils.convert_meters_to_earth_longtitude(expansion_in_meters))
    return square_down_left_point, square_up_right_point


def get_volunteers_in_square(db: Session, square_center_point: models.Coordinates,
                             group_count: int = config.AMOUNT_OF_VOLUNTEERS_TO_FIND_FOR_MISSION, group_of_ten: int = 1):
    # Create a square around the elder
    #                    _________________ square_up_right
    #                   |                 |
    #                   |                 |
    #                   |      elder      |
    #                   |                 |
    #                   |_________________|
    #   square_down_left
    min_number_of_helpers = group_of_ten * 1
    expansions = [1000, 2000, 5000, 15000]
    volunteers: typing.Set[models.Volunteer] = set()

    for expansion in expansions:
        print(f"In expansion {expansion}")
        square_down_left_point, square_up_right_point = get_square(square_center_point, expansion)
        # If there are enough helpers in this square, exit the while loop
        # rows = db.execute(f'SELECT * FROM volunteers WHERE volunteers.address_lat <= {square_down_left_point.lat} AND volunteers.address_lat >= {square_up_right_point.lat} AND volunteers.address_lng <= {square_down_left_point.lng} AND volunteers.address_lng >= {square_up_right_point.lng} LIMIT 10').fetchall()# TODO change limit
        volunteers_db = db.query(models.Volunteer).filter(
            and_(models.Volunteer.is_inside_great_square(down_left_coord=square_up_right_point,
                                                         up_right_coord=square_down_left_point),
                 models.Volunteer.is_active == True,
                 models.Volunteer.is_subscribed == True,
                 or_(models.Volunteer.role == models.VolunteerRole.admin,
                     models.Volunteer.last_whatsapp_mission_at == None,  # TODO: Move this to hybrid method
                     models.Volunteer.last_whatsapp_mission_at <= models.get_utc_now() - config.ANTI_VOLUNTEER_SPAM_INTERVAL))) \
            .limit(config.AMOUNT_OF_VOLUNTEERS_TO_FIND_FOR_MISSION)
        for vol in volunteers_db:
            if not vol.active_mission:  # TODO: Move to filter scope
                volunteers.add(vol)
        if len(volunteers) >= group_count * group_of_ten:
            break

    return sorted(volunteers, key=lambda volunteer: utils.calculate_distance(coord1=square_center_point,
                                                                             coord2=volunteer.address_coords))[
           group_count * (group_of_ten - 1):group_count * group_of_ten]


def notify_volunteer_new_mission(db: Session, volunteer: models.Volunteer, mission: models.Mission):
    volunteer_distance_from_mission = utils.calculate_distance(coord1=volunteer.address_coords,
                                                               coord2=mission.elder_address)
    utils.notifications_handler.send_new_assistance_request(volunteer_name=volunteer.first_name_capitalized,
                                                            volunteer_phone=volunteer.phone_number,
                                                            distance=volunteer_distance_from_mission,
                                                            elder_name=mission.elder_first_name_capitalized,
                                                            mission_url=config.MISSON_FOR_VOLUNTEER_URL.format(
                                                                mission_id=mission.uuid))
    volunteer.last_whatsapp_mission_at = models.get_utc_now()
    if mission not in volunteer.missions:
        volunteer.missions.append(mission)
    else:
        logger.info(f"Mission {mission.uuid} already exists for volunteer {volunteer.uuid}")


def search_task_caller(mission_uuid: str):
    with get_db_session() as db:
        mission = db.query(models.Mission).filter(models.Mission.uuid == mission_uuid).first()
        search_and_notify_nearby_volunteers(db, mission)


def search_and_notify_nearby_volunteers(db: Session, mission: models.Mission):
    log = []
    nearby_volunteers = get_volunteers_in_square(db, models.Coordinates(lat=mission.elder_address_lat,
                                                                        lng=mission.elder_address_lng))
    log.append(f"Found {len(nearby_volunteers)} volunteers near mission {mission.uuid}")
    print(f"Found {len(nearby_volunteers)} volunteers near mission {mission.uuid}")
    if not nearby_volunteers:
        log.append(f"There is no volunteers near by mission {mission.uuid}")
        print(f"There is no volunteers near by mission {mission.uuid}")
    else:
        # Notify relevant volunteers
        for volunteer in nearby_volunteers:
            notify_volunteer_new_mission(db, volunteer, mission)
            log.append(f"Sending message to volunteer: {volunteer.phone_number}")
            print(f"Sending message to volunteer: {volunteer.phone_number}")
            db.commit()

    return '\n'.join(log)


def determine_task_scheduling(mission: Mission):
    scheduled_datetime = datetime.combine(mission.scheduled_to_date,
                                          search_utils.get_corresponding_hour(mission.prefered_hours))
    # If the date is in the wrong range it would change it
    return search_utils.get_next_scheduling_time(scheduled_datetime)


def schedule_search(db: Session, mission: Mission):
    designated_endpoint = config.VERIFY_MISSION_TASK_ENDPOINT.format(mission_id=mission.uuid)

    # Deletes all existent tasks that relate to mission to start a new count
    crud.del_scheduled_tasks_entries(db, designated_endpoint)
    determined_datetime = determine_task_scheduling(mission)
    task = models.ScheduledTasks(scheduled_at=determined_datetime,
                                 endpoint=designated_endpoint)
    logger.info(f'Scheduling a volunteer search for mission {mission.uuid} at {determined_datetime}')
    db.add(task)
    db.commit()
