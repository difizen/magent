from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from models.account import AccountModel, AccountCreate
from db import get_db

from .crud import AccountHelper

router = APIRouter()
account_router = router


@router.post("/", response_model=AccountModel)
async def create_account(model: AccountCreate, session: Session = Depends(get_db), ):
    model = await AccountHelper.create(session, model)
    return AccountModel.model_validate(model)


@router.get("/{user_id}", response_model=AccountModel)
async def get_account_by_id(user_id, db: Session = Depends(get_db)):
    model = AccountHelper.get_by_id(db, user_id)
    if model is None:
        raise HTTPException(404)
    return AccountModel.model_validate(model)


@router.get("/email/{email}", response_model=AccountModel)
async def get_account_by_email(email, db: Session = Depends(get_db)):
    model = AccountHelper.get_by_email(db, email)
    if model is None:
        raise HTTPException(404)
    return AccountModel.model_validate(model)
