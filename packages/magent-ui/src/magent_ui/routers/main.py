from fastapi import APIRouter
from magent_ui.routers.agents.router import agents_router
from magent_ui.routers.knowledge.router import knowledge_router
from magent_ui.routers.llms.router import llms_router
from magent_ui.routers.sessions.router import sessions_router
from magent_ui.routers.tools.router import tools_router
from magent_ui.routers.resource.router import resource_router
from magent_ui.routers.workflow.router import workflow_router
from magent_ui.routers.common.router import common_router
from magent_ui.routers.plugins.router import plugins_router

api_router = APIRouter()

api_router.include_router(agents_router, prefix="/v1", tags=["agent"])
api_router.include_router(knowledge_router, prefix="/v1", tags=["knowledge"])
api_router.include_router(llms_router, prefix="/v1", tags=["llm"])
api_router.include_router(sessions_router, prefix="/v1", tags=["session"])
api_router.include_router(tools_router, prefix="/v1", tags=["tool"])
api_router.include_router(resource_router, prefix="/v1", tags=["resource"])
api_router.include_router(workflow_router, prefix="/v1", tags=["workflow"])
api_router.include_router(common_router, prefix="/v1", tags=["common"])
api_router.include_router(plugins_router, prefix="/v1", tags=["plugin"])
