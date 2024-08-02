from typing import List
from fastapi import APIRouter, HTTPException
from agentuniverse_product.service.llm_service.llm_service import LLMService
from agentuniverse_product.service.model.llm_dto import LlmDTO

router = APIRouter()
llms_router = router


@router.get("/llms", response_model=List[LlmDTO])
async def get_agents():
    return LLMService.get_llm_list()
