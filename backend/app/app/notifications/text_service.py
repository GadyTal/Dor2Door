import json, os
from app.core import config

class TextSerivce(object):
    __dict: dict

    def __init__(self):
        with open(os.path.join(os.path.dirname(os.path.realpath(__file__)), config.OTP_SMS_TEMPLATES_FILENAME)) as reader:
            self.__dict = json.load(reader)

    def get_text(self, key: str) -> str:
        if self.__dict.__contains__(key):
            return self.__dict[key]
        else:
            raise ValueError("No key found: {}".format(key))
