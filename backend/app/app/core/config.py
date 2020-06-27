import datetime, os
from urllib.parse import quote

def getenv_boolean(var_name, default_value=False):
    result = default_value
    env_value = os.getenv(var_name)
    if env_value is not None:
        result = env_value.upper() in ("TRUE", "1")
    return result

ENV_TINY_URL = ''
SERVER_NAME = os.getenv("SERVER_NAME")
SERVER_HOST = os.getenv("SERVER_HOST")
IS_PRODUCTION = True
BACKEND_CORS_ORIGINS = os.getenv(
    "BACKEND_CORS_ORIGINS"
)  # a string of origins separated by commas, e.g: "http://localhost, http://localhost:4200, http://localhost:3000, http://localhost:8080, http://local.dockertoolbox.tiangolo.com"
PROJECT_NAME = os.getenv("PROJECT_NAME")
SENTRY_DSN = os.getenv("SENTRY_DSN")

POSTGRES_SERVER = os.getenv("POSTGRES_SERVER")
POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
POSTGRES_DB = os.getenv("POSTGRES_DB")
SQLALCHEMY_DATABASE_URI = (
    f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}/{POSTGRES_DB}"
)

SMTP_TLS = getenv_boolean("SMTP_TLS", True)
SMTP_PORT = None
_SMTP_PORT = os.getenv("SMTP_PORT")
if _SMTP_PORT is not None:
    SMTP_PORT = int(_SMTP_PORT)
SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
EMAILS_FROM_EMAIL = os.getenv("EMAILS_FROM_EMAIL")
EMAILS_FROM_NAME = PROJECT_NAME
EMAIL_RESET_TOKEN_EXPIRE_HOURS = 48
EMAIL_TEMPLATES_DIR = "/app/app/email-templates/build"
EMAILS_ENABLED = SMTP_HOST and SMTP_PORT and EMAILS_FROM_EMAIL

FIRST_SUPERUSER = os.getenv("FIRST_SUPERUSER")
FIRST_SUPERUSER_PASSWORD = os.getenv("FIRST_SUPERUSER_PASSWORD")

USERS_OPEN_REGISTRATION = getenv_boolean("USERS_OPEN_REGISTRATION")

EMAIL_TEST_USER = "test@example.com"

# Combox configuration
COMBOX_BASE_URL = "https://api.commbox.io/"
COMBOX_API_KEY = os.getenv("COMBOX_API_KEY")
ENCRYPTED_STREAM_ID = os.getenv("ENCRYPTED_STREAM_ID")

# Twilo configuration
TWILIO_SID = os.getenv("TWILIO_SID")
TWILIO_AUTH = os.getenv("TWILIO_AUTH")
TWILIO_PHONE = os.getenv("TWILIO_PHONE")
TINY_URL = "https://tinyurl.com/api-create.php?url="
COUNTRY_CODE = "IL"
COUNTRY_PHONE_CODE = "+972"
TWILIO_WHATSAPP = os.getenv("TWILIO_WHATSAPP")
OTP_LENGTH = 4
OTP_SMS_TEMPLATES_FILENAME = 'text_dictionary.json'

# JWT Configuration
JWT_ALGORITHM = "HS256"
JWT_SECRET_KEY = os.getenvb(b"SECRET_KEY")

# Testing configuration
TEST_PHONE_NUMBER = ""

# API Configuration
API_V1_STR = "/api/v1"
COOKIE_KEY_NAME = "d2dSid"
# TODO: Should I put "domain" key inside the auth cookie?
COOKIE_PARAMS_TEMPLATE = {"key": COOKIE_KEY_NAME,
                          "value": "",
                          "secure": IS_PRODUCTION,  # True for production False for dev
                          "httponly": IS_PRODUCTION,  # True for production False for dev
                          }

# Sentry config
SENTRY_URL = ''

# Backend Configuration
# How much time client should wait before sending another sms
INTERNAL_API_TOKEN = "SOME_BIG_TOKEN"
PHONE_VERIFICATION_TIMEOUT_SECONDS = 1 # TODO Change to real values
ACCESS_TOKEN_EXPIRE_DAYS = 365  # 1 Year
WELCOME_WHATSAPP_DAYS_BEFORE_SEND_AGAIN = 1
# How many attempts before make this OTP verification invalid
PHONE_VALIDATION_MAX_ATTEMPTS = 5
# Geo configuration
GEO_VOLUNTEERS_LOCATION_SQUARE_EXPAND_METERS = 500
GEO_LATITUDE_1M_COEFFICIENT = 0.00000902
GEO_LONGTITUDE_1M_COEFFICIENT = 0.000010592
MISSON_FOR_VOLUNTEER_URL = f'{SERVER_HOST}{API_V1_STR}/mission/{{mission_id}}'
AMOUNT_OF_VOLUNTEERS_TO_FIND_FOR_MISSION = 10
TIME_TO_WAIT_BEFORE_ANOTHER_SEARCH_FIRST_LOOKUP = datetime.timedelta(minutes=60)
TIME_TO_WAIT_BEFORE_ANOTHER_SEARCH_AFTER_DECLINE_NO_ANSWER = datetime.timedelta(minutes=30)
VERIFY_MISSION_TASK_ENDPOINT = '/tasks/verify_mission/{mission_id}?internal_token=' + quote(INTERNAL_API_TOKEN)
WORKER_INTERVAL_SECONDS = 60 * 2 # 2 Minutes
ANTI_VOLUNTEER_SPAM_INTERVAL = datetime.timedelta(hours=4)
# How many times we would try find volunteers
MAX_SEARCHING_VOLUNTEERS_ATTEMPTS = 3
# How much time in advance the system would start searching for volunteers
IN_ADVANCE_NOTIFICATION_TIME = 3
