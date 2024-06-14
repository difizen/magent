from typing import Optional
from pydantic import BaseModel
from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    DateTime,
    JSON,
    ForeignKey,
    func
)

from db import Base


class AgentConfigORM(Base):
    '''
    agent config database model
    '''
    __tablename__ = "agent_configs"
    id = Column(Integer, primary_key=True)
    bot_id = Column(Integer, ForeignKey("agent_bots.id"), nullable=True)
    is_draft = Column(Boolean, nullable=False)
    config = Column(JSON)
    created_by = Column(Integer)
    created_at = Column(
        DateTime(), nullable=False, server_default=func.now()
    )
    updated_by = Column(Integer)
    updated_at = Column(DateTime(),
                        nullable=False, onupdate=func.now())


class AgentConfigCreate(BaseModel):
    '''
    agent config create
    '''
    bot_id: int
    config: Optional[dict]
    is_draft: Optional[bool]


class AgentConfigUpdate(BaseModel):
    '''
    agent config update
    '''
    id: int
    is_draft: Optional[bool]
    config: Optional[dict]


class AgentConfigModel(AgentConfigCreate):
    '''
    agent config
    '''
    id: int
    bot_id: int
    created_by: int
    created_at: datetime
    updated_by: int
    updated_at: datetime

    class Config:
        from_attributes = True
