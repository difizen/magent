from fastapi import APIRouter, HTTPException, Depends

from fastapi_pagination import Page, paginate

from db import get_db
from models.agent_bot import AgentBotModel, AgentBotCreate, AgentBotUpdate
from models.agent_config import AgentConfigModel, AgentConfigUpdate, AgentConfigCreate

from services.agent import AgentConfigService, AgentService
from sqlalchemy.orm import Session

router = APIRouter()

agent_router = router


@router.post("/bots", response_model=AgentBotModel)
def create_agent_bot(user_id: int, bot: AgentBotCreate, session: Session = Depends(get_db)):
    model = AgentService.create(user_id, bot, session)
    return model


@router.get("/bots", response_model=Page[AgentBotModel])
def get_agent_bots(user_id: int, session: Session = Depends(get_db)):
    data = AgentService.get_by_user(user_id, session)
    res = paginate(data)
    return res


@router.get("/bots/{bot_id}", response_model=AgentBotModel)
async def get_agent_bot(bot_id, user_id: int, with_draft=False, session: Session = Depends(get_db)):
    model = AgentService.get_by_id(bot_id, session)
    if model is None:
        raise HTTPException(404)
    if with_draft:
        draft = AgentConfigService.get_or_create_bot_draft(
            user_id, bot_id, session)
        model.draft = draft
    return model


@router.get("/bots/{bot_id}/draft", response_model=AgentConfigModel)
async def get_or_create_agent_bot_draft_config(user_id: int, bot_id, session: Session = Depends(get_db)):
    model = AgentConfigService.get_or_create_bot_draft(
        user_id, bot_id, session)
    if model is None:
        raise HTTPException(404)
    return model


@router.put("/bots/{bot_id}")
async def update_agent_bot(user_id: int, bot: AgentBotUpdate, session: Session = Depends(get_db)):
    success = AgentService.update(user_id,  bot, session)
    return success


@router.get("/configs/{config_id}", response_model=AgentConfigModel)
async def get_agent_config(config_id, session: Session = Depends(get_db)):
    model = AgentConfigService.get_by_id(config_id, session)
    if model is None:
        raise HTTPException(404)
    return model


@router.put("/configs/{bot_id}")
async def update_agent_config(user_id: int, config: AgentConfigUpdate, session: Session = Depends(get_db)):
    success = AgentConfigService.update(user_id, config, session)
    return success


@router.post("/configs", response_model=AgentConfigModel)
async def create_agent_config(user_id: int, config: AgentConfigCreate, session: Session = Depends(get_db)):
    model = AgentConfigService.create(user_id, config, session)
    return model
