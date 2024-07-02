from typing import Optional
from pydantic import BaseModel
from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    DateTime,
)

from db import Base
from models.plugin_config import PluginConfigModel


class PluginORM(Base):
    '''
    plugin database model
    '''
    __tablename__ = "plugin"
    id = Column(Integer, primary_key=True)
    plugin_type = Column(Integer, nullable=False)  # 插件创建类型
    created_by = Column(Integer)
    created_at = Column(
        DateTime(), nullable=False, default=datetime.now
    )
    updated_by = Column(Integer)
    updated_at = Column(DateTime(),
                        nullable=False, onupdate=datetime.now)
    # statistic_data = Column(JSON)  # 保留字段，用于存储诸如 被多少个bot 引用了


class PluginCreate(BaseModel):
    '''
    plugin create
    '''
    plugin_type: int


class PluginUpdate(BaseModel):
    '''
    plugin update
    '''
    id: int
    plugin_type: int


class PluginModel(PluginCreate):
    '''
    plugin
    '''
    id: int
    plugin_type: int
    created_by: int
    created_at: datetime
    updated_by: int
    updated_at: datetime
    draft: Optional[PluginConfigModel] = None

    class Config:
        from_attributes = True
