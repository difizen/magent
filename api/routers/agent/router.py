from fastapi import APIRouter, HTTPException

from fastapi_pagination import Page, paginate

from models.agent_bot import AgentBotModel, AgentBotCreate, AgentBotUpdate
from models.agent_config import AgentConfigModel, AgentConfigUpdate, AgentConfigCreate

from services.agent import AgentConfigService, AgentService

router = APIRouter()

agent_router = router


@router.post("/bots", response_model=AgentBotModel)
def create_agent_bot(user_id: int, bot: AgentBotCreate):
    model = AgentService.create(user_id, bot)
    return model


@router.get("/bots", response_model=Page[AgentBotModel])
def get_agent_bots(user_id: int):
    data = AgentService.get_by_user(user_id)
    res = paginate(data)
    return res


@router.get("/bots/{bot_id}", response_model=AgentBotModel)
async def get_agent_bot(bot_id, user_id: int, with_draft=False):
    model = AgentService.get_by_id(bot_id)
    if model is None:
        raise HTTPException(404)
    if with_draft:
        draft = AgentConfigService.get_or_create_bot_draft(user_id, bot_id)
        model.draft = draft
    return model


@router.get("/bots/{bot_id}/draft", response_model=AgentConfigModel)
async def get_or_create_agent_bot_draft_config(user_id: int, bot_id):
    model = AgentConfigService.get_or_create_bot_draft(user_id, bot_id)
    if model is None:
        raise HTTPException(404)
    return model


@router.put("/bots/{bot_id}")
async def update_agent_bot(user_id: int, bot: AgentBotUpdate):
    success = AgentService.update(user_id,  bot)
    return success


@router.get("/configs/{config_id}", response_model=AgentConfigModel)
async def get_agent_config(config_id):
    model = AgentConfigService.get_by_id(config_id)
    if model is None:
        raise HTTPException(404)
    return model


@router.put("/configs/{bot_id}")
async def update_agent_config(user_id: int, config: AgentConfigUpdate):
    success = AgentConfigService.update(user_id, config)
    return success


@router.post("/configs", response_model=AgentConfigModel)
async def create_agent_config(user_id: int, config: AgentConfigCreate):
    model = AgentConfigService.create(user_id, config)
    return model
