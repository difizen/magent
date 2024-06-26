'''
chat router
'''
import logging
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from routers.agent.crud import AgentConfigHelper
from models.chat import (
    ChatModel, MessageModel, MessageModelCreate, MessageSenderType
)
from models.agent_config import AgentConfigModel
from db import get_db
from core.chat_executor.utils import get_message_str
from core.chat import chat

from .crud import ChatHelper

logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)


router = APIRouter()

chat_router = router


@router.get("/with_bot/{bot_id}/debug", response_model=ChatModel)
def get_or_create_bot_chat(bot_id, user_id: int, session: Session = Depends(get_db)):
    '''
    get or create chat
    '''
    config_orm = AgentConfigHelper.get_bot_draft(session, bot_id)
    if config_orm is None:
        raise HTTPException(404)
    config = AgentConfigModel.model_validate(config_orm)
    model = ChatHelper.get_or_create_bot_chat(
        session, user_id, config.id)
    return ChatModel.model_validate(model)


@router.post("/{chat_id}/messages", response_model=MessageModel)
async def add_message_to_chat(chat_id: int,
                              user_id: int,
                              msg: MessageModelCreate,
                              session: Session = Depends(get_db)):
    '''
    post new message by user
    '''
    msg.sender_id = user_id
    msg.chat_id = chat_id
    msg_orm = ChatHelper.insert_message(
        session, msg)
    msg_model = MessageModel.model_validate(msg_orm)

    config_orm = ChatHelper.get_chat_bot_config(
        session, user_id, chat_id)
    config = AgentConfigModel.model_validate(config_orm)

    history_orm_list = ChatHelper.get_messages(
        session, chat_id=chat_id)

    history = [MessageModel.model_validate(
        orm_obj) for orm_obj in history_orm_list]
    answer_msg = chat(config, chat_id, history, msg_model)
    if answer_msg is not None:
        new_msg = MessageModelCreate(sender_id=0,
                                     sender_type=MessageSenderType.AI,
                                     chat_id=chat_id,
                                     content=get_message_str(answer_msg))
        new_msg_orm = ChatHelper.insert_message(
            session, new_msg)
        new_msg_model = MessageModel.model_validate(new_msg_orm)
        return new_msg_model
    return None
