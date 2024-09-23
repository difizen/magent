from typing import Annotated, List
from fastapi import APIRouter, Body, File, UploadFile
from agentuniverse_product.service.model.knowledge_dto import KnowledgeDTO
from agentuniverse_product.service.knowledge_service.knowledge_service import KnowledgeService
from magent_ui.utils import AsyncTask

router = APIRouter()
knowledge_router = router


@router.get("/knowledge", response_model=List[KnowledgeDTO])
async def get_knowledge():
    return await AsyncTask.to_thread(KnowledgeService.get_knowledge_list)


@router.post("/knowledge", response_model=str)
async def create_knowledge(knowledge: KnowledgeDTO):
    return await AsyncTask.to_thread(KnowledgeService.create_knowledge, knowledge)


@router.put("/knowledge/{knowledge_id}", response_model=str)
async def update_knowledge(knowledge_id: str, knowledge: KnowledgeDTO):
    knowledge.id = knowledge_id
    return await AsyncTask.to_thread(KnowledgeService.update_knowledge, knowledge)


@router.delete("/knowledge/{knowledge_id}", response_model=bool)
async def delete_knowledge(knowledge_id: str):
    return await AsyncTask.to_thread(KnowledgeService.delete_knowledge, knowledge_id)


@router.post("/knowledge/upload")
async def upload_knowledge_file(knowledge_id: Annotated[str, Body()], file: UploadFile = File(...)):
    return await AsyncTask.to_thread(KnowledgeService.upload_knowledge_file, knowledge_id, file)
