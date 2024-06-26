from fastapi import APIRouter

from .agent.router import agent_router
from .account.router import account_router
from .chat.router import chat_router


api_router = APIRouter()

api_router.include_router(agent_router, prefix="/agent", tags=["agent"])
api_router.include_router(account_router, prefix="/accounts", tags=["account"])
api_router.include_router(chat_router, prefix="/chats", tags=["chat"])
