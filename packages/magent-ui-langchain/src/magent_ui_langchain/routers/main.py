from fastapi import APIRouter

from magent_ui_langchain.routers.chat.router import chat_router

api_router = APIRouter()

api_router.include_router(chat_router, prefix="/v1", tags=["chat"])
