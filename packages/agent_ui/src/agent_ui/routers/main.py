from fastapi import APIRouter
from .demos.router import demos_router

api_router = APIRouter()

api_router.include_router(
    demos_router, prefix="/agentuniverse", tags=["agentuniverse"])
