from typing import List, Optional
from pydantic import BaseModel, Json
from datetime import datetime

from sqlalchemy import (
    JSON,
    Column,
    ForeignKey,
    Integer,
    DateTime,
    String,
    Text,
    Boolean
)

from db import Base


class PluginApiORM(Base):
    '''
    plugin api model
    '''
    __tablename__ = "plugin_api"
    id = Column(Integer, primary_key=True)
    plugin_config_id = Column(Integer, ForeignKey(
        "plugin_config.id"))
    description = Column(Text)  # API 描述
    name = Column(String(255))  # 插件名字
    server_url = Column(String(255))
    method = Column(String(255))
    summary = Column(String(255))
    parameters = Column(JSON)
    openapi_desc = Column(JSON)  # openapi 先调研
    operation_id = Column(String(255))

    # request_params = Column(JSON)  # 入参
    # response_params = Column(JSON) # 出参
    # debug_example = Column(JSON) # 调试示例
    # debug_example_status = Column(Integer) # 调试示例状态
    # debug_status = Column(Integer) # 调试状态
    disabled = Column(Boolean, nullable=False, default=True)
    # online_status = Column(Integer) # 服务状态
    # path = Column(String(255)) #路径
    created_by = Column(Integer)
    created_at = Column(
        DateTime(), nullable=False, default=datetime.now,
    )
    updated_by = Column(Integer)
    updated_at = Column(DateTime(),
                        nullable=False, onupdate=datetime.now)
    # statistic_data = Column(JSON)  # 保留字段，用于存储诸如 被多少个bot 引用了


class PluginApiCreate(BaseModel):
    '''
    plugin api create
    '''
    plugin_config_id: int
    openapi_desc: dict
    name: Optional[str]
    description: Optional[str]
    server_url: str
    method: str
    summary: Optional[str]
    parameters: List[dict]
    operation_id: str
    disabled: Optional[bool]
    created_by: int
    created_at: datetime
    updated_by: int
    updated_at: datetime


class PluginApiUpdate(BaseModel):
    '''
    plugin api update
    '''
    id: int
    description: Optional[str]
    name: Optional[str]
    openapi_desc: Optional[str]
    server_url: Optional[str]
    method: Optional[str]
    summary: Optional[str]
    parameters: Optional[Json]
    operation_id: Optional[str]
    disabled: Optional[bool]


class PluginApiModel(PluginApiCreate):
    '''
    plugin api
    '''
    id: int
    created_by: int
    created_at: datetime
    updated_by: int
    updated_at: datetime

    class Config:
        from_attributes = True
