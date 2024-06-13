from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from fastapi_pagination import Page

from models.agent import AgentBotModel, AgentBotCreate, AgentBotUpdate, AgentConfigModel, AgentConfigUpdate

from db import get_db

from .crud import AgentBotHelper, AgentConfigHelper


router = APIRouter()

agent_router = router


@router.post("/bots", response_model=AgentBotModel)
def create_agent_bot(user_id: int, bot: AgentBotCreate, session: Session = Depends(get_db)):
    model = AgentBotHelper.create(session, user_id, bot)
    return AgentBotModel.model_validate(model)


@router.get("/bots", response_model=Page[AgentBotModel])
def get_agent_bots(user_id: int, session: Session = Depends(get_db)):
    data = AgentBotHelper.get_all(session, user_id)
    return data


@router.get("/bots/{bot_id}", response_model=AgentBotModel)
async def get_agent_bot(bot_id, db: Session = Depends(get_db)):
    model = AgentBotHelper.get(db, bot_id)
    if model is None:
        raise HTTPException(404)
    return AgentBotModel.model_validate(model)


@router.put("/bots/{bot_id}")
async def update_agent_bot(user_id: int, bot: AgentBotUpdate, db: Session = Depends(get_db)):
    success = AgentBotHelper.update(db, user_id,  bot)
    return success


@router.get("/configs/{config_id}", response_model=AgentConfigModel)
async def get_agent_config(config_id, session: Session = Depends(get_db)):
    model = AgentConfigHelper.get(session, config_id)
    if model is None:
        raise HTTPException(404)
    return AgentConfigModel.model_validate(model)


@router.put("/configs/{bot_id}")
async def update_agent_config(user_id: int, config: AgentConfigUpdate, db: Session = Depends(get_db)):
    success = AgentConfigHelper.update(db, user_id, config)
    return success


@router.post("/configs", response_model=AgentConfigModel)
async def create_agent_config(user_id: int, session: Session = Depends(get_db)):
    model = AgentConfigHelper.create(session, user_id)
    return AgentConfigModel.model_validate(model)
