import asyncio
import enum
import json
from typing import AsyncIterable, List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sse_starlette import EventSourceResponse, ServerSentEvent

from langchain_core.messages.ai import AIMessageChunk

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

async def async_generator_from_sync(gen):
    for item in gen:
        yield item

async def send_message(model: MessageCreate, stream: bool) -> AsyncIterable[ServerSentEvent]:
    current = get_current_executor()
    if current is None:
        yield ServerSentEvent(event=SSEType.ERROR.value, id=model.conversation_id, data=json.dumps({"error_message": "error executor"}, ensure_ascii=False))
        return
    if isinstance(current, StreamExecutor) and stream:
        msg_iterator = async_generator_from_sync(current.invoke_stream(model.input))
        if msg_iterator is None:
            yield ServerSentEvent(event=SSEType.ERROR.value, id=model.conversation_id, data=json.dumps({"error_message": "error stream invoke_stream"}, ensure_ascii=False))
            return
        try:
          async for msg_chunk in msg_iterator:
              if isinstance(msg_chunk, AIMessageChunk):
                if hasattr(msg_chunk, 'response_metadata') and len(msg_chunk.response_metadata) > 0: # 最后一次返回
                  yield ServerSentEvent(event=SSEType.RESULT.value, id=model.conversation_id, data=json.dumps({"output": msg_chunk.content, "id": msg_chunk.id, "response_metadata": msg_chunk.response_metadata}, ensure_ascii=False))
                else:
                  yield ServerSentEvent(event=SSEType.CHUNK.value, id=model.conversation_id, data=json.dumps({"output": msg_chunk.content, "id": msg_chunk.id}, ensure_ascii=False))
        except Exception as e:
          yield ServerSentEvent(event=SSEType.ERROR.value, id=model.conversation_id, data=json.dumps({"error_message": "error in stream execute"}, ensure_ascii=False))
          return

@router.post("/chat-stream")
async def stream_chat(model: MessageCreate):
    return EventSourceResponse(send_message(model, stream=True), media_type="text/event-stream")

@router.post("/chat")
async def chat(model: MessageCreate):
    current = get_current_executor()
    if current is None:
        return {"error_message": "error executor"}

    try:
      result = current.invoke(model.input)
      output_dict = { 'id': result.id, 'output': result.content, 'response_metadata': result.response_metadata}
      return output_dict
    except Exception as e:
      return {"error_message": "chat execute error"}


