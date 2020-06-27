# from twilio.rest import Client
# import traceback
# import logging
# from app.notifications.Singleton import Singleton
# from app.core import config
#
#
# class TwilioClient(object):
#     __metaclass__ = Singleton
#     __SID: str
#     __AUTH: str
#     __client: Client
#     __twilio_phone_number: str
#     __twilio_whatsapp_number: str
#
#     def __init__(self):
#         self.__SID = config.TWILIO_SID
#         self.__AUTH = config.TWILIO_AUTH
#         self.__twilio_phone_number = config.TWILIO_PHONE
#         self.__client = Client(self.__SID, self.__AUTH)
#         logging.basicConfig(level=logging.INFO)
#         self.__logger = logging.getLogger(__name__)
#         self.__country_code = config.COUNTRY_CODE
#         self.__country_phone_code = config.COUNTRY_PHONE_CODE
#         self.__twilio_whatsapp_number = config.TWILIO_WHATSAPP
#
#     def __format_phone_number(self,phone_number: str) -> str:
#
#         try:
#             self.__logger.info("#__format_phone_number# number: {}".format(phone_number))
#             if not phone_number.startswith(self.__country_phone_code):
#                 phone_number = self.__client.lookups.phone_numbers(phone_number).fetch(
#                     self.__country_code).phone_number
#             self.__logger.info("__format_phone_number formatted phone number {}".format(phone_number))
#             return phone_number
#         except Exception as e:
#             self.__logger.error("__format_phone_number failed formatting phone number: {}".format(e))
#             traceback.print_exc()
#             raise RuntimeError("Failed formatting phone number {}".format(e))
#
#     def __send_message(self, message: str, from_phone_number: str, to_phone_number: str):
#         try:
#             self.__logger.info("Sending message to: {}, from {}, message_length: {}".format(to_phone_number, from_phone_number, len(message)))
#             outgoing_message = self.__client.messages.create(
#                 to=to_phone_number,
#                 from_=from_phone_number,
#                 body=message
#             )
#             self.__logger.info("Message sent, message SID: {}".format(outgoing_message.sid))
#             return True
#         except Exception as e:
#             self.__logger.error("Failed sending message to: {} err: {}".format(to_phone_number,e))
#             traceback.print_exc()
#             return False
#
#     def send_whatsapp_message(self, message: str, phone_number: str) -> bool:
#         phone_number= self.__format_phone_number(phone_number)
#         to_phone_number = "whatsapp:{}".format(phone_number)
#         from_phone_number = "whatsapp:{}".format(self.__twilio_whatsapp_number)
#         return self.__send_message(message=message, from_phone_number=from_phone_number,
#                                    to_phone_number=to_phone_number)
#
#     def send_sms_message(self, message: str, phone_number: str) -> str or None:
#         self.__logger.info("Sending SMS")
#         phone_number = self.__format_phone_number(phone_number)
#         result = self.__send_message(message=message, from_phone_number=self.__twilio_phone_number,
#                                      to_phone_number=phone_number)
#         return result
