'''
conversation router
'''
import logging
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from routers.agent.crud import AgentConfigHelper
from models.conversation import (
    ConversationModel, MessageModel, MessageModelCreate, MessageSenderType
)
from models.agent_config import AgentConfigModel
from db import get_db
from core.chat_executor.utils import get_message_str
from core.chat import chat

from .crud import ConversationHelper

logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)


router = APIRouter()

conversation_router = router


@router.get("/{bot_id}/debug", response_model=ConversationModel)
def get_or_create_bot_conversation(bot_id, user_id: int, session: Session = Depends(get_db)):
    '''
    get or create conversation
    '''
    config_orm = AgentConfigHelper.get_bot_draft(session, bot_id)
    if config_orm is None:
        raise HTTPException(404)
    config = AgentConfigModel.model_validate(config_orm)
    model = ConversationHelper.get_or_create_bot_conversation(
        session, user_id, config.id)
    return ConversationModel.model_validate(model)


@router.post("/{conversation_id}/message", response_model=MessageModel)
async def add_message_to_conversation(conversation_id: int,
                                      user_id: int,
                                      msg: MessageModelCreate,
                                      session: Session = Depends(get_db)):
    '''
    post new message by user
    '''
    msg.sender_id = user_id
    msg.conversation_id = conversation_id
    msg_orm = ConversationHelper.insert_message(
        session, msg)
    msg_model = MessageModel.model_validate(msg_orm)

    config_orm = ConversationHelper.get_conversation_bot_config(
        session, user_id, conversation_id)
    config = AgentConfigModel.model_validate(config_orm)

    history_orm_list = ConversationHelper.get_messages(
        session, conversation_id=conversation_id)

    history = [MessageModel.model_validate(
        orm_obj) for orm_obj in history_orm_list]
    answer_msg = chat(config, conversation_id, history, msg_model)
    if answer_msg is not None:
        new_msg = MessageModelCreate(sender_id=0,
                                     sender_type=MessageSenderType.AI,
                                     conversation_id=conversation_id,
                                     content=get_message_str(answer_msg))
        new_msg_orm = ConversationHelper.insert_message(
            session, new_msg)
        new_msg_model = MessageModel.model_validate(new_msg_orm)
        return new_msg_model
    return None
