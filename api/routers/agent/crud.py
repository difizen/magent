from datetime import datetime
from typing import Any
from sqlalchemy.orm import Session
from sqlalchemy import func
from models.agent import AgentBotORM, AgentConfigORM, AgentConfigStatus, AgentBotCreate, AgentBotUpdate, AgentConfigUpdate
from fastapi_pagination.ext.sqlalchemy import paginate
from fastapi_pagination import Page


class AgentBotHelper:

    @staticmethod
    def count(session: Session) -> int:
        return session.query(func.count(AgentBotORM.id)).scalar()

    @staticmethod
    def get(session: Session, bot_id: int) -> AgentBotORM | None:
        return session.query(AgentBotORM).filter(AgentBotORM.id == bot_id).one_or_none()

    @staticmethod
    def get_all(session: Session, user_id: int) -> Page[AgentBotORM]:
        return paginate(
            session.query(AgentBotORM)
            .filter(AgentBotORM.created_by == user_id)
            .order_by(AgentBotORM.updated_at.desc())
        )

    @staticmethod
    def update(session: Session, operator: int, bot_model: AgentBotUpdate) -> int:
        bot_id = bot_model.id
        now = datetime.now()
        update_model: Any = {
            **bot_model.model_dump(),
            "updated_by": operator,
            "updated_at": now,
        }
        result = session.query(AgentBotORM).filter(
            AgentBotORM.id == bot_id).update(update_model)
        session.commit()
        return result

    @staticmethod
    def create(session: Session, operator: int, bot_model: AgentBotCreate) -> AgentBotORM:
        now = datetime.now()
        model = AgentBotORM(**{
            **bot_model.model_dump(),
            "created_by": operator,
            "created_at": now,
            "updated_by": operator,
            "updated_at": now
        })
        session.add(model)
        session.commit()
        session.refresh(model)
        return model


class AgentConfigHelper:
    @staticmethod
    def get(session: Session, config_id: int) -> AgentConfigORM:
        return session.query(AgentConfigORM).filter(AgentConfigORM.id == config_id).scalar()

    @staticmethod
    def create(session: Session, operator: int) -> AgentConfigORM:
        now = datetime.now()
        model = AgentConfigORM(**{
            "status": AgentConfigStatus.DRAFT,
            "created_by": operator,
            "created_at": now,
            "updated_by": operator,
            "updated_at": now,
            "config": {}
        })
        session.add(model)
        session.commit()
        session.refresh(model)
        return model

    @staticmethod
    def update(session: Session, operator: int, config_model: AgentConfigUpdate) -> int:
        bot_id = config_model.id
        now = datetime.now()
        update_model: dict[Any, Any] = {
            **config_model.model_dump(),
            "updated_by": operator,
            "updated_at": now,
        }
        update_model.pop('id')
        result = session.query(AgentConfigORM).filter(
            AgentConfigORM.id == bot_id).update(update_model)
        session.commit()
        return result
