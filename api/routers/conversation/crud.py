from typing import List
from datetime import datetime
from sqlalchemy.orm import Session
from models.agent_config import AgentConfigModel
from models.conversation import ConversationModel, ConversationORM, MessageModelCreate, MessageORM
from routers.agent.crud import AgentConfigHelper

from sqlalchemy import inspect


def getattr_from_column_name(instance, name, default=Ellipsis):
    for attr, column in inspect(instance.__class__).c.items():
        if column.name == name:
            return getattr(instance, attr)

    if default is Ellipsis:
        raise KeyError
    else:
        return default


class ConversationHelper:
    @staticmethod
    def get_conversation_bot_config(session: Session, operator: int, coversation_id: int) -> AgentConfigModel:
        conversation_orm = session.query(ConversationORM).filter(ConversationORM.id ==
                                                                 coversation_id).one_or_none()
        conversation_model = ConversationModel.model_validate(conversation_orm)
        config_id = conversation_model.bot_config_id
        return AgentConfigHelper.get(session, config_id)

    @staticmethod
    def get_or_create_bot_conversation(session: Session, operator: int, agent_config_id: int) -> ConversationORM:
        config = AgentConfigHelper.get(session, config_id=agent_config_id)
        if config is None:
            raise Exception('cannot get agent config')
        conversation = session.query(ConversationORM).filter(ConversationORM.bot_config_id ==
                                                             agent_config_id, ConversationORM.created_by == operator).one_or_none()
        if conversation is not None:
            return conversation
        else:
            config_model = AgentConfigModel.model_validate(config)
            return ConversationHelper.create(session, operator, config_model.bot_id, agent_config_id)

    @staticmethod
    def create(session: Session, operator: int, agent_bot_id: int, agent_config_id: int) -> ConversationORM:
        now = datetime.now()
        model = ConversationORM(**{
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
    def insert_message(session: Session, message: MessageModelCreate) -> ConversationORM:
        model = MessageORM(**{
            **message.model_dump(),
        })
        session.add(model)
        session.commit()
        session.refresh(model)
        return model

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
    def get_messages(session: Session, conversation_id: int) -> List[MessageORM]:
        list = session.query(MessageORM).filter(
            MessageORM.conversation_id == conversation_id,
            MessageORM.is_deleted == False).order_by(MessageORM.created_at.desc()).all()
        if list is None:
            return []
        return list
