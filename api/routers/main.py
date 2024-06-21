from fastapi import APIRouter

from .agent.router import agent_router
from .account.router import account_router
from .conversation.router import conversation_router


api_router = APIRouter()

api_router.include_router(agent_router, prefix="/agent", tags=["agent"])
api_router.include_router(account_router, prefix="/account", tags=["account"])
api_router.include_router(
    conversation_router, prefix="/conversation", tags=["conversation"])
