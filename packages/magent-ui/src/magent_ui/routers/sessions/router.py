from typing import List
from fastapi import APIRouter
from agentuniverse_product.service.session_service.session_service import SessionService
from agentuniverse_product.service.model.session_dto import SessionDTO
from pydantic import BaseModel
from magent_ui.utils import AsyncTask

router = APIRouter()
sessions_router = router


@router.get("/sessions", response_model=List[SessionDTO])
async def get_agents(agent_id: str):
    return await AsyncTask.to_thread(SessionService.get_session_list, agent_id)


@router.get("/sessions/{session_id}", response_model=SessionDTO | None)
async def get_session_detail(session_id):
    return await AsyncTask.to_thread(SessionService.get_session_detail, session_id)


class SessionCreate(BaseModel):
    agent_id: str


@router.post("/sessions", response_model=SessionDTO)
async def create_session(model: SessionCreate):
    session_id = SessionService.create_session(model.agent_id)
    return await AsyncTask.to_thread(SessionService.get_session_detail, session_id)


@router.delete("/sessions/{session_id}", response_model=str)
async def delete_session(session_id):
    return await AsyncTask.to_thread(SessionService.delete_session, session_id)
