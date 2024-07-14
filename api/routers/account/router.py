from fastapi import APIRouter, HTTPException

from models.account import AccountModel, AccountCreate
from services.account import AccountService

router = APIRouter()
account_router = router


@router.post("/", response_model=AccountModel)
async def create_account(model: AccountCreate) -> AccountModel:
    account_model = await AccountService.create(model)
    return account_model


@router.get("/{user_id}", response_model=AccountModel)
async def get_account_by_id(user_id):
    model = AccountService.get_by_id(user_id)
    if model is None:
        raise HTTPException(404)
    return model


@router.get("/email/{email}", response_model=AccountModel)
async def get_account_by_email(email):
    model = AccountService.get_by_email(email)
    if model is None:
        raise HTTPException(404)
    return AccountModel.model_validate(model)
