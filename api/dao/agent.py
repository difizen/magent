from datetime import datetime
from typing import Any, List
from sqlalchemy.orm import Session
from sqlalchemy import func
from models.agent_bot import AgentBotORM, AgentBotCreate, AgentBotUpdate
from models.agent_config import AgentConfigCreate, AgentConfigORM, AgentConfigUpdate


class AgentBotHelper:

    @staticmethod
    def count(session: Session) -> int:
        return session.query(func.count(AgentBotORM.id)).scalar()

    @staticmethod
    def get(session: Session, bot_id: int) -> AgentBotORM | None:
        return session.query(AgentBotORM).filter(AgentBotORM.id == bot_id).one_or_none()

    @staticmethod
    def get_all(session: Session) -> List[AgentBotORM]:
        return session.query(AgentBotORM).order_by(AgentBotORM.updated_at.desc()).all()

    @staticmethod
    def get_by_user(session: Session, user_id: int) -> List[AgentBotORM]:
        return session.query(AgentBotORM).filter(AgentBotORM.created_by == user_id).order_by(AgentBotORM.updated_at.desc()).all()
        # return paginate(
        #     session.query(AgentBotORM)
        #     .filter(AgentBotORM.created_by == user_id)
        #     .order_by(AgentBotORM.updated_at.desc())
        # )

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
    def get(session: Session, config_id: int) -> AgentConfigORM | None:
        return session.query(AgentConfigORM).filter(AgentConfigORM.id == config_id).one_or_none()

    @staticmethod
    def get_bot_draft(session: Session, bot_id: int) -> AgentConfigORM | None:
        return session.query(AgentConfigORM).filter(
            AgentConfigORM.bot_id == bot_id,
            AgentConfigORM.is_draft == True
        ).one_or_none()

    @staticmethod
    def get_or_create_bot_draft(session: Session, operator: int, bot_id: int) -> AgentConfigORM:
        exist = AgentConfigHelper.get_bot_draft(session, bot_id)
        if exist is None:
            return AgentConfigHelper.create(session, operator, AgentConfigCreate(bot_id=bot_id, is_draft=True, config=None))
        else:
            return exist

    @staticmethod
    def create(session: Session, operator: int, config_model: AgentConfigCreate) -> AgentConfigORM:
        now = datetime.now()
        dict = {
            "is_draft": False,
            "config": {},
            **config_model.model_dump(),
            "created_by": operator,
            "created_at": now,
            "updated_by": operator,
            "updated_at": now,
        }
        model = AgentConfigORM(**dict)
        session.add(model)
        session.commit()
        session.refresh(model)
        return model

    @staticmethod
    def update(session: Session, operator: int, config_model: AgentConfigUpdate) -> int:
        config_id = config_model.id
        now = datetime.now()
        update_model: dict[Any, Any] = {
            **config_model.model_dump(),
            "updated_by": operator,
            "updated_at": now,
        }
        update_model.pop('id')
        result = session.query(AgentConfigORM).filter(
            AgentConfigORM.id == config_id).update(update_model)
        session.commit()
        return result
