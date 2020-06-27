from typing import Dict
from datetime import datetime, time, timedelta

from app import models

FRIDAY = 4
SATURDAY = 5
SUNDAY = 6

# TODO: change this to accommodate DLT as well.
UTC_TIME_DIFFERENCE = 3

MORNING = 9 - UTC_TIME_DIFFERENCE
AFTERNOON = 12 - UTC_TIME_DIFFERENCE
EVENING = 17 - UTC_TIME_DIFFERENCE
EVENING_MAX = 20 - UTC_TIME_DIFFERENCE

time_mapping: Dict[models.MissionPreferedHours, datetime.time] = {
    models.MissionPreferedHours.morning: time(MORNING,0),
    models.MissionPreferedHours.afternoon: time(AFTERNOON,0),
    models.MissionPreferedHours.evening: time(EVENING,0)
}


def get_corresponding_hour(preferred_hour: models.MissionPreferedHours) -> time:
    return time_mapping[preferred_hour]


def get_next_scheduling_time(scheduled_time: datetime) -> datetime:
    # Avoid sending sms on Fridays after 12PM, Saturdays, and after 8PM
    scheduled_day = scheduled_time.weekday()
    if scheduled_day == SATURDAY or (scheduled_day == FRIDAY and scheduled_time.time() > time(AFTERNOON)):
        scheduled_time += timedelta(days=SUNDAY-scheduled_time.weekday())
        scheduled_time = scheduled_time.replace(hour=MORNING, minute=0)
    elif scheduled_time.time() > time(EVENING_MAX):
        scheduled_time += timedelta(days=1)
        scheduled_time = scheduled_time.replace(hour=MORNING, minute=0)
    elif scheduled_time.time() < time(MORNING):
        scheduled_time = scheduled_time.replace(hour=MORNING, minute=0)
    return scheduled_time
