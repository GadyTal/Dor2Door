import requests
import os
import logging
import traceback
from app.core import config
from app.notifications import UriMappings
import json
import types


class ComboxClient(object):

    def __init__(self):
        self.base_url = config.COMBOX_BASE_URL
        self.api_key = config.COMBOX_API_KEY
        logging.basicConfig(level=logging.INFO)
        self.__logger = logging.getLogger(__name__)
        self.token = config.COMBOX_API_KEY
        self.errors = {
            400: "Bad request",
            401: "Unauthorized",
            404: "Uri not found",
            429: "Too many requests",
            500: "API Error",
            501: "Operation not supported"
        }
        self.stream_id = config.ENCRYPTED_STREAM_ID

    def __send_post(self, uri: str, data: dict) -> bool or str:
        try:
            self.__logger.info("#__send_post# uri: {} data: {}".format(uri, data))
            path = "{}{}{}?access_token={}".format(self.base_url, uri, self.stream_id, self.api_key)
            response = requests.post(url=path, json=data)
            if response:
                # resposeJson = json.loads(response.text)
                # if resposeJson[Constants.STATUS] == 200:
                self.__logger.info("#__send_post# response: {}".format(response))
                return True
                # else:
            else:
                self.__logger.error("#__send_post# failed with err: {}".format(response))
                resJson = response.json()
                err = self.errors[resJson['status']]
                return err
        except Exception as e:
            self.__logger.error("#__send_post# failed sending sms with err: {}".format(e))
            return False

    def send_sms_message(self, message: str, phone_number: str) -> str or bool:
        self.__logger.info("#send_sms_message# sending sms to: {} message {}".format(phone_number, message))
        data = {
            "data": {
                "Number": phone_number,
                "Message": message
            }
        }
        response = self.__send_post(UriMappings.COMBOX_SEND_SMS, data)
        if type(response) is str:
            self.__logger.error("#send_sms_message# failed sening sms to: {}, err: {}".format(phone_number, response))
        return response

    def send_whatsapp_message(self, phone_number: str, template_name: str, localized_params: list) -> str or bool:
        self.__logger.info("#send_whatsapp_message# sending message {} to {}".format(template_name,phone_number))
        data = {
            "recipient":"+{}".format(phone_number),
            "template_name":template_name,
            "language":{
                "code":"he_IL"
            },
            "localizable_params":localized_params,
            "validate":"true"
        }
        logging.info("#send_sms_message# data {}".format(data))
        response = self.__send_post(uri=UriMappings.COMBOX_SEND_WHATSAPP,data=data)
        if type(response) is str:
            self.__logger.error("#send_sms_message# failed err: {}".format(response))
        return response
