import math, random

from app.core import config
from app.models import Coordinates
from app.notifications import notifications_factory

from sqlalchemy.orm import Session
import geopy

notifications_handler = notifications_factory.NotificationsFactory()

def generate_otp(length: int):
    digits = "0123456789"
    otp = ""
    for i in range(length):
        otp += digits[math.floor(random.random() * 10)]
    return otp

def convert_meters_to_earth_latitude(value_in_meters: float):
    return value_in_meters * config.GEO_LATITUDE_1M_COEFFICIENT

def convert_meters_to_earth_longtitude(value_in_meters: float):
    return value_in_meters * config.GEO_LONGTITUDE_1M_COEFFICIENT

def calculate_distance(coord1: Coordinates, coord2: Coordinates):
    return int(geopy.distance.vincenty((coord1.lat, coord1.lng), (coord2.lat, coord2.lng)).meters)

def distance_to_string(distance):
    if distance.m >= 1000.0:
        return int(distance.km)
    return int(distance.m)
