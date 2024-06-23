from .crud import ConversationHelper
from routers.agent.crud import AgentConfigHelper
from models.conversation import ConversationModel, MessageModel, MessageModelCreate, MessageSenderType
from models.agent_config import AgentConfigModel
from db import get_db
from core.chat import chat
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import logging

logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)


router = APIRouter()

conversation_router = router


@router.get("/{bot_id}/debug", response_model=ConversationModel)
def get_or_create_bot_conversation(bot_id, user_id: int, session: Session = Depends(get_db)):
    config_orm = AgentConfigHelper.get_bot_draft(session, bot_id)
    if config_orm is None:
        raise HTTPException(404)
    config = AgentConfigModel.model_validate(config_orm)
    model = ConversationHelper.get_or_create_bot_conversation(
        session, user_id, config.id)
    return ConversationModel.model_validate(model)


@router.post("/{conversation_id}/message", response_model=MessageModel)
async def add_message_to_conversation(conversation_id: int, user_id: int,  msg: MessageModelCreate, session: Session = Depends(get_db)):
    msg.sender_id = user_id
    msg.conversation_id = conversation_id
    msg_orm = ConversationHelper.insert_message(
        session, msg)
    msg_model = MessageModel.model_validate(msg_orm)

    config_orm = ConversationHelper.get_conversation_bot_config(
        session, user_id, conversation_id)
    config = AgentConfigModel.model_validate(config_orm)

    history_orms = ConversationHelper.get_messages(
        session, conversation_id=conversation_id)

    history = [MessageModel.model_validate(
        orm_obj) for orm_obj in history_orms]
    answer_msg = chat(config, conversation_id, history, msg_model)
    # msg_orm = ConversationHelper.insert_message(
    #     session, )
    return msg_model
