from typing import List
from fastapi import APIRouter, HTTPException
from agentuniverse_product.service.model.knowledge_dto import KnowledgeDTO

router = APIRouter()
knowledge_router = router


@router.get("/knowledge", response_model=List[KnowledgeDTO])
async def get_knowledge():
    return []
