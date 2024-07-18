from typing import Annotated
from fastapi import APIRouter, HTTPException, Body, Depends
from fastapi.responses import JSONResponse
from fastapi_pagination import Page, paginate
from models.knowledge import KnowledgeModel, KnowledgeCreate
from sqlalchemy.orm import Session

from db import get_db
from services.knowledge import KnowledgeService


router = APIRouter()

knowledge_router = router


@router.get("/{knowledge_id}", response_model=KnowledgeModel)
def get_knowledge(knowledge_id: int, user_id: int,  session: Session = Depends(get_db)):
    try:
        knowledge_model = KnowledgeService.get(user_id, knowledge_id, session)
        if knowledge_model is None:
            raise HTTPException(404)
        else:
            return knowledge_model
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.get("/", response_model=Page[KnowledgeModel])
def get_all_knowledges(user_id: int, session: Session = Depends(get_db)):
    try:
        all_knowledges = KnowledgeService.get_all_knowledges(
            operator=user_id, session=session)
        return paginate(all_knowledges)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.get("/user/{user_id}", response_model=Page[KnowledgeModel])
def get_user_knowledges(user_id, session: Session = Depends(get_db)):
    try:
        user_knowledges = KnowledgeService.get_user_knowledges(
            operator=user_id, session=session)
        return paginate(user_knowledges)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.post("/", response_model=KnowledgeModel)
def create_knowledge(user_id: Annotated[int, Body()], knowledge: KnowledgeCreate, session: Session = Depends(get_db)):
    try:
        knowledge_model = KnowledgeService.create(
            operator=user_id, knowledge_model=knowledge, session=session)
        return knowledge_model
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.delete("/{knowledge_id}", response_model=bool)
def delete_knowledge(knowledge_id: int, user_id: int, session: Session = Depends(get_db)):
    try:
        is_deleted = KnowledgeService.delete(user_id, knowledge_id, session)
        if not is_deleted:
            raise HTTPException(
                status_code=404, detail="Knowledge item not found")
        return JSONResponse(content={"success": is_deleted}, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
