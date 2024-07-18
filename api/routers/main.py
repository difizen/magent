from asyncio import sleep
import json
from typing import List
from fastapi import APIRouter
from sse_starlette import ServerSentEvent
from sse_starlette.sse import EventSourceResponse

from .agent.router import agent_router
from .account.router import account_router
from .chat.router import chat_router
from .plugin.router import plugin_router
from .knowledge.router import knowledge_router

api_router = APIRouter()

api_router.include_router(agent_router, prefix="/agent", tags=["agent"])
api_router.include_router(account_router, prefix="/accounts", tags=["account"])
api_router.include_router(chat_router, prefix="/chats", tags=["chat"])
api_router.include_router(plugin_router, prefix="/plugins", tags=["plugin"])
api_router.include_router(
    knowledge_router, prefix="/knowledge", tags=["knowledge"])

COUNTER = 0


def get_message():
    global COUNTER
    COUNTER += 1
    return COUNTER, COUNTER < 21


async def waypoints_generator():
    waypoints: List[ServerSentEvent] = [
        ServerSentEvent(id="1", event="update", data={"id": "1"}),
        ServerSentEvent(id="2", event="update", data="data2"),
        ServerSentEvent(id="3", event="update", data="data3"),
        ServerSentEvent(id="4", event="add", data="data4"),
    ]
    for waypoint in waypoints[0: 10]:
        # data = json.dumps(waypoint)
        # yield data
        yield waypoint
        # yield f"event: foo\n\rid: evt-1\n\rdata: {data}"
        await sleep(2)

MESSAGE_STREAM_RETRY_TIMEOUT = 1
MESSAGE_STREAM_DELAY = 1


@api_router.get("/get-waypoints")
async def root():
    return EventSourceResponse(waypoints_generator())
