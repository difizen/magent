from typing import List
from fastapi import APIRouter
from agentuniverse_product.service.llm_service.llm_service import LLMService
from agentuniverse_product.service.model.llm_dto import LlmDTO
from magent_ui.utils import AsyncTask

router = APIRouter()
llms_router = router


@router.get("/llms", response_model=List[LlmDTO])
async def get_agents():
    return await AsyncTask.to_thread(LLMService.get_llm_list)
