'''
chat router
'''
import enum
import logging
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, AsyncIterable, Optional
from sse_starlette import ServerSentEvent
from sse_starlette.sse import EventSourceResponse

from routers.agent.crud import AgentConfigHelper
from models.chat import (
    ChatModel, MessageModel, MessageModelCreate, MessageSenderType
)
from models.agent_config import AgentConfigModel
from db import get_db
from core.langchain_utils import get_message_str, message_content_to_str
from core.chat import chat, chat_stream

from .crud import ChatHelper

logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)


router = APIRouter()

chat_router = router


@router.get("/with_bot/{bot_id}", response_model=ChatModel)
def chat_with_bot_in_online_mode(bot_id, user_id: int, session: Session = Depends(get_db)):
    # TODO: missing implementation
    raise HTTPException(500)


@router.get("/with_bot/{bot_id}/debug", response_model=ChatModel)
def chat_with_bot_in_debug_mode(bot_id, user_id: int, session: Session = Depends(get_db)):
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


@router.delete("/{chat_id}/messages", response_model=int)
async def clear_messages_in_chat(chat_id: int,
                                 user_id: int,
                                 session: Session = Depends(get_db)):

    chat_id = chat_id
    sender_id = user_id
    config_orm = ChatHelper.get_chat_bot_config(
        session, sender_id, chat_id)
    config = AgentConfigModel.model_validate(config_orm)
    # TODO: delete or soft delete
    if config.is_draft:
        return ChatHelper.clear_messages(session, chat_id)
    else:
        return ChatHelper.clear_messages(session, chat_id)


class ChatReply(BaseModel):
    send: MessageModel
    reply: List[MessageModel] = []


@router.post("/{chat_id}/messages/compress", response_model=ChatReply)
async def send_message_in_chat(chat_id: int,
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

    reply_msg = ChatReply(send=msg_model)

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
                                     chat_turn_id=msg_model.chat_turn_id,
                                     chat_id=chat_id,
                                     content=get_message_str(answer_msg))
        new_msg_orm = ChatHelper.insert_message(
            session, new_msg)
        new_msg_model = MessageModel.model_validate(new_msg_orm)
        reply_msg.reply = [new_msg_model]
    return reply_msg


class ChatSteamChunk(BaseModel):
    message_id: int
    chunk: Optional[str] = None


class SSEType(enum.Enum):
    MESSAGE = "message"
    BLANK_MESSAGE = "blank_message"
    CHUNK = "chunk"


async def send_message(session: Session, message: MessageModel) -> AsyncIterable[ServerSentEvent]:
    chat_id = message.chat_id
    sender_id = message.sender_id
    chat_turn_id = message.chat_turn_id

    # user send new message
    yield ServerSentEvent(event=SSEType.MESSAGE.value, id=str(message.chat_turn_id), data=message.model_dump_json())

    config_orm = ChatHelper.get_chat_bot_config(
        session, sender_id, chat_id)
    config = AgentConfigModel.model_validate(config_orm)
    history_orm_list = ChatHelper.get_messages(
        session, chat_id=chat_id)
    history = [MessageModel.model_validate(
        orm_obj) for orm_obj in history_orm_list]

    answer_msg = None
    msg_iterator = chat_stream(config, chat_id, history, message)
    if msg_iterator is None:
        raise HTTPException(500)
    content = ''
    async for msg_chunk in msg_iterator:
        if answer_msg is None:
            chunk_content = message_content_to_str(msg_chunk.content)
            content = content+chunk_content
            new_msg = MessageModelCreate(sender_id=0,
                                         sender_type=MessageSenderType.AI,
                                         chat_turn_id=chat_turn_id,
                                         chat_id=chat_id,
                                         content=chunk_content)
            new_msg_orm = ChatHelper.insert_message(
                session, new_msg)
            answer_msg = MessageModel.model_validate(new_msg_orm)
            # ai send new message
            answer_msg.complete = False
            yield ServerSentEvent(event=SSEType.MESSAGE.value, id=str(answer_msg.chat_turn_id), data=answer_msg.model_dump_json())
        else:
            chunk_content = message_content_to_str(msg_chunk.content)
            content = content+chunk_content
            new_chunk = ChatSteamChunk(
                message_id=answer_msg.id,
                chunk=message_content_to_str(msg_chunk.content)
            )
            yield ServerSentEvent(event=SSEType.CHUNK.value, id=str(answer_msg.chat_turn_id), data=new_chunk.model_dump_json())
    if answer_msg is not None:
        ChatHelper.update_message_content(session, answer_msg, content)


@router.post("/{chat_id}/messages")
async def send_message_stream_in_chat(chat_id: int,
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

    return EventSourceResponse(send_message(session, msg_model), media_type="text/event-stream")
