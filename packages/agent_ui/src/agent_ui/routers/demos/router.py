from fastapi import APIRouter, HTTPException
# from sqlalchemy.orm import Session
# from fastapi import Depends
# from packages.magent.src.temps.au_agent import RagAgent
# from agentuniverse.base.agentuniverse import AgentUniverse


router = APIRouter()
demos_router = router


@router.get("/detail")
async def get_account_by_id():
    print('finish')
    return True
