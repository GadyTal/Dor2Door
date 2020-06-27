import pytest

from app.core import config
from app.tests.utils import volunteer, sms_verification
from app.tests.utils.utils import get_server_api


@pytest.fixture(scope="module")
def server_api():
    return get_server_api()


def pytest_sessionstart(session):
    """Cleanup a testing directory once we are finished."""
    #volunteer.remove_everything_for_phone_number(config.TEST_PHONE_NUMBER)
