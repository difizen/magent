from typing import Optional
from pydantic import BaseModel
from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
)

from db import Base
from models.agent_config import AgentConfigModel


class AgentBotORM(Base):
    '''
    agent bot database model
    '''
    __tablename__ = "agent_bots"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    avatar = Column(String(255))
    created_by = Column(Integer)
    created_at = Column(
        DateTime(), nullable=False, default=datetime.now()
    )
    updated_by = Column(Integer)
    updated_at = Column(DateTime(),
                        nullable=False, onupdate=datetime.now())


class AgentBotCreate(BaseModel):
    '''
    agent bot create
    '''
    name: str
    avatar: Optional[str]


class AgentBotUpdate(BaseModel):
    '''
    agent bot update
    '''
    id: int
    name: Optional[str]
    avatar: Optional[str]


class AgentBotModel(AgentBotCreate):
    '''
    agent bot
    '''
    id: int
    created_by: int
    created_at: datetime
    updated_by: int
    updated_at: datetime
    draft: Optional[AgentConfigModel] = None

    class Config:
        from_attributes = True
