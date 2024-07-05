from typing import Optional
from pydantic import BaseModel
from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    DateTime,
    String,
    Text,
)

from db import Base
from models.plugin_config import PluginConfigModel


class PluginORM(Base):
    '''
    plugin database model
    '''
    __tablename__ = "plugin"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)  # 插件名字
    avatar = Column(String(255))  # 插件图标
    description = Column(Text)  # 插件描述
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
    name: str
    avatar: Optional[str]
    description: Optional[str]


class PluginUpdate(BaseModel):
    '''
    plugin update
    '''
    id: int
    plugin_type: Optional[int]
    name: Optional[str]
    avatar: Optional[str]
    description: Optional[str]


class PluginModel(PluginCreate):
    '''
    plugin
    '''
    id: int
    created_by: int
    created_at: datetime
    updated_by: int
    updated_at: datetime
    draft: Optional[PluginConfigModel] = None

    class Config:
        from_attributes = True
