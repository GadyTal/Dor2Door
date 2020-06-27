from fastapi import APIRouter

from app.api.api_v1.endpoints import admin, mission, volunteer, tasks, sms_verification

api_router = APIRouter()
api_router.include_router(sms_verification.router, prefix="/sms_verification", tags=["SMS Verification"])
api_router.include_router(volunteer.router, prefix="/volunteer", tags=["Volunteer Operations"])
api_router.include_router(mission.router, prefix="/mission", tags=["Mission Operations (Reserved for Call-Center)"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin Operations (Reserved for admins only)"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["Scheduled tasks automation (Meant to be call only within the server machine (localhost))"])