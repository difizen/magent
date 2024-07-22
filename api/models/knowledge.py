import enum
from typing import Optional, List
from datetime import datetime
from db import Base

from pydantic import BaseModel, ValidationError, field_validator

from sqlalchemy import (
    ForeignKey,
    Column,
    Integer,
    DateTime,
    Text,
    Boolean,
    String,
    UUID,
    Enum
)
from sqlalchemy.orm import relationship

from models.knowledge_config import KnowledgeConfigModel, DocumentConfigModel, SheetConfigModel, ImageConfigModel


class KnowledgeType(enum.Enum):
    DOCUMENT = "document"
    SHEET = "sheet"
    IMAGE = "image"


class KnowledgeORM(Base):
    '''
    agent knowledge base model
    '''
    __tablename__ = "knowledge"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), unique=True, nullable=True)
    description = Column(Text)
    type = Column(
        Enum(KnowledgeType),
        nullable=False,
    )
    # import_type = Column(
    #     Enum(KnowledgeBaseImportType),
    #     nullable=False,
    # )
    avatar = Column(String(255))
    created_by = Column(Integer)
    created_at = Column(DateTime(), nullable=False, default=datetime.now)
    updated_by = Column(Integer)
    updated_at = Column(DateTime(), nullable=False, onupdate=datetime.now)
    config = relationship("KnowledgeConfigORM",
                          uselist=False, back_populates="knowledge")
    # files = relationship("KnowledgeFilesORM", back_populates="knowledge")


# class KnowledgeFileORM(Base):
#     '''
#     knowledge file
#     '''
#     __tablename__ = 'knowledge_file'
#     id = Column(Integer, primary_key=True)


class KnowledgeCreate(BaseModel):
    '''
    knowledge create, need to update
    '''
    type: KnowledgeType = KnowledgeType.DOCUMENT
    name: str
    description: Optional[str] = None
    avatar: Optional[str] = None


class KnowledgeUpdate(BaseModel):
    '''
    knowledge update
    '''
    id: int
    type: Optional[KnowledgeType] = None
    name: Optional[str] = None
    description: Optional[str] = None
    avatar: Optional[str] = None
    config: Optional[KnowledgeConfigModel] = None


class KnowledgeFileModel(BaseModel):
    '''
    knowledge file model
    '''
    id: int


class KnowledgeModel(KnowledgeCreate):
    '''
    knowledge model
    '''
    id: int
    created_by: int
    created_at: datetime
    updated_by: int
    updated_at: datetime
    config: Optional[KnowledgeConfigModel] = None
    # files: List[KnowledgeFileModel] = []

    @field_validator('config')
    @classmethod
    def set_config_model(cls, values):
        '''
        value config type and set config model
        '''
        print('values', values)
        if isinstance(values, type(None)) or isinstance(values, DocumentConfigModel) or isinstance(values, ImageConfigModel) or isinstance(values, SheetConfigModel):
            return values
        raise ValidationError(
            'config must be an instance of DocumentConfigModel or SheetConfigModel or ImageConfigModel')

    # @field_validator('files')
    # @classmethod
    # def append_file(cls, file):
    #     cls.files.append(file)

    class Config:
        from_attributes = True
        discriminator = 'type'
