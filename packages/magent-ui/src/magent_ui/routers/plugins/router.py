from typing import List
from fastapi import APIRouter
from agentuniverse_product.service.plugin_service.plugin_service import PluginService
from agentuniverse_product.service.model.plugin_dto import PluginDTO
from magent_ui.utils import AsyncTask

router = APIRouter()
plugins_router = router


@router.get("/plugins", response_model=List[PluginDTO])
async def get_agents():
    return await AsyncTask.to_thread(PluginService.get_plugin_list)


@router.post("/plugins/openapi", response_model=str)
async def create_plugin_with_openapi(plugin: PluginDTO):
    return await AsyncTask.to_thread(PluginService.create_plugin_with_openapi, plugin)
