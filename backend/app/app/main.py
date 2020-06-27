import sentry_sdk
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from sentry_asgi import SentryMiddleware
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request

from app.api.api_v1.api import api_router
from app.core import config
from app.db.session import SessionLocal

app = FastAPI(title=config.PROJECT_NAME, openapi_url="/api/v1/openapi.json")

# CORS
origins = []

# Set all CORS enabled origins
if config.BACKEND_CORS_ORIGINS:
    origins_raw = config.BACKEND_CORS_ORIGINS.split(",")
    for origin in origins_raw:
        use_origin = origin.strip()
        origins.append(use_origin)
app.add_middleware(
    CORSMiddleware,
    # TODO: Disable origins
    allow_origins=[
        "http://localhost",
        "https://localhost",
        "http://localhost:3000",
        "https://localhost:3000",
        "https://stageapp.door2dor.co.il",
        "https://stage.door2dor.co.il",
        "https://elb-stage.door2dor.co.il",
        "https://elb-prod.door2dor.co.il",
        "https://app.door2dor.co.il"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
),

sentry_sdk.init(config.SENTRY_URL)
app.add_middleware(SentryMiddleware)

app.include_router(api_router, prefix=config.API_V1_STR)
app.mount("/", StaticFiles(directory="/static", html=True), name="static")


@app.middleware("http")
async def db_session_middleware(request: Request, call_next):
    request.state.db = SessionLocal()
    response = await call_next(request)
    request.state.db.close()
    return response
