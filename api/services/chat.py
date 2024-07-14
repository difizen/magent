from typing import List
from sqlalchemy.orm import Session
from fastapi import Depends

from dao.agent import AgentConfigHelper
from dao.chat import ChatHelper
from db import get_db
from models.agent_config import AgentConfigModel
from models.chat import ChatModel, MessageModel, MessageModelCreate


class ChatService:

    @staticmethod
    def get_chat_bot_config(operator: int, chat_id: int, session: Session = Depends(get_db)) -> AgentConfigModel:
        chat_orm = ChatHelper.get_chat(session, chat_id)
        chat_model = ChatModel.model_validate(chat_orm)
        config_id = chat_model.bot_config_id
        agent_config_orm = AgentConfigHelper.get(session, config_id)
        return AgentConfigModel.model_validate(agent_config_orm)

    # @staticmethod
    # def get_bot_draft(bot_id: int, session: Session = Depends(get_db)) -> AgentConfigModel | None:
    #     agent_config_orm = AgentConfigHelper.get_bot_draft(session, bot_id)
    #     if agent_config_orm is None:
    #         return None
    #     else:
    #         return AgentConfigModel.model_validate(agent_config_orm)

    @staticmethod
    def get_or_create_bot_chat(operator: int, agent_config_id: int, session: Session = Depends(get_db)) -> ChatModel:
        chat_orm = ChatHelper.get_or_create_bot_chat(
            session, operator, agent_config_id)
        chat_model = ChatModel.model_validate(chat_orm)
        return chat_model

    @staticmethod
    def create(operator: int, agent_bot_id: int, agent_config_id: int, session: Session = Depends(get_db)) -> ChatModel:
        chat_orm = ChatHelper.create(
            session, operator, agent_bot_id, agent_config_id)
        return ChatModel.model_validate(chat_orm)

    @staticmethod
    def insert_message(message: MessageModelCreate, session: Session = Depends(get_db)) -> MessageModel:
        msg_orm = ChatHelper.insert_message(session, message)
        return MessageModel.model_validate(msg_orm)

    @staticmethod
    def update_message_content(message: MessageModel, content: str, session: Session = Depends(get_db)) -> int:
        flag = ChatHelper.update_message_content(session, message, content)
        return flag

    @staticmethod
    def delete_message(message_id: int, session: Session = Depends(get_db)) -> int:
        flag = ChatHelper.delete_message(session, message_id)
        return flag

    @staticmethod
    def get_message(message_id: int, session: Session = Depends(get_db)) -> MessageModel:
        msg_orm = ChatHelper.get_message(session, message_id)
        return MessageModel.model_validate(msg_orm)

    @staticmethod
    def get_messages(chat_id: int, session: Session = Depends(get_db)) -> List[MessageModel]:
        msg_orm_list = ChatHelper.get_messages(session, chat_id)
        return [MessageModel.model_validate(msg_orm) for msg_orm in msg_orm_list]

    @staticmethod
    def clear_messages(chat_id: int, session: Session = Depends(get_db)) -> int:
        flag = ChatHelper.clear_messages(session, chat_id)
        return flag
