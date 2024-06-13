from datetime import datetime
from sqlalchemy.orm import Session
from models.account import AccountCreate, AccountORM, AccountStatus

from config import settings


class AccountHelper:

    @staticmethod
    def get_by_id(session: Session, user_id: int) -> AccountORM | None:
        return session.query(AccountORM).filter(AccountORM.id == user_id).scalar()

    @staticmethod
    def get_by_email(session: Session, email: str) -> AccountORM | None:
        return session.query(AccountORM).filter(AccountORM.email == email).scalar()

    @staticmethod
    def create(session: Session, account: AccountCreate) -> AccountORM:
        now = datetime.now()
        account = AccountORM(**{
            **account.model_dump(),
            "language": settings.DEFAULT_LANGUAGE,
            "theme": settings.DEFAULT_THEME,
            "status": AccountStatus.ACTIVE,
            "last_active_at": now,
            "initialized_at": now,
            "created_at": now,
            "updated_at": now,
        })
        session.add(account)
        session.commit()
        session.refresh(account)
        return account


def init_db(session: Session) -> None:
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next lines
    # from sqlmodel import SQLModel

    # from app.core.engine import engine
    # This works because the models are already imported and registered from app.models
    # SQLModel.metadata.create_all(engine)

    user = session.query(AccountORM).filter(
        AccountORM.email == settings.FIRST_SUPERUSER).first()
    if not user:
        user_in = AccountCreate(
            email=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            name=settings.FIRST_SUPERUSER,
            avatar=settings.FIRST_SUPERUSER_AVATAR
        )
        user = AccountHelper.create(session, user_in)
