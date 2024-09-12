from fastapi import APIRouter, Form,File, UploadFile
from magent_ui.config import app_config
import aiofiles

router = APIRouter()
resource_router = router

@router.post("/resource/uploadfile")
async def upload_resource_file(file: UploadFile = File(...), filename:str= Form(...)):
    file_location = app_config.resource_dir_path.joinpath(filename)

    # 使用 aiofiles 异步写入文件
    async with aiofiles.open(file_location, "wb") as buffer:
        while content := await file.read(1024):  # 每次读取 1024 字节
            await buffer.write(content)

    return {"filename": filename}
