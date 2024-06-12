from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func
from models.agent import AgentBotORM, AgentConfigORM, AgentConfigStatus, AgentBotCreate


class AgentBotHelper:

    @staticmethod
    def count(session: Session) -> int:
        return session.query(func.count(AgentBotORM.id)).scalar()

    @staticmethod
    def get(session: Session, bot_id: int) -> AgentBotORM | None:
        return session.query(AgentBotORM).filter(AgentBotORM.id == bot_id).scalar()

    @staticmethod
    def create(session: Session, operator: int, bot_model: AgentBotCreate) -> AgentBotORM:
        now = datetime.now()
        model = AgentBotORM({
            **bot_model.model_dump(),
            "created_by": operator,
            "created_at": now,
            "updated_by": operator,
            "updated_at": now, })
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
        })
        session.add(model)
        session.commit()
        session.refresh(model)
        return model
