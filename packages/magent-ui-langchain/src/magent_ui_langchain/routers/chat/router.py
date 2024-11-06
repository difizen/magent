import asyncio
import enum
import json
from typing import AsyncIterable, List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sse_starlette import EventSourceResponse, ServerSentEvent

from magent_ui_langchain.core.current_executor import get_current_executor
from magent_ui_langchain.core.executor import StreamExecutor

router = APIRouter()
chat_router = router


class MessageSenderType(enum.Enum):
    AI = "ai"
    HUMAN = "human"
    SYSTEM = "system"


class MessageCreate(BaseModel):
    conversation_id: str
    input: str


class MessageOutput(BaseModel):
    message_id: int
    conversation_id: str
    response_time: float
    output: str
    start_time: str
    end_time: str


class SSEType(enum.Enum):
    MESSAGE = "message"
    STEPS = "steps"
    BLANK_MESSAGE = "blank_message"
    CHUNK = "chunk"
    ERROR = "error"
    EOF = "EOF"
    RESULT = "result"


async def send_message(model: MessageCreate) -> AsyncIterable[ServerSentEvent]:
    current = get_current_executor()
    if current is None:
        yield ServerSentEvent(event=SSEType.ERROR.value, id=model.conversation_id, data=json.dumps({"error_message": "error executor"}, ensure_ascii=False))
        return
    if isinstance(current, StreamExecutor):
        msg_iterator = current.invoke(model)
        if msg_iterator is None:
            yield ServerSentEvent(event=SSEType.ERROR.value, id=model.conversation_id, data=json.dumps({"error_message": "error stream invoke"}, ensure_ascii=False))
            return
        async for msg_chunk in msg_iterator:
            type = msg_chunk.get("type", None)
            # TODO: handle langchain info
            if type == "error":
                yield ServerSentEvent(event=SSEType.ERROR.value, id=model.conversation_id, data=json.dumps(msg_chunk, ensure_ascii=False))
            if type == "token":
                yield ServerSentEvent(event=SSEType.CHUNK.value, id=model.conversation_id, data=json.dumps(msg_chunk, ensure_ascii=False))
            if type == "intermediate_steps":
                yield ServerSentEvent(event=SSEType.STEPS.value, id=model.conversation_id, data=json.dumps(msg_chunk, ensure_ascii=False))
            if type == "final_result":
                yield ServerSentEvent(event=SSEType.RESULT.value, id=model.conversation_id, data=json.dumps(msg_chunk, ensure_ascii=False))
    else:
        msg_iterator = current.invoke(model)
        if msg_iterator is None:
            yield ServerSentEvent(event=SSEType.ERROR.value, id=model.conversation_id, data=json.dumps({"error_message": "error invoke"}, ensure_ascii=False))
            return
        else:
            # TODO: handle langchain info
            raise HTTPException(500)


@router.post("/chat-stream")
async def stream_chat(model: MessageCreate):
    return EventSourceResponse(send_message(model), media_type="text/event-stream")
