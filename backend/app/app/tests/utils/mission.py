import requests

from app.core import config
from app.tests.utils.utils import get_server_api

server_api = get_server_api()


def create_mission(mission: dict, cookie):
    jar = requests.cookies.RequestsCookieJar()
    jar.set('d2dSid', value=cookie['value'], domain='http://localhost', secure=True)
    return requests.put(f"{server_api}{config.API_V1_STR}/mission/create", json=mission, cookies=jar)
