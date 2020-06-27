import enum
import uuid
from datetime import datetime

class NotificationType(enum.Enum):
    EMAIL = 1,
    MESSAGE = 2


class Notification(object):
    __id: uuid
    __receiver_id: str
    __type: NotificationType
    __create_date_time: datetime
    __update_date_time: datetime
    __is_sent: bool
    __title: str
    __message: str

    def __init__(self, receiver_id, type: NotificationType):
        self.id = uuid.uuid4()
        self.receiver_id = receiver_id
        self.type = type
        self.date_time = datetime.now()
        self.is_sent = False

    def get_receiver_id(self):
        return self.receiver_id

    def set_title(self,title: str):
        self.title= title

    def get_title(self):
        return self.title

    def set_message(self, message: str):
        self.message = message

    def get_message(self):
        return self.message

    def get_type(self):
        return self.type

    def notification_sent(self):
        self.is_sent = True

    def get_id(self):
        return self.id

    def get_update_time(self):
        return self.update_date_time

    def __update_time(self):
        self.update_date_time = datetime.now()


class EmailNotification(Notification):
    __email_address: str

    def __init__(self, reciever_id, email_address):
        Notification.__init__(reciever_id, NotificationType.EMAIL)
        self.email_address = email_address

    def get_email(self):
        return self.email_address


class MessageNotification(Notification):
    __phone_number: str

    def __init__(self,receiver_id: str, phone_number: str):
        Notification.__init__(self,receiver_id,NotificationType.MESSAGE)
        self.phone_number = phone_number

    def get_phone_number(self):
        return self.phone_number