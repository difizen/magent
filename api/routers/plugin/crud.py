from datetime import datetime
from typing import Any
from sqlalchemy.orm import Session
from sqlalchemy import func
from models.plugin_config import PluginConfigCreate, PluginConfigORM, PluginConfigUpdate
from models.plugin import PluginCreate, PluginORM, PluginUpdate, PluginModel
from models.plugin_api import PluginApiCreate, PluginApiORM, PluginApiUpdate, PluginApiModel
from fastapi_pagination.ext.sqlalchemy import paginate
from fastapi_pagination import Page


class PluginHelper:

    @staticmethod
    def count(session: Session) -> int:
        return session.query(func.count(PluginORM.id)).scalar()

    @staticmethod
    def get(session: Session, plugin_id: int) -> PluginORM | None:
        return session.query(PluginORM).filter(PluginORM.id == plugin_id).one_or_none()

    @staticmethod
    def get_all(session: Session, user_id: int) -> Page[PluginModel]:
        return paginate(
            session.query(PluginORM)
            .filter(PluginORM.created_by == user_id)
            .order_by(PluginORM.updated_at.desc())
        )

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
    def get_all(session: Session, user_id: int) -> Page[PluginApiModel]:
        return paginate(
            session.query(PluginApiORM)
            .filter(PluginApiORM.created_by == user_id)
            .order_by(PluginApiORM.updated_at.desc())
        )

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
