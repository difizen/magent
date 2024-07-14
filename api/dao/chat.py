from typing import List
from datetime import datetime
from sqlalchemy.orm import Session
from models.agent_config import AgentConfigModel, AgentConfigORM
from models.chat import ChatModel, ChatORM, MessageModel, MessageModelCreate, MessageORM
from dao.agent import AgentConfigHelper

from sqlalchemy import inspect


def getattr_from_column_name(instance, name, default=Ellipsis):
    for attr, column in inspect(instance.__class__).c.items():
        if column.name == name:
            return getattr(instance, attr)

    if default is Ellipsis:
        raise KeyError
    else:
        return default


class ChatHelper:
    @staticmethod
    def get_chat(session: Session, chat_id: int) -> ChatORM:
        chat_orm = session.query(ChatORM).filter(
            ChatORM.id == chat_id).one_or_none()
        return chat_orm

    @staticmethod
    def get_chat_by_agent_config(session: Session, agent_config_id: int) -> ChatORM:
        chat_orm = session.query(ChatORM).filter(
            ChatORM.bot_config_id == agent_config_id).one_or_none()
        return chat_orm

    @staticmethod
    def get_or_create_bot_chat(session: Session, operator: int, agent_config_id: int) -> ChatORM:
        config = AgentConfigHelper.get(session, config_id=agent_config_id)
        if config is None:
            raise Exception('cannot get agent config')
        chat = session.query(ChatORM).filter(ChatORM.bot_config_id ==
                                             agent_config_id, ChatORM.created_by == operator).one_or_none()
        if chat is not None:
            return chat
        else:
            config_model = AgentConfigModel.model_validate(config)
            return ChatHelper.create(session, operator, config_model.bot_id, agent_config_id)

    @staticmethod
    def create(session: Session, operator: int, agent_bot_id: int, agent_config_id: int) -> ChatORM:
        now = datetime.now()
        model = ChatORM(**{
            "bot_id": agent_bot_id,
            "bot_config_id": agent_config_id,
            "created_by": operator,
            "created_at": now,
            "updated_at": now
        })
        session.add(model)
        session.commit()
        session.refresh(model)
        return model

    @staticmethod
    def insert_message(session: Session, message: MessageModelCreate) -> ChatORM:
        model = MessageORM(**{
            **message.model_dump(),
        })
        session.add(model)
        session.commit()
        session.refresh(model)
        return model

    @staticmethod
    def update_message_content(session: Session, message: MessageModel, content: str) -> int:
        flag = session.query(MessageORM).filter(
            MessageORM.id == message.id).update({"content": content})
        session.commit()
        return flag

    @staticmethod
    def delete_message(session: Session, message_id: int) -> int:
        flag = session.query(MessageORM).filter(
            MessageORM.id == message_id).update({"is_deleted": True})
        session.commit()
        return flag

    @staticmethod
    def get_message(session: Session, message_id: int) -> MessageORM | None:
        return session.query(MessageORM).filter(
            MessageORM.id == message_id).one_or_none()

    @staticmethod
    def get_messages(session: Session, chat_id: int) -> List[MessageORM]:
        list = session.query(MessageORM).filter(
            MessageORM.chat_id == chat_id,
            MessageORM.is_deleted == False).order_by(MessageORM.created_at).all()
        if list is None:
            return []
        return list

    @staticmethod
    def clear_messages(session: Session, chat_id: int) -> int:
        flag = session.query(MessageORM).filter(
            MessageORM.chat_id == chat_id).delete()
        session.commit()
        return flag
