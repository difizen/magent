from sqlalchemy.orm import Session
from fastapi import Depends
from dao.account import AccountHelper

from db import get_db
from models.account import AccountCreate, AccountModel


class AccountService:

    @staticmethod
    async def create(account: AccountCreate, session: Session) -> AccountModel:
        account_orm = await AccountHelper.create(session, account)
        return AccountModel.model_validate(account_orm)

    @staticmethod
    def get_by_id(user_id: int, session: Session) -> AccountModel | None:
        account_orm = AccountHelper.get_by_id(session, user_id)
        if account_orm is None:
            return None
        else:
            return AccountModel.model_validate(account_orm)

    @staticmethod
    def get_by_email(email: str, session: Session) -> AccountModel | None:
        account_orm = AccountHelper.get_by_email(session, email)
        if account_orm is None:
            return None
        else:
            return AccountModel.model_validate(account_orm)
