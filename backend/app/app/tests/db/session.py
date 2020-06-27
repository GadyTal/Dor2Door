from sqlalchemy.orm import scoped_session, sessionmaker

from app.db.session import engine

# Try to avoid using me in production. Currently still here because code in tests using me.
db_session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))