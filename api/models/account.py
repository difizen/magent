import enum

from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Enum,
    func,
)

from db import Base


class AccountStatus(enum.Enum):
    PENDING = "pending"
    UNINITIALIZED = "uninitialized"
    ACTIVE = "active"
    BANNED = "banned"


class Account(Base):
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
        DateTime(), nullable=False, server_default=func.now()
    )
    status = Column(
        Enum(AccountStatus),
        nullable=False,
    )
    initialized_at = Column(DateTime(), server_default=func.now())

    created_at = Column(
        DateTime(), nullable=False, server_default=func.now()
    )
    updated_at = Column(DateTime(),
                        nullable=False, onupdate=func.now())

    @property
    def is_password_set(self):
        return self.password is not None
