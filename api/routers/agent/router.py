from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from models.agent import AgentBotModel, AgentBotCreate, AgentConfigModel

from db import get_db

from .crud import AgentBotHelper, AgentConfigHelper

router = APIRouter()


@router.post("/bot", response_model=AgentBotModel)
async def create_agent_bot(bot_model: AgentBotCreate, session: Session = Depends(get_db), ):
    model = await AgentBotHelper.create(session, 2, bot_model)
    return AgentBotModel.model_validate(model)


@router.get("/bot/{bot_id}", response_model=AgentBotModel)
async def get_agent_bot(bot_id, db: Session = Depends(get_db)):
    model = AgentBotHelper.get(db, bot_id)
    if model is None:
        raise HTTPException(404)
    return AgentBotModel.model_validate(model)


@router.get("/config/{config_id}", response_model=AgentConfigModel)
async def get_agent_config(config_id, session: Session = Depends(get_db)):
    model = AgentBotHelper.get(session, config_id)
    if model is None:
        raise HTTPException(404)
    return AgentBotModel.model_validate(model)


@router.post("/config", response_model=AgentConfigModel)
async def create_agent_config(session: Session = Depends(get_db)):
    model = AgentConfigHelper.create(session, 2)
    return AgentConfigModel.model_validate(model)
