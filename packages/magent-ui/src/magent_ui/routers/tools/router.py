from typing import List
from fastapi import APIRouter
from agentuniverse_product.service.tool_service.tool_service import ToolService
from agentuniverse_product.service.model.tool_dto import ToolDTO
from magent_ui.utils import AsyncTask

router = APIRouter()
tools_router = router


@router.get("/tools", response_model=List[ToolDTO])
async def get_agents():
    return await AsyncTask.to_thread(ToolService.get_tool_list)
