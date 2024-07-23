from typing import Annotated, Union
from fastapi import APIRouter, HTTPException, Body, Depends
from fastapi.responses import JSONResponse
from fastapi_pagination import Page, paginate
from models.knowledge import KnowledgeModel, KnowledgeCreate, KnowledgeType, KnowledgeUpdate
from sqlalchemy.orm import Session
from pydantic import Field

from db import get_db
from models.knowledge_config import KnowledgeConfigCreate, KnowledgeConfigModel, DocumentConfigCreate, SheetConfigCreate, ImageConfigCreate
from services.knowledge import KnowledgeConfigService, KnowledgeService


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


@router.put("/{knowledge_id}")
async def update_knowledge(user_id: Annotated[int, Body()], knowledge: KnowledgeUpdate, session: Session = Depends(get_db)):
    try:
        success = KnowledgeService.update(
            operator=user_id, knowledge_model=knowledge, session=session)
        return success
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


@router.get("/config_knowledge_id/{knowledge_id}")
def get_knowledge_config_by_knowledge_id(knowledge_id: int, user_id: int,  session: Session = Depends(get_db)):
    try:
        knowledge_config_model = KnowledgeConfigService.get_by_knowledge_id(
            user_id, knowledge_id, session)
        if knowledge_config_model is None:
            raise HTTPException(404)
        else:
            return knowledge_config_model
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.post("/config", response_model=KnowledgeConfigModel)
def create_knowledge_config(user_id: Annotated[int, Body()], knowledge_config: Annotated[Union[DocumentConfigCreate, SheetConfigCreate, ImageConfigCreate], Field(union_mode='left_to_right')], session: Session = Depends(get_db)):
    try:
        knowledge_model = KnowledgeConfigService.create(
            operator=user_id,
            knowledge_config=knowledge_config, session=session)
        if knowledge_model is None:
            raise HTTPException(
                status_code=404, detail="Config create failed")
        return knowledge_model
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.delete("/config/{knowledge_config_id}", response_model=bool)
def delete_knowledge_config(knowledge_config_id: int, user_id: int, session: Session = Depends(get_db)):
    try:
        is_deleted = KnowledgeConfigService.delete(
            user_id, knowledge_config_id, session)
        if not is_deleted:
            raise HTTPException(
                status_code=404, detail="Knowledge item not found")
        return JSONResponse(content={"success": is_deleted}, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
