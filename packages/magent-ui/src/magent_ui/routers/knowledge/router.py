from typing import List
from fastapi import APIRouter
from agentuniverse_product.service.model.knowledge_dto import KnowledgeDTO
from agentuniverse_product.service.knowledge_service.knowledge_service import KnowledgeService

router = APIRouter()
knowledge_router = router


@router.get("/knowledge", response_model=List[KnowledgeDTO])
async def get_knowledge():
    return KnowledgeService.get_knowledge_list()
