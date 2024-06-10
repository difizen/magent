import enum
from typing import Optional
from db import Base
from pydantic import BaseModel

from datetime import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    JSON,
    Enum,
    ForeignKey,
    func
)


class AgentBotModel(Base):
    __tablename__ = "agent_bots"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    avatar = Column(String(255))
    draft = Column(Integer, ForeignKey("agent_configs.id"))
    created_by =  Column(Integer)
    created_at = Column(
        DateTime(), nullable=False, server_default=func.now()
    )
    updated_by =  Column(Integer)
    updated_at = Column(DateTime(),
                        nullable=False, onupdate=func.now())

class AgentConfigStatus(enum.Enum):
    DRAFT = "draft"
    PUBLISH = "publish"


class AgentConfigModel(Base):
    __tablename__ = "agent_configs"
    id = Column(Integer, primary_key=True)
    status = Column(
        Enum(AgentConfigStatus),
        nullable=False
    )
    config = Column(JSON)
    created_by =  Column(Integer)
    created_at = Column(
        DateTime(), nullable=False, server_default=func.now()
    )
    updated_by =  Column(Integer)
    updated_at = Column(DateTime(),
                        nullable=False, onupdate=func.now())




class SchemaAgentBot(BaseModel):
    id:int
    name:str
    avatar:Optional[str]
    draft: int
    create_by: int
    created_at:datetime
    updated_by: int
    updated_at:datetime

    class Config:
        from_attributes = True

class SchemaAgentConfig(BaseModel):
    id:int
    bot_id:str
    config: dict
    status: AgentConfigStatus
    create_by: int
    created_at:datetime
    updated_by: int
    updated_at:datetime

    class Config:
        from_attributes = True
