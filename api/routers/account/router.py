from fastapi import APIRouter, HTTPException

from db import get_db
from models.account import AccountModel, AccountCreate
from services.account import AccountService
from sqlalchemy.orm import Session
from fastapi import Depends

router = APIRouter()
account_router = router


@router.post("/", response_model=AccountModel)
async def create_account(model: AccountCreate, session: Session = Depends(get_db)) -> AccountModel:
    account_model = await AccountService.create(model, session)
    return account_model


@router.get("/{user_id}", response_model=AccountModel)
async def get_account_by_id(user_id, session: Session = Depends(get_db)):
    model = AccountService.get_by_id(user_id, session)
    if model is None:
        raise HTTPException(404)
    return model


@router.get("/email/{email}", response_model=AccountModel)
async def get_account_by_email(email, session: Session = Depends(get_db)):
    model = AccountService.get_by_email(email, session)
    if model is None:
        raise HTTPException(404)
    return AccountModel.model_validate(model)
