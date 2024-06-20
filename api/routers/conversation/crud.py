from datetime import datetime
from sqlalchemy.orm import Session
from models.agent_config import AgentConfigModel
from models.conversation import ConversationORM, MessageModel, MessageModelCreate, MessageORM
from routers.agent.crud import AgentConfigHelper


class ConversationHelper:
    @staticmethod
    def get_bot_conversation(session: Session, operator: int, agent_config_id: int) -> ConversationORM:
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
        msg_orm = ConversationHelper.get_message(session, message_id)
        msg_model = MessageModel.model_validate(msg_orm)
        msg_model.is_deleted = True
        result = session.query(MessageORM).filter(MessageORM.id == message_id).update(MessageORM(**{
            ** msg_model.model_dump()
        }))
        session.commit()
        return result

    @staticmethod
    def get_message(session: Session, message_id: int) -> MessageORM | None:
        return session.query(MessageORM).filter(
            MessageORM.id == message_id).one_or_none()
