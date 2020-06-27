import random, math,traceback
import urllib.request
from app.core import config

class Utils(object):

    @staticmethod
    def shrink_url(url: str) -> str or None:
        try:
            api_url = config.TINY_URL
            tinyurl = urllib.request.urlopen(api_url + url).read()
            return tinyurl.decode("utf-8")
        except Exception as e:
            traceback.print_exc()
            return None
    @staticmethod
    def get_numeric_otp(length: int) -> str:
        try:
            digits = "0123456789"
            OTP = ""
            for i in range(length):
                OTP += digits[math.floor(random.random() * 10)]
            return OTP
        except Exception as e:

            traceback.print_exc()
            raise RuntimeError("Failed creating OTP: {} ".format(e))