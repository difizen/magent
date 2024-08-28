import asyncio
import enum
import json
from typing import AsyncIterable, List
from fastapi import APIRouter
import agentuniverse_product.service.util.product_util as util

router = APIRouter()
common_router = router


@router.get("/common/is_id_unique", response_model=bool)
async def is_id_unique(id:str, type:str):
    result = util.is_id_unique(id,type)
    return result

