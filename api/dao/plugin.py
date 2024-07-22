from datetime import datetime
from typing import Any, List
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from models.plugin_config import PluginConfigCreate, PluginConfigORM, PluginConfigUpdate
from models.plugin import PluginCreate, PluginORM, PluginUpdate
from models.plugin_api import PluginApiCreate, PluginApiORM, PluginApiUpdate
from constants.constant import defaultPluginOpenapiDesc


class PluginHelper:

    @staticmethod
    def count(session: Session) -> int:
        return session.query(func.count(PluginORM.id)).scalar()

    @staticmethod
    def get(session: Session, plugin_id: int) -> PluginORM | None:
        return session.query(PluginORM).filter(PluginORM.id == plugin_id).one_or_none()

    @staticmethod
    def get_user_plugin(session: Session, user_id: int) -> List[PluginORM]:
        return session.query(PluginORM).filter(PluginORM.created_by == user_id).order_by(PluginORM.updated_at.desc()).all()

    @staticmethod
    def get_all_plugin(session: Session) -> List[PluginORM]:
        return session.query(PluginORM).order_by(PluginORM.updated_at.desc()).all()

    @staticmethod
    def update(session: Session, operator: int, plugin_model: PluginUpdate) -> int:
        plugin_id = plugin_model.id
        now = datetime.now()
        update_model: Any = {
            **plugin_model.model_dump(),
            "updated_by": operator,
            "updated_at": now,
        }
        result = session.query(PluginORM).filter(
            PluginORM.id == plugin_id).update(update_model)
        session.commit()
        return result

    @staticmethod
    def create(session: Session, operator: int, plugin_model: PluginCreate) -> PluginORM:
        now = datetime.now()
        model = PluginORM(**{
            **plugin_model.model_dump(),
            "created_by": operator,
            "created_at": now,
            "updated_by": operator,
            "updated_at": now
        })
        session.add(model)
        session.commit()
        session.refresh(model)
        return model


class PluginConfigHelper:
    @staticmethod
    def get(session: Session, config_id: int) -> PluginConfigORM | None:
        return session.query(PluginConfigORM).filter(PluginConfigORM.id == config_id).one_or_none()

    @staticmethod
    def get_plugin_draft(session: Session, plugin_id: int) -> PluginConfigORM | None:
        return session.query(PluginConfigORM).filter(
            PluginConfigORM.plugin_id == plugin_id,
            PluginConfigORM.is_draft == True
        ).one_or_none()

    @staticmethod
    def get_latest_publish_config(session: Session, plugin_id: int) -> PluginConfigORM | None:
        return session.query(PluginConfigORM).filter(
            PluginConfigORM.plugin_id == plugin_id,
            PluginConfigORM.is_draft == False
        ).order_by(desc(PluginConfigORM.updated_at)).first()

    @staticmethod
    def get_or_create_plugin_draft(session: Session, operator: int, plugin_id: int,) -> PluginConfigORM:
        exist = PluginConfigHelper.get_plugin_draft(session, plugin_id)
        if exist is None:
            return PluginConfigHelper.create(session, operator, PluginConfigCreate(plugin_id=plugin_id, plugin_openapi_desc=defaultPluginOpenapiDesc, is_draft=True))
        else:
            return exist

    @staticmethod
    def create(session: Session, operator: int, config_model: PluginConfigCreate) -> PluginConfigORM:
        now = datetime.now()
        dict = {
            "is_draft": False,
            **config_model.model_dump(),
            "created_by": operator,
            "created_at": now,
            "updated_by": operator,
            "updated_at": now,
        }
        model = PluginConfigORM(**dict)
        session.add(model)
        session.commit()
        session.refresh(model)
        return model

    @staticmethod
    def update(session: Session, operator: int, config_model: PluginConfigUpdate) -> int:
        config_id = config_model.id
        now = datetime.now()
        update_model: dict[Any, Any] = {
            **config_model.model_dump(),
            "updated_by": operator,
            "updated_at": now,
        }
        update_model.pop('id')
        result = session.query(PluginConfigORM).filter(
            PluginConfigORM.id == config_id).update(update_model)
        session.commit()
        return result


class PluginAPIHelper:

    @staticmethod
    def count(session: Session) -> int:
        return session.query(func.count(PluginApiORM.id)).scalar()

    @staticmethod
    def get(session: Session, plugin_api_id: int) -> PluginApiORM | None:
        return session.query(PluginApiORM).filter(PluginApiORM.id == plugin_api_id).one_or_none()

    @staticmethod
    def get_by_config_id(session: Session, plugin_config_id: int) -> List[PluginApiORM]:
        return session.query(PluginApiORM).filter(PluginApiORM.plugin_config_id == plugin_config_id).all()

    @staticmethod
    def get_user_all(session: Session, user_id: int) -> List[PluginApiORM]:
        return session.query(PluginApiORM).filter(PluginApiORM.created_by == user_id).order_by(PluginApiORM.updated_at.desc()).all()

    @staticmethod
    def get_all(session: Session) -> List[PluginApiORM]:
        return session.query(PluginApiORM).order_by(PluginApiORM.updated_at.desc()).all()

    @staticmethod
    def update(session: Session, operator: int, plugin_api_model: PluginApiUpdate) -> int:
        plugin_api_id = plugin_api_model.id
        now = datetime.now()
        update_model: Any = {
            **plugin_api_model.model_dump(),
            "updated_by": operator,
            "updated_at": now,
        }
        result = session.query(PluginApiORM).filter(
            PluginApiORM.id == plugin_api_id).update(update_model)
        session.commit()
        return result

    @staticmethod
    def create(session: Session, operator: int, plugin_api_model: PluginApiCreate) -> PluginApiORM:
        now = datetime.now()
        model = PluginApiORM(**{
            **plugin_api_model.model_dump(),
            "created_by": operator,
            "created_at": now,
            "updated_by": operator,
            "updated_at": now
        })
        session.add(model)
        session.commit()
        session.refresh(model)
        return model
