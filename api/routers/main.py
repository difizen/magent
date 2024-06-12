from fastapi import APIRouter

from .agent.router import router as agent_router
from .account.router import router as account_router


api_router = APIRouter()

api_router.include_router(agent_router, prefix="/agent", tags=["agent"])
api_router.include_router(account_router, prefix="/account", tags=["account"])
