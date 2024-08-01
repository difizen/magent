from typing import List
from fastapi import APIRouter, HTTPException
from agentuniverse_product.service.agent_service.agent_service import AgentService
from agentuniverse_product.service.model.agent_dto import AgentDTO

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
