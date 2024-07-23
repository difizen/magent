import enum
from typing import Optional, Union, Dict, Any, Annotated, Literal
from pydantic import BaseModel, field_validator, Field, ConfigDict
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


class KnowledgeConfigType(str, enum.Enum):
    DOCUMENT = "document"
    SHEET = "sheet"
    IMAGE = "image"


class SplitType(str, enum.Enum):
    '''
    split type
    '''
    AUTO = "auto"
    CUSTOM = "custom"


class KnowledgeConfigORM(Base):
    '''
    knowledge config orm
    '''
    __tablename__ = 'knowledge_config'
    id = Column(Integer, primary_key=True)
    config_type = Column(
        Enum(KnowledgeConfigType),
        nullable=False,
    )
    created_by = Column(Integer)
    created_at = Column(DateTime(), nullable=False, default=datetime.now)
    updated_by = Column(Integer)
    updated_at = Column(DateTime(), nullable=False, onupdate=datetime.now)
    knowledge_id = Column(Integer, ForeignKey('knowledge.id'))
    knowledge = relationship("KnowledgeORM", back_populates="config")
    config = Column(JSON)


class DocumentConfigBase(BaseModel):
    '''
    document config detail
    '''
    model_config = ConfigDict(use_enum_values=True)
    mode: Optional[SplitType] = Field(
        default=SplitType.AUTO, validate_default=True)
    chunk_size: Optional[str] = "800"
    identifier: Optional[str]
    text_preprocessing_rules: Dict[str, Any]


class DocumentConfigCreate(BaseModel):
    '''
    document config create
    '''
    knowledge_id: int
    config: DocumentConfigBase
    config_type: Literal[KnowledgeConfigType.DOCUMENT] = Field(
        default=KnowledgeConfigType.DOCUMENT)


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
    config_type: Literal[KnowledgeConfigType.SHEET] = Field(
        default=KnowledgeConfigType.SHEET)
    pass


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
    config_type: Literal[KnowledgeConfigType.IMAGE] = Field(
        default=KnowledgeConfigType.IMAGE)
    pass


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


KnowledgeConfigModel = Annotated[
    Union[DocumentConfigModel, SheetConfigModel, ImageConfigModel],
    Field(discriminator='config_type')
]


KnowledgeConfigCreate = Annotated[
    Union[DocumentConfigCreate, SheetConfigCreate, ImageConfigCreate],
    Field(discriminator='config_type')
]
