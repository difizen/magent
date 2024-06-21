from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from db import get_db
from models.agent_config import AgentConfigModel
from models.conversation import ConversationModel, MessageModelCreate
from routers.agent.crud import AgentConfigHelper

from .crud import ConversationHelper

# from .crud import AgentBotHelper, AgentConfigHelper


router = APIRouter()

conversation_router = router


@router.get("/{bot_id}/debug", response_model=ConversationModel)
def get_or_create_bot_conversation(bot_id, user_id: int, session: Session = Depends(get_db)):
    config_orm = AgentConfigHelper.get_bot_draft(session, bot_id)
    if config_orm is None:
        raise HTTPException(404)
    config = AgentConfigModel.model_validate(config_orm)
    model = ConversationHelper.get_or_create_bot_conversation(
        session, user_id, config.id)
    return ConversationModel.model_validate(model)


@router.post("/{conversation_id}/message", response_model=ConversationModel)
async def add_message_to_conversation(user_id: int, conversation_id: int,  config: MessageModelCreate, session: Session = Depends(get_db)):
    model = ConversationHelper.insert_message(
        session, **{**config.model_dump(), "sender_id": user_id, "conversation_id": conversation_id})
    return ConversationModel.model_validate(model)
