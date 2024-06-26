import enum

from datetime import datetime
from pydantic import BaseModel
from typing import Optional

from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Enum,
)

from db import Base


class AccountStatus(enum.Enum):
    PENDING = "pending"
    UNINITIALIZED = "uninitialized"
    ACTIVE = "active"
    BANNED = "banned"


class AccountORM(Base):
    __tablename__ = "accounts"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=True)
    password_salt = Column(String(255), nullable=True)
    avatar = Column(String(255))
    language = Column(String(255))
    theme = Column(String(255))
    timezone = Column(String(255))
    last_login_at = Column(DateTime())
    last_login_ip = Column(String(255))
    last_active_at = Column(
        DateTime(), nullable=False, default=datetime.now
    )
    status = Column(
        Enum(AccountStatus),
        nullable=False,
    )
    initialized_at = Column(DateTime(), default=datetime.now)

    created_at = Column(
        DateTime(), nullable=False, default=datetime.now
    )
    updated_at = Column(DateTime(),
                        nullable=False, onupdate=datetime.now)

    @property
    def is_password_set(self):
        return self.password is not None


class AccountCreate(BaseModel):
    password: str
    name: str
    email: str
    avatar: Optional[str]


class AccountModel(BaseModel):
    id: int
    name: str
    email: str
    avatar: Optional[str]
    language: Optional[str]
    theme: Optional[str]
    timezone: Optional[str]
    last_login_at: Optional[datetime]
    last_login_ip: Optional[str]
    last_active_at: datetime
    status: AccountStatus
    initialized_at: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
