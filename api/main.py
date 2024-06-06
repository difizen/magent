from fastapi import FastAPI, Depends
from db import SessionLocal
from sqlalchemy.orm import Session
from models import count_account, Account, AccountModel, AccountStatus
from datetime import datetime

def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/api/v1/acccount", response_model=Account)
async def account(db: Session = Depends(get_db)):
    count = count_account(db)
    act = None
    if count == 0:
        now = datetime.now()
        db_account = AccountModel(**{
            "name": "default",
            "email": "default@magent.com",
            "avatar": "https://api.dicebear.com/7.x/miniavs/svg?seed=1",
            "language":"zh_cn",
            "theme":"light",
            "status": AccountStatus.ACTIVE,
            "last_active_at": now,
            "initialized_at": now,
            "created_at": now,
            "updated_at": now,
        })
        db.add(db_account)
        db.commit()
        db.refresh(db_account)
        act = Account.model_validate(db_account)
    else:
        db_account = db.query(AccountModel).first()
        act = Account.model_validate(db_account)

    if act is not None:
        return act
    else:
        raise Exception('can not get account')

@app.get("/api/v1/acccount/count")
async def account_count(db: Session = Depends(get_db)):
    count = count_account(db)
    return {"count": count}
