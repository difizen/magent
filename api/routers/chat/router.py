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
from core.base import ChatStreamChunk, SSEType
from services.agent import AgentConfigService
from services.chat import ChatService

from models.chat import (
    ChatModel, MessageModel, MessageModelCreate, MessageSenderType
)
from db import get_db
from core.langchain_utils import get_message_str, message_content_to_str
from core.chat import chat, chat_stream

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
    config = AgentConfigService.get_bot_draft(bot_id, session)
    if config is None:
        raise HTTPException(404)
    model = ChatService.get_or_create_bot_chat(user_id, config.id, session)
    return model


@router.delete("/{chat_id}/messages", response_model=int)
async def clear_messages_in_chat(chat_id: int,
                                 user_id: int,
                                 session: Session = Depends(get_db)):

    chat_id = chat_id
    sender_id = user_id
    config = ChatService.get_chat_bot_config(
        sender_id, chat_id, session)
    # TODO: delete or soft delete
    if config is not None:
        if config.is_draft:
            return ChatService.clear_messages(chat_id, session)
        else:
            return ChatService.clear_messages(chat_id, session)


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
    msg_model = ChatService.insert_message(msg, session)
    reply_msg = ChatReply(send=msg_model)
    config = ChatService.get_chat_bot_config(user_id, chat_id, session)
    history = ChatService.get_messages(chat_id, session)
    answer_msg = chat(config, chat_id, history, msg_model)
    if answer_msg is not None:
        new_msg = MessageModelCreate(sender_id=0,
                                     sender_type=MessageSenderType.AI,
                                     chat_turn_id=msg_model.chat_turn_id,
                                     chat_id=chat_id,
                                     content=get_message_str(answer_msg))
        new_msg_model = ChatService.insert_message(new_msg, session)
        reply_msg.reply = [new_msg_model]
    return reply_msg


class SSEChunk(BaseModel):
    message_id: int
    chunk: Optional[str] = None


async def send_message(session: Session, message: MessageModel) -> AsyncIterable[ServerSentEvent]:
    chat_id = message.chat_id
    sender_id = message.sender_id
    chat_turn_id = message.chat_turn_id

    # user send new message
    yield ServerSentEvent(event=SSEType.MESSAGE.value, id=str(message.chat_turn_id), data=message.model_dump_json())

    config = ChatService.get_chat_bot_config(sender_id, chat_id, session)
    history = ChatService.get_messages(chat_id, session)

    answer_msg = None
    msg_iterator = chat_stream(config, chat_id, history, message)
    if msg_iterator is None:
        raise HTTPException(500)
    content = ''
    async for msg_chunk in msg_iterator:
        if isinstance(msg_chunk, ChatStreamChunk):
            if answer_msg is None:
                if msg_chunk.type == SSEType.CHUNK and msg_chunk.chunk is not None:
                    chunk_content = msg_chunk.chunk
                    content = content+chunk_content
                    new_msg = MessageModelCreate(sender_id=0,
                                                 sender_type=MessageSenderType.AI,
                                                 chat_turn_id=chat_turn_id,
                                                 chat_id=chat_id,
                                                 content=chunk_content)
                    answer_msg = ChatService.insert_message(new_msg, session)
                    # ai send new message
                    answer_msg.complete = False
                    yield ServerSentEvent(event=SSEType.MESSAGE.value, id=str(answer_msg.chat_turn_id), data=answer_msg.model_dump_json())
            else:
                if msg_chunk.type == SSEType.CHUNK and msg_chunk.chunk is not None:
                    chunk_content = msg_chunk.chunk
                    content = content+chunk_content
                    new_chunk = SSEChunk(
                        message_id=answer_msg.id,
                        chunk=message_content_to_str(chunk_content)
                    )
                    yield ServerSentEvent(event=SSEType.CHUNK.value, id=str(answer_msg.chat_turn_id), data=new_chunk.model_dump_json())
        else:
            if answer_msg is None:
                chunk_content = message_content_to_str(msg_chunk.content)
                content = content+chunk_content
                new_msg = MessageModelCreate(sender_id=0,
                                             sender_type=MessageSenderType.AI,
                                             chat_turn_id=chat_turn_id,
                                             chat_id=chat_id,
                                             content=chunk_content)
                answer_msg = ChatService.insert_message(new_msg, session)
                # ai send new message
                answer_msg.complete = False
                yield ServerSentEvent(event=SSEType.MESSAGE.value, id=str(answer_msg.chat_turn_id), data=answer_msg.model_dump_json())
            else:
                chunk_content = message_content_to_str(msg_chunk.content)
                content = content+chunk_content
                new_chunk = SSEChunk(
                    message_id=answer_msg.id,
                    chunk=message_content_to_str(msg_chunk.content)
                )
                yield ServerSentEvent(event=SSEType.CHUNK.value, id=str(answer_msg.chat_turn_id), data=new_chunk.model_dump_json())
    if answer_msg is not None:
        ChatService.update_message_content(answer_msg, content, session)


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
    msg_model = ChatService.insert_message(msg, session)

    return EventSourceResponse(send_message(session, msg_model), media_type="text/event-stream")
