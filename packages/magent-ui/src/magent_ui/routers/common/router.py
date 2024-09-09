from fastapi import APIRouter
from magent_ui.utils import AsyncTask
from agentuniverse_product.base.util.common_util import is_component_id_unique

router = APIRouter()
common_router = router


@router.get("/common/is_id_unique", response_model=bool)
async def is_id_unique(id: str, type: str):
    return await AsyncTask.to_thread(is_component_id_unique, id, type)
