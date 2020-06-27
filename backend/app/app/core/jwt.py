import datetime

import jwt

from app.core import config

'''
JWT RFC:
https://tools.ietf.org/html/draft-ietf-oauth-json-web-token-25
sub - Subject of the JWT (Volunteer).
exp - Expiration time in which the JWT token will be invalid by the server.
iat - Issue time, identifies the time at which the JWT as issued.
iss - Issuer of the JWT.
'''

def create_access_token(token: str, exipres_delta: datetime.timedelta = datetime.timedelta(days=config.ACCESS_TOKEN_EXPIRE_DAYS)):
    data = {"sub": token,
            "exp": datetime.datetime.utcnow() + exipres_delta,
            "iat": datetime.datetime.utcnow(),
            "iss": config.SERVER_HOST,
            }
    return jwt.encode(data, key=config.JWT_SECRET_KEY, algorithm=config.JWT_ALGORITHM)
