import enum
import json
from typing import AsyncIterable
from fastapi import APIRouter
from pydantic import BaseModel
from sse_starlette import EventSourceResponse, ServerSentEvent
from magent_ui_langchain.core.current_executor import get_current_invoke_adaptor
from magent_ui_langchain.core.base_adaptor import StreamInvokeAdaptor

from typing import Optional

router = APIRouter()
chat_router = router


class MessageSenderType(enum.Enum):
    AI = "ai"
    HUMAN = "human"
    SYSTEM = "system"


class MessageCreate(BaseModel):
    conversation_id: str
    input: str
    image: Optional[str] = None


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
    current = get_current_invoke_adaptor()
    if current is None:
        yield ServerSentEvent(event=SSEType.ERROR.value, id=model.conversation_id, data=json.dumps({"error_message": "error executor"}, ensure_ascii=False))
        return
    if isinstance(current, StreamInvokeAdaptor) and stream:
        msg_iterator = current.invoke_stream(
            model.input, image=getattr(model, 'image', None))
        if msg_iterator is None:
            yield ServerSentEvent(event=SSEType.ERROR.value, id=model.conversation_id, data=json.dumps({"error_message": "error stream invoke_stream"}, ensure_ascii=False))
            return
        try:
            async for event in msg_iterator:
                data = ''
                if isinstance(event.data, str):
                    data = event.data
                else:
                    data = event.data.model_dump_json()
                yield ServerSentEvent(event=event.type, id=event.id, data=data)
        except Exception as e:
            print('Exception', e)
            yield ServerSentEvent(event=SSEType.ERROR.value, id=model.conversation_id, data=json.dumps({"error_message": "error in stream execute"}, ensure_ascii=False))
            raise e


@router.post("/chat-stream")
async def stream_chat(model: MessageCreate):
    return EventSourceResponse(send_message(model, stream=True), media_type="text/event-stream")


@router.post("/chat")
async def chat(model: MessageCreate):
    current = get_current_invoke_adaptor()
    if current is None:
        return {"error_message": "error executor"}

    try:
        result = current.invoke(
            model.input, image=getattr(model, 'image', None))
        content = result.content
        if isinstance(msg_chunk.content, list):
            content = msg_chunk.content[0]['text']
        output_dict = {'id': result.id, 'output': content,
                       'response_metadata': result.response_metadata}
        return output_dict
    except Exception as e:
        return {"error_message": "chat execute error"}
