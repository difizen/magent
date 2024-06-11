from fastapi import FastAPI, Depends
from db import SessionLocal
from sqlalchemy.orm import Session
from models import AgentBotHelper, AgentBotModel, SchemaAgentBot, AccountHelper, SchemaAccount, AccountModel, AccountStatus
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

@app.get("/api/v1/acccount", response_model=SchemaAccount)
async def account(db: Session = Depends(get_db)):
    account = AccountHelper.get_or_create(db)
    if account is not None:
        return account
    else:
        raise Exception('can not get account')


@app.get("/api/v1/bot/{bot_id}/draft")
async def get_bot_draft(bot_id, db: Session = Depends(get_db)):
    model = db.query(AgentBotModel).filter(AgentBotModel.id == bot_id).scalar()
    return SchemaAgentBot.model_validate(model)


@app.get("/api/v1/bot/get_or_create")
async def get_or_create_bot(db: Session = Depends(get_db)):
    bot = AgentBotHelper.get_or_create(db)
    return bot
