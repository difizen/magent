from typing import List
from fastapi import APIRouter, HTTPException
from agentuniverse_product.service.session_service.session_service import SessionService
from agentuniverse_product.service.model.session_dto import SessionDTO

router = APIRouter()
sessions_router = router


@router.get("/sessions", response_model=List[SessionDTO])
async def get_agents(agent_id: str):
    return SessionService.get_session_list(agent_id)


@router.get("/sessions/{session_id}", response_model=SessionDTO | None)
async def get_session_detail(session_id):
    return SessionService.get_session_detail(session_id)


@router.post("/sessions", response_model=SessionDTO)
async def create_session(agent_id):
    return SessionService.create_session(agent_id)


@router.delete("/sessions/{session_id}", response_model=str)
async def delete_session(session_id):
    return SessionService.delete_session(session_id)
