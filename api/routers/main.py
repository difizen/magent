from fastapi import APIRouter

from .agent.router import agent_router
from .account.router import account_router


api_router = APIRouter()

api_router.include_router(agent_router, prefix="/agent", tags=["agent"])
api_router.include_router(account_router, prefix="/account", tags=["account"])
