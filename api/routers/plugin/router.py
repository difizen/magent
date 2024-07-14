from fastapi import APIRouter, HTTPException

from fastapi_pagination import Page, paginate
from models.plugin import PluginModel, PluginCreate, PluginUpdate
from models.plugin_api import PluginApiCreate, PluginApiModel, PluginApiUpdate
from models.plugin_config import PluginConfigModel, PluginConfigCreate, PluginConfigUpdate
from services.plugin import PluginAPIService, PluginConfigService, PluginService

router = APIRouter()

plugin_router = router


@router.post("/", response_model=PluginModel)
def create_plugin(user_id: int, plugin: PluginCreate):
    plugin_model = PluginService.create(user_id, plugin)
    return plugin_model


@router.get("/", response_model=Page[PluginModel])
def get_plugins(user_id: int):
    data = paginate(PluginService.get_user_plugin(user_id))
    return data


@router.get("/", response_model=Page[PluginModel])
def get_all_plugins():
    data = paginate(PluginService.get_all())
    return data


@router.get("/{plugin_id}", response_model=PluginModel)
async def get_plugin(plugin_id, user_id: int, with_draft=False):
    plugin_model = PluginService.get_by_id(plugin_id)
    if plugin_model is None:
        raise HTTPException(404)
    if with_draft:
        draft = PluginConfigService.get_or_create_plugin_draft(
            user_id, plugin_model.id)
        plugin_model.draft = draft
    return plugin_model


@router.get("/{plugin_id}/draft", response_model=PluginConfigModel)
async def get_or_create_plugin_draft_config(user_id: int, plugin_id):
    model = PluginConfigService.get_or_create_plugin_draft(
        user_id, plugin_id)
    if model is None:
        raise HTTPException(404)
    return model


@router.put("/{plugin_id}")
async def update_plugin(user_id: int, plugin: PluginUpdate):
    success = PluginService.update(user_id,  plugin)
    return success


@router.get("/configs/{config_id}", response_model=PluginConfigModel)
async def get_plugin_config(config_id):
    model = PluginConfigService.get_by_id(config_id)
    if model is None:
        raise HTTPException(404)
    return model


@router.put("/configs/{config_id}")
async def update_plugin_config(user_id: int, config: PluginConfigUpdate):
    success = PluginConfigService.update(user_id, config)
    return success


@router.post("/configs", response_model=PluginConfigModel)
async def create_plugin_config(user_id: int, config: PluginConfigCreate):
    model = PluginConfigService.create(user_id, config)
    return model


@router.get("/api/{api_id}", response_model=PluginApiModel)
async def get_plugin_api(api_id):
    model = PluginAPIService.get_by_id(api_id)
    if model is None:
        raise HTTPException(404)
    return model


@router.put("/api/{api_id}")
async def update_plugin_api(user_id: int, api: PluginApiUpdate):
    success = PluginAPIService.update(user_id, api)
    return success


@router.post("/api", response_model=PluginApiModel)
async def create_plugin_api(user_id: int, api: PluginApiCreate):
    model = PluginAPIService.create(user_id, api)
    return model
