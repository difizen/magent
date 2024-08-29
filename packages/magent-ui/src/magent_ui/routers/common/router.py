from fastapi import APIRouter
from agentuniverse_product.base.util.common_util import is_component_id_unique

router = APIRouter()
common_router = router


@router.get("/common/is_id_unique", response_model=bool)
async def is_id_unique(id:str, type:str):
    result = is_component_id_unique(id,type)
    return result

