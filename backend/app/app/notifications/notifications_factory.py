import os
from app.core import config
from app.notifications.utils import Utils
from app.notifications.text_service import TextSerivce
from app.notifications.combox_client import ComboxClient
import logging


class NotificationsFactory(object):

    def __init__(self):
        self.text_service = TextSerivce()
        self.combox_client = ComboxClient()
        self.__logger = logging.getLogger(__name__)
        # self.base_url = config.SERVER_HOST

    def send_verification_code(self, phone_number: str, otp_code: str) -> str or bool:
        text = self.text_service.get_text('sms.auth.message').format(otp_code)
        result = self.combox_client.send_sms_message(message=text, phone_number=phone_number)
        # result can be either OTP or None
        if not result:
            raise RuntimeError("Failed sending OTP to: {}".format(phone_number))


    def __send_whatspp_template(self, phone_number: str, template_name: str, *params) -> str or bool:
        self.__logger.info("#__send_whatspp_template# send whatsapp template: {}".format(template_name))
        localized_params= self.__format_params(params)
        return self.combox_client.send_whatsapp_message(phone_number=phone_number, template_name=template_name,
                                                        localized_params=localized_params)

    def __format_params(self, *params):
        localized_params = []
        for param in params:
            param_val = {
                "default": param
            }
            localized_params.append(param_val)
        self.__logger.info("#__format_params# params: {}".format(localized_params))
        return localized_params

    def send_whatsapp_welcome_message(self, phone_number: str, name: str) -> str or bool:
        message = self.text_service.get_text("whatsapp.welcome.message").format(name)
        self.__logger.info("#send_whatsapp_welcome_message# message: {} to {}".format(message,phone_number))
        return self.combox_client.send_sms_message(message=message,phone_number=phone_number)
        # template_name = self.text_service.get_text("whatsapp.welcome.template")
        # return self.__send_whatspp_template(phone_number,template_name,name)
        # return self.twilio_client.send_sms_message(message,phone_number)

    def send_new_assistance_request(self, volunteer_name: object, volunteer_phone: object, distance: object, elder_name: object,
                                    mission_url: object) -> object:
        mission_url = self.__shrink_url(mission_url)
        message = self.text_service.get_text("whatsapp.new.assistance.message").format(volunteer_name,distance,elder_name,elder_name,mission_url)
        self.__logger.info("#send_new_assistance_request# message: {} to {}".format(message, volunteer_phone))
        return self.combox_client.send_sms_message(message=message,phone_number=volunteer_phone)
        # template_name = self.text_service.get_text("whatsapp.new.assistance.template")
        # return self.__send_whatspp_template(volunteer_phone,template_name,volunteer_name,distance,elder_name,elder_name,mission_url)
        # # return self.twilio_client.send_sms_message(message,volunteer_phone)

    def send_cancel_volunteer_notification(self, volunteer_name: str, phone_number: str) -> str or bool:
        message = self.text_service.get_text("whatsapp.cancel.notifications.message").format(volunteer_name)
        self.__logger.info("#send_cancel_volunteer_notification# message: {} to {}".format(message, phone_number))
        return self.combox_client.send_sms_message(message=message,phone_number=phone_number)
        # template_name = self.text_service.get_text("whatsapp.cancel.notifications.template")
        # return self.__send_whatspp_template(phone_number,template_name,volunteer_name)
        # return self.twilio_client.send_sms_message(message, phone_number)

    def send_volunteer_resubscribed(self, volunteer_name: str, phone_number: str) -> str or bool:
        message = self.text_service.get_text("whatsapp.resubscribed.message").format(volunteer_name)
        self.__logger.info("#send_new_assistance_request# message: {} to {}".format(message, phone_number))
        return self.combox_client.send_sms_message(message=message,phone_number=phone_number)
        # template_name = self.text_service.get_text("whatsapp.resubscribed.template")
        # return self.__send_whatspp_template(phone_number,template_name,volunteer_name)
        # return self.twilio_client.send_sms_message(phone_number=phone_number,template_name=template_name,)

    def send_first_reminder(self, volunteer_name: str, phone_number: str, elder_name: str, mission_id: str) -> bool or str:
        mission_url = self.__shrink_url(self.base_url + mission_id)
        message = self.text_service.get_text("whatsapp.first.reminder.message").format(volunteer_name, elder_name,
                                                                                        mission_url)
        return self.combox_client.send_sms_message(message=message,phone_number=phone_number)
        # template_name = self.text_service.get_text("whatsapp.first.reminder..template")
        # return self.__send_whatspp_template(phone_number,template_name,volunteer_name,elder_name,mission_url)
        # return self.twilio_client.send_sms_message(message, phone_number)

    def send_second_reminder(self, volunteer_name: str, elder_name: str, phone_number: str, mission_id: str) -> bool:
        missions_url = self.__shrink_url(self.base_url + mission_id)
        message = self.text_service.get_text("whatsapp.second.reminder.message").format(volunteer_name, elder_name,
                                                                                        missions_url)
        return self.combox_client.send_sms_message(message=message,phone_number=phone_number)
        # template_name = self.text_service.get_text("whatsapp.second.reminder.template")
        # return self.__send_whatspp_template(phone_number,template_name,volunteer_name,elder_name,missions_url)
        # return self.twilio_client.send_sms_message(message, phone_number)

    def __shrink_url(self, link: str) -> str:
        shrink = Utils.shrink_url(link)
        self.__logger.info("#__shrink_url# shrinked url: {} to: {}".format(link, shrink))
        return shrink
