import enum
from typing import List
from fastapi import APIRouter
from agentuniverse_product.service.agent_service.agent_service import AgentService
from agentuniverse_product.service.model.agent_dto import AgentDTO
from pydantic import BaseModel

router = APIRouter()
agents_router = router


@router.get("/agents", response_model=List[AgentDTO])
async def get_agents():
    return AgentService.get_agent_list()


@router.get("/agents/{agent_id}", response_model=AgentDTO | None)
async def get_agent_detail(agent_id):
    return AgentService.get_agent_detail(agent_id)


@router.put("/agents/{agent_id}", response_model=AgentDTO | None)
async def update_agent(agent_id, agent):
    return AgentService.update_agent(agent)


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
