import contextlib


from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

from ..core import config

engine = create_engine(config.SQLALCHEMY_DATABASE_URI, pool_pre_ping=True, pool_size=200, max_overflow=100)
db_worker_session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@contextlib.contextmanager
def get_db_session():
    db_session = SessionLocal()
    try:
        yield db_session
    except Exception:
        db_session.rollback()
        raise
    finally:
        db_session.close()
