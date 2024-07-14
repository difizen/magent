from typing import List
from sqlalchemy.orm import Session
from fastapi import Depends

from dao.plugin import PluginAPIHelper, PluginConfigHelper, PluginHelper
from db import get_db
from models.plugin import PluginCreate, PluginModel, PluginUpdate
from models.plugin_api import PluginApiCreate, PluginApiModel, PluginApiUpdate
from models.plugin_config import PluginConfigCreate, PluginConfigModel, PluginConfigUpdate


class PluginService:

    @staticmethod
    async def count(session: Session = Depends(get_db)) -> int:
        cnt = PluginHelper.count(session)
        return cnt

    @staticmethod
    def create(operator: int, plugin_model: PluginCreate, session: Session = Depends(get_db)) -> PluginModel:
        plugin_orm = PluginHelper.create(session, operator, plugin_model)
        return PluginModel.model_validate(plugin_orm)

    @staticmethod
    def update(operator: int, plugin_model: PluginUpdate, session: Session = Depends(get_db)) -> int:
        res = PluginHelper.update(session, operator, plugin_model)
        return res

    @staticmethod
    def get_by_id(plugin_id: int, session: Session = Depends(get_db)) -> PluginModel | None:
        plugin_orm = PluginHelper.get(session, plugin_id)
        if plugin_orm is None:
            return None
        else:
            return PluginModel.model_validate(plugin_orm)

    @staticmethod
    def get_all(session: Session = Depends(get_db)) -> List[PluginModel]:
        plugin_orms = PluginHelper.get_all_plugin(session)
        return [PluginModel.model_validate(plugin_orm) for plugin_orm in plugin_orms]

    @staticmethod
    def get_user_plugin(user_id: int, session: Session = Depends(get_db)) -> List[PluginModel]:
        plugin_orms = PluginHelper.get_user_plugin(session, user_id)
        return [PluginModel.model_validate(plugin_orm) for plugin_orm in plugin_orms]


class PluginConfigService:

    @staticmethod
    def get_by_id(config_id: int, session: Session = Depends(get_db)) -> PluginConfigModel | None:
        plugin_config_orm = PluginConfigHelper.get(session, config_id)
        if plugin_config_orm is None:
            return None
        else:
            return PluginConfigModel.model_validate(plugin_config_orm)

    @staticmethod
    def get_plugin_draft(plugin_id: int, session: Session = Depends(get_db)) -> PluginConfigModel | None:
        plugin_config_orm = PluginConfigHelper.get_plugin_draft(
            session, plugin_id)
        if plugin_config_orm is None:
            return None
        else:
            return PluginConfigModel.model_validate(plugin_config_orm)

    @staticmethod
    def get_or_create_plugin_draft(operator: int, plugin_id: int, session: Session = Depends(get_db)) -> PluginConfigModel:
        exist = PluginConfigHelper.get_or_create_plugin_draft(
            session, operator, plugin_id)
        return exist

    @staticmethod
    def create(operator: int, config_model: PluginConfigCreate, session: Session = Depends(get_db)) -> PluginConfigModel:
        plugin_config_orm = PluginConfigHelper.create(
            session, operator, config_model)
        return PluginConfigModel.model_validate(plugin_config_orm)

    @staticmethod
    def update(operator: int, config_model: PluginConfigUpdate, session: Session = Depends(get_db)) -> int:
        res = PluginConfigHelper.update(
            session, operator, config_model)
        return res


class PluginAPIService:
    @staticmethod
    async def count(session: Session = Depends(get_db)) -> int:
        cnt = PluginAPIHelper.count(session)
        return cnt

    @staticmethod
    def get_by_id(plugin_api_id: int, session: Session = Depends(get_db)) -> PluginApiModel | None:
        plugin_api_orm = PluginAPIHelper.get(session, plugin_api_id)
        if plugin_api_orm is None:
            return None
        else:
            return PluginApiModel.model_validate(plugin_api_orm)

    @staticmethod
    def get_all(session: Session = Depends(get_db)) -> List[PluginApiModel]:
        plugin_api_orms = PluginAPIHelper.get_all(session)
        return [PluginApiModel.model_validate(plugin_api_orm) for plugin_api_orm in plugin_api_orms]

    @staticmethod
    def update(operator: int, plugin_api_model: PluginApiUpdate, session: Session = Depends(get_db)) -> int:
        res = PluginAPIHelper.update(
            session, operator, plugin_api_model)
        return res

    @staticmethod
    def create(operator: int, plugin_api_model: PluginApiCreate, session: Session = Depends(get_db)) -> PluginApiModel:
        plugin_api_orm = PluginAPIHelper.create(
            session, operator, plugin_api_model)
        return PluginApiModel.model_validate(plugin_api_orm)
