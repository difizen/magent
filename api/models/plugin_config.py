from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    Integer,
    DateTime,
    ForeignKey,
    Text,
)

from db import Base


class PluginConfigORM(Base):
    '''
    plugin config database model
    '''
    __tablename__ = "plugin_config"
    id = Column(Integer, primary_key=True)
    # meta_info = Column(JSON) # 插件元信息，包含 api url，service_token,oauth_info 等
    plugin_id = Column(Integer, ForeignKey("plugin.id"), nullable=True)
    is_draft = Column(Boolean, nullable=False)  # 是否为草稿
    plugin_openapi_desc = Column(Text)  # openapi 先调研
    apis = Column(JSON)
    # openapi_desc = Column(Text) # openapi 先调研
    # plugin_desc = Column(Text)
    created_by = Column(Integer)
    created_at = Column(
        DateTime(), nullable=False, default=datetime.now,
    )
    updated_by = Column(Integer)
    updated_at = Column(DateTime(),
                        nullable=False, onupdate=datetime.now)


class PluginConfigCreate(BaseModel):
    '''
    plugin config create
    '''
    plugin_id: int
    plugin_openapi_desc: str
    is_draft: Optional[bool]


class PluginConfigUpdate(BaseModel):
    '''
    plugin config update
    '''
    id: int
    plugin_id: Optional[int]
    plugin_openapi_desc: Optional[str]
    apis: Optional[List[int]]
    is_draft: Optional[bool]


class PluginConfigModel(PluginConfigCreate):
    '''
    plugin config
    '''
    id: int
    created_by: int
    created_at: datetime
    updated_by: int
    updated_at: datetime
    apis: Optional[List[int]] = None

    class Config:
        from_attributes = True
