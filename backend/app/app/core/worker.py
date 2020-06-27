import logging
import time as timesleep
from datetime import timedelta
from typing import List

import requests
from fastapi import status
from sqlalchemy import and_
from sqlalchemy.orm import Session

from app import models, crud, search_utils
from app.core import config
from app.db.session import db_worker_session

SAFETY_MARGIN = 5

db: Session = db_worker_session
logger = logging.getLogger(__name__)


def pull_tasks() -> List[models.ScheduledTasks]:
    with db.begin_nested():
        now = models.get_utc_now()
        db.execute('LOCK TABLE {table_name} IN EXCLUSIVE MODE;'.format(table_name="scheduled_tasks"))
        # Fetch all not executed/completed/failed task that scheduled date passed
        return db.query(models.ScheduledTasks).filter(and_(models.ScheduledTasks.executed_at == None,
                                                           models.ScheduledTasks.completed_at == None,
                                                           models.ScheduledTasks.failed_at == None,
                                                           models.ScheduledTasks.scheduled_at > now - timedelta(
                                                               hours=SAFETY_MARGIN),
                                                           models.ScheduledTasks.scheduled_at <= now)) \
            .order_by(models.ScheduledTasks.scheduled_at.asc()) \
            .all()


def number_of_completed_tasks(task: models.ScheduledTasks) -> int:
    return db.query(models.ScheduledTasks).filter(and_(models.ScheduledTasks.endpoint == task.endpoint,
                                                       models.ScheduledTasks.completed_at != None)) \
        .count()


def add_next_task_time(task: models.ScheduledTasks):
    set_new_time = search_utils.get_next_scheduling_time(models.get_utc_now() + config.ANTI_VOLUNTEER_SPAM_INTERVAL)
    new_task = models.ScheduledTasks(scheduled_at=set_new_time,
                                     endpoint=task.endpoint)
    db.add(new_task)
    db.commit()


def event_loop():
    while True:
        logger.info('Starting worker Iteration')
        timesleep.sleep(config.WORKER_INTERVAL_SECONDS)
        tasks: List[models.ScheduledTasks] = pull_tasks()
        logger.info(f'Pulled {len(tasks)} tasks')
        for task in tasks:
            # TODO: Format safer
            task.executed_at = models.get_utc_now()
            # Get mission id from endpoint column
            mission_uuid = task.endpoint.split('/')[3].split('?')[0]
            mission: models.Mission = crud.get_mission_by_uuid(db, mission_uuid)
            # Don't do anything if mission state is not approved
            if mission.state != models.MissionState.approved:
                logger.info(f'mission {mission.uuid} status is not approved and was changed to {mission.state.name}')
                task.failure_description = f'{mission.uuid} is not in state approved'
                continue
            if number_of_completed_tasks(task) < config.MAX_SEARCHING_VOLUNTEERS_ATTEMPTS:
                add_next_task_time(task)
            # Set the MissionErrorState to no volunteers found
            else:
                crud.set_mission_error(db, mission, models.MissionErrorState.no_volunteers_found)
                continue
            request_url = f'http://localhost{config.API_V1_STR}{task.endpoint}'
            logger.info(f'Running {request_url}')
            response = requests.get(url=request_url)
            # Valid response
            if response.status_code == status.HTTP_200_OK:
                task.completed_at = models.get_utc_now()
            # Error occurred
            else:
                task.failed_at = models.get_utc_now()
                task.failure_description = f'{response.status_code}: {response.text}'
        db.commit()
        logger.info('Iteration is finished')


if __name__ == "__main__":
    event_loop()
