import shutil
from fastapi import APIRouter, Form,File, UploadFile
from magent_ui.config import app_config

router = APIRouter()
resource_router = router

@router.post("/resource/uploadfile")
async def upload_resource_file(file: UploadFile = File(...), filename:str= Form(...)):
    file_location = app_config.resource_dir_path.joinpath(filename)
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"filename": filename}
