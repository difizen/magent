from fastapi import APIRouter
from magent_ui.routers.agents.router import agents_router
from magent_ui.routers.knowledge.router import knowledge_router
from magent_ui.routers.llms.router import llms_router
from magent_ui.routers.sessions.router import sessions_router
from magent_ui.routers.tools.router import tools_router

api_router = APIRouter()

api_router.include_router(agents_router, prefix="", tags=["agent"])
api_router.include_router(knowledge_router, prefix="", tags=["knowledge"])
api_router.include_router(llms_router, prefix="", tags=["llm"])
api_router.include_router(sessions_router, prefix="", tags=["session"])
api_router.include_router(tools_router, prefix="", tags=["tool"])
