from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from fastapi_pagination import Page
from models.plugin import PluginModel, PluginCreate, PluginUpdate
from models.plugin_api import PluginApiCreate, PluginApiModel, PluginApiUpdate
from models.plugin_config import PluginConfigModel, PluginConfigCreate, PluginConfigUpdate

from db import get_db
from .crud import PluginHelper, PluginConfigHelper, PluginAPIHelper

router = APIRouter()

plugin_router = router


@router.post("/", response_model=PluginModel)
def create_plugin(user_id: int, plugin: PluginCreate, session: Session = Depends(get_db)):
    model = PluginHelper.create(session, user_id, plugin)
    return PluginModel.model_validate(model)


@router.get("/", response_model=Page[PluginModel])
def get_plugins(user_id: int, session: Session = Depends(get_db)):
    data = PluginHelper.get_user_plugin(session, user_id)
    return data


@router.get("/", response_model=Page[PluginModel])
def get_all_plugins(session: Session = Depends(get_db)):
    data = PluginHelper.get_all_plugin(session)
    return data


@router.get("/{plugin_id}", response_model=PluginModel)
async def get_plugin(plugin_id, user_id: int, with_draft=False, session: Session = Depends(get_db)):
    model = PluginHelper.get(session, plugin_id)
    if model is None:
        raise HTTPException(404)
    plugin_model = PluginModel.model_validate(model)
    if with_draft:
        draft = PluginConfigHelper.get_or_create_plugin_draft(
            session, user_id, plugin_model.id)
        plugin_model.draft = draft
    return plugin_model


@router.get("/{plugin_id}/draft", response_model=PluginConfigModel)
async def get_or_create_plugin_draft_config(user_id: int, plugin_id, session: Session = Depends(get_db)):
    model = PluginConfigHelper.get_or_create_plugin_draft(
        session, user_id, plugin_id)
    if model is None:
        raise HTTPException(404)
    return PluginConfigModel.model_validate(model)


@router.put("/{plugin_id}")
async def update_plugin(user_id: int, plugin: PluginUpdate, db: Session = Depends(get_db)):
    success = PluginHelper.update(db, user_id,  plugin)
    return success


@router.get("/configs/{config_id}", response_model=PluginConfigModel)
async def get_plugin_config(config_id, session: Session = Depends(get_db)):
    model = PluginConfigHelper.get(session, config_id)
    if model is None:
        raise HTTPException(404)
    return PluginConfigModel.model_validate(model)


@router.put("/configs/{config_id}")
async def update_plugin_config(user_id: int, config: PluginConfigUpdate, db: Session = Depends(get_db)):
    success = PluginConfigHelper.update(db, user_id, config)
    return success


@router.post("/configs", response_model=PluginConfigModel)
async def create_plugin_config(user_id: int, config: PluginConfigCreate, session: Session = Depends(get_db)):
    model = PluginConfigHelper.create(session, user_id, config)
    return PluginConfigModel.model_validate(model)


@router.get("/api/{api_id}", response_model=PluginApiModel)
async def get_plugin_api(api_id, session: Session = Depends(get_db)):
    model = PluginAPIHelper.get(session, api_id)
    if model is None:
        raise HTTPException(404)
    return PluginApiModel.model_validate(model)


@router.put("/api/{api_id}")
async def update_plugin_api(user_id: int, api: PluginApiUpdate, db: Session = Depends(get_db)):
    success = PluginAPIHelper.update(db, user_id, api)
    return success


@router.post("/api", response_model=PluginApiModel)
async def create_plugin_api(user_id: int, api: PluginApiCreate, session: Session = Depends(get_db)):
    model = PluginAPIHelper.create(session, user_id, api)
    return PluginApiModel.model_validate(model)
