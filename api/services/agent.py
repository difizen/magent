from typing import List
from sqlalchemy.orm import Session
from fastapi import Depends

from dao.agent import AgentBotHelper, AgentConfigHelper
from db import get_db
from models.agent_bot import AgentBotCreate, AgentBotModel, AgentBotUpdate
from models.agent_config import AgentConfigCreate, AgentConfigModel, AgentConfigUpdate


class AgentService:

    @staticmethod
    async def count_agent(session: Session) -> int:
        cnt = AgentBotHelper.count(session)
        return cnt

    @staticmethod
    def create(operator: int, bot_model: AgentBotCreate, session: Session) -> AgentBotModel:
        agent_orm = AgentBotHelper.create(session, operator, bot_model)
        return AgentBotModel.model_validate(agent_orm)

    @staticmethod
    def update(operator: int, bot_model: AgentBotUpdate, session: Session) -> int:
        res = AgentBotHelper.update(session, operator, bot_model)
        return res

    @staticmethod
    def get_by_id(bot_id: int, session: Session) -> AgentBotModel | None:
        agent_orm = AgentBotHelper.get(session, bot_id)
        if agent_orm is None:
            return None
        else:
            return AgentBotModel.model_validate(agent_orm)

    @staticmethod
    def get_all(session: Session) -> List[AgentBotModel]:
        agent_orms = AgentBotHelper.get_all(session)
        return [AgentBotModel.model_validate(agent_orm) for agent_orm in agent_orms]

    @staticmethod
    def get_by_user(user_id: int, session: Session) -> List[AgentBotModel]:
        agent_orms = AgentBotHelper.get_by_user(session, user_id)
        return [AgentBotModel.model_validate(agent_orm) for agent_orm in agent_orms]


class AgentConfigService:

    @staticmethod
    def get_by_id(config_id: int, session: Session) -> AgentConfigModel | None:
        agent_config_orm = AgentConfigHelper.get(session, config_id)
        if agent_config_orm is None:
            return None
        else:
            return AgentConfigModel.model_validate(agent_config_orm)

    @staticmethod
    def get_bot_draft(bot_id: int, session: Session) -> AgentConfigModel | None:
        agent_config_orm = AgentConfigHelper.get_bot_draft(session, bot_id)
        if agent_config_orm is None:
            return None
        else:
            return AgentConfigModel.model_validate(agent_config_orm)

    @staticmethod
    def get_or_create_bot_draft(operator: int, bot_id: int, session: Session) -> AgentConfigModel:
        exist = AgentConfigHelper.get_bot_draft(session, bot_id)
        if exist is None:
            return AgentConfigHelper.create(session, operator, AgentConfigCreate(bot_id=bot_id, is_draft=True, config=None))
        else:
            return exist

    @staticmethod
    def create(operator: int, config_model: AgentConfigCreate, session: Session) -> AgentConfigModel:
        agent_config_orm = AgentConfigHelper.create(
            session, operator, config_model)
        return AgentConfigModel.model_validate(agent_config_orm)

    @staticmethod
    def update(operator: int, bot_model: AgentConfigUpdate, session: Session) -> int:
        res = AgentConfigHelper.update(
            session, operator, bot_model)
        return res
