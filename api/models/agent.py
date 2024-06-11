import enum
from typing import Optional
from db import Base
from pydantic import BaseModel
from datetime import datetime

from sqlalchemy.orm import Session

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
    draft: Optional[int]
    created_by: int
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
    created_by: int
    created_at:datetime
    updated_by: int
    updated_at:datetime

    class Config:
        from_attributes = True



class AgentBotHelper:
    @staticmethod
    def count_bot(db: Session)->int:
        return db.query(func.count(AgentBotModel.id)).scalar()

    @staticmethod
    def get_or_create(db: Session)->SchemaAgentBot:
        '''
        TODO: remove after the authentication capability is improved
        '''
        count = AgentBotHelper.count_bot(db)
        if count == 0:
            now = datetime.now()
            db_account = AgentBotModel(**{
                "name": "default_bot",
                "avatar": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/HONDA_ASIMO.jpg/440px-HONDA_ASIMO.jpg",
                "created_by":2,
                "created_at": now,
                "updated_by":2,
                "updated_at": now,
            })
            db.add(db_account)
            db.commit()
            db.refresh(db_account)
            return SchemaAgentBot.model_validate(db_account)
        else:
            db_account = db.query(AgentBotModel).first()
            return  SchemaAgentBot.model_validate(db_account)
