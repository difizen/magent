import enum
from typing import Optional, Union
from pydantic import BaseModel
from datetime import datetime
from db import Base

from sqlalchemy import (
    ForeignKey,
    Column,
    Integer,
    DateTime,
    Text,
    String,
    Enum,
    JSON
)
from sqlalchemy.orm import relationship
# from models.knowledge import KnowledgeModel


class SplitType(enum.Enum):
    '''
    split type
    '''
    AUTO = "Auto"
    CUSTOM = "Custom"


class KnowledgeConfigORM(Base):
    '''
    knowledge config orm
    '''
    __tablename__ = 'knowledge_config'
    id = Column(Integer, primary_key=True)
    created_by = Column(Integer)
    created_at = Column(DateTime(), nullable=False, default=datetime.now)
    updated_by = Column(Integer)
    updated_at = Column(DateTime(), nullable=False, onupdate=datetime.now)
    knowledge_id = Column(Integer, ForeignKey('knowledge.id'))
    knowledge = relationship("KnowledgeORM", back_populates="config")


class DocumentConfigORM(KnowledgeConfigORM):
    '''
    dcoument knowledge config orm
    '''
    __tablename__ = 'knowledge_document_config'
    id = Column(Integer, ForeignKey('knowledge_config.id'), primary_key=True)
    mode = Column(Enum(SplitType), nullable=True)  # "auto" 或 "custom"
    chunk_size = Column(String(255), unique=True,
                        nullable=True)  # 仅在 custom 模式下有效
    identifier = Column(String(255), nullable=True)  # 分段标识符
    text_preprocessing_rules = Column(JSON)  # 文本预处理规则 可能有多个，使用 JSON 存储


class SheetConfigORM(KnowledgeConfigORM):
    '''
    need to update
    '''
    __tablename__ = 'knowledge_sheet_config'
    id = Column(Integer, ForeignKey('knowledge_config.id'), primary_key=True)
    headers = Column(Text)  # 表头描述
    structure = Column(Text)  # 表结构描述


class ImageConfigORM(KnowledgeConfigORM):
    '''
    need to update
    '''
    __tablename__ = 'knowledge_image_config'
    id = Column(Integer, ForeignKey('knowledge_config.id'), primary_key=True)
    mode = Column(String)  # "auto" 或 "custom"
    description = Column(Text)  # 描述，仅在 custom 模式下有效


class DocumentConfigCreate(BaseModel):
    '''
    document config create
    '''
    knowledge_id: int
    # knowledge: Optional[KnowledgeModel]
    mode: Optional[SplitType] = SplitType.AUTO
    chunk_size: Optional[int] = 800
    identifier: Optional[str]
    text_preprocessing_rules: Optional[dict]


class DocumentConfigModel(DocumentConfigCreate):
    '''
    document config model
    '''
    created_by: int
    created_at: datetime
    updated_by: int
    updated_at: datetime

    class Config:
        from_attributes = True


class SheetConfigCreate(BaseModel):
    '''
    need to update
    '''
    knowledge_id: int
    # knowledge = Optional[KnowledgeModel]


class SheetConfigModel(SheetConfigCreate):
    '''
    need to update
    '''
    created_by: int
    created_at: datetime
    updated_by: int
    updated_at: datetime

    class Config:
        from_attributes = True


class ImageConfigCreate(BaseModel):
    '''
    need to update
    '''
    knowledge_id: int
    # knowledge = Optional[KnowledgeModel]


class ImageConfigModel(ImageConfigCreate):
    '''
    need to update
    '''
    created_by: int
    created_at: datetime
    updated_by: int
    updated_at: datetime

    class Config:
        from_attributes = True


KnowledgeConfigModel = Union[DocumentConfigModel,
                             SheetConfigModel, ImageConfigModel]