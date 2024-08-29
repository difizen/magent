import asyncio
import enum
import json
from typing import AsyncIterable, List
from fastapi import APIRouter
from agentuniverse_product.service.agent_service.agent_service import AgentService
from agentuniverse_product.service.workflow_service.workflow_service import WorkflowService
from agentuniverse_product.service.model.agent_dto import AgentDTO
from agentuniverse_product.service.model.workflow_dto import WorkflowDTO
from agentuniverse_product.service.model.planner_dto import PlannerDTO
from pydantic import BaseModel
from sse_starlette import EventSourceResponse, ServerSentEvent

router = APIRouter()
agents_router = router


@router.get("/agents", response_model=List[AgentDTO])
async def get_agents():
    return AgentService.get_agent_list()


@router.get("/agents/{agent_id}", response_model=AgentDTO | None)
async def get_agent_detail(agent_id):
    return AgentService.get_agent_detail(agent_id)


@router.put("/agents/{agent_id}", response_model=AgentDTO | None)
async def update_agent(agent_id, agent: AgentDTO):
    return AgentService.update_agent(agent)

@router.post("/agents", response_model=str)
async def create_agent(agent: AgentDTO):
    return AgentService.create_agent(agent)


@router.post("/agents/workflow", response_model=str)
async def create_workflow_agent(agent: AgentDTO):
    workflow_id = f"{agent.id}_workflow"
    workflow_name = f"{agent.nickname}_workflow"
    workflow = WorkflowDTO(id=workflow_id, name=workflow_name)
    workflow_id = WorkflowService.create_workflow(workflow)
    agent.planner = PlannerDTO(id='workflow_planner', workflow_id=workflow_id)
    return AgentService.create_agent(agent)

class MessageSenderType(enum.Enum):
    AI = "ai"
    HUMAN = "human"
    SYSTEM = "system"


class MessageCreate(BaseModel):
    session_id: str
    agent_id: str
    input: str


class MessageOutput(BaseModel):
    message_id: int
    session_id: str
    response_time: float
    output: str
    start_time: str
    end_time: str


@router.post("/agents/{agent_id}/chat", response_model=MessageOutput)
async def chat(agent_id, model: MessageCreate):
    output_dict = AgentService.chat(
        model.agent_id, model.session_id, model.input)
    print(output_dict)
    return MessageOutput.model_validate(output_dict)


class SSEType(enum.Enum):
    MESSAGE = "message"
    STEPS = "steps"
    BLANK_MESSAGE = "blank_message"
    CHUNK = "chunk"
    ERROR = "error"
    EOF = "EOF"
    RESULT = "result"


# class AgentStep(BaseModel):
#     input: str
#     output: str


# class AgentIntermediateSteps(BaseModel):
#     type: str
#     output: List[str | AgentStep] = []
#     agent_id: str


# class TokenUsage(BaseModel):
#     completion_tokens: int
#     prompt_tokens: int
#     total_tokens: int


# class InvocationSource(BaseModel):
#     source: str
#     type: str


# class AgentOutput(BaseModel):
#     message_id: int
#     session_id: str
#     response_time: float
#     output: str
#     start_time: str
#     end_time: str
#     type: str
#     agent_id: str
#     invocation_chain: List[InvocationSource] = []
#     token_usage: TokenUsage

async def iterator_to_async_iterable(sync_iter) -> AsyncIterable:
    for item in sync_iter:
        await asyncio.sleep(0)  # 允许其他异步任务运行
        yield item


async def send_message(model: MessageCreate) -> AsyncIterable[ServerSentEvent]:
    msg_iterator = iterator_to_async_iterable(AgentService.stream_chat(
        model.agent_id, model.session_id, model.input))
    async for msg_chunk in msg_iterator:
        type = msg_chunk.get("type", None)
        if type == "error":
            yield ServerSentEvent(event=SSEType.ERROR.value, id=model.session_id, data=json.dumps(msg_chunk, ensure_ascii=False))
        if type == "token":
            yield ServerSentEvent(event=SSEType.CHUNK.value, id=model.session_id, data=json.dumps(msg_chunk, ensure_ascii=False))
        if type == "intermediate_steps":
            yield ServerSentEvent(event=SSEType.STEPS.value, id=model.session_id, data=json.dumps(msg_chunk, ensure_ascii=False))
        if type == "final_result":
            yield ServerSentEvent(event=SSEType.RESULT.value, id=model.session_id, data=json.dumps(msg_chunk, ensure_ascii=False))


@router.post("/agents/{agent_id}/stream-chat")
async def stream_chat(agent_id, model: MessageCreate):
    return EventSourceResponse(send_message(model), media_type="text/event-stream")
