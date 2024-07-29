from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import webbrowser
import uvicorn
from agent_ui.routers.main import api_router
import os

PORT = 3000


@asynccontextmanager
async def lifespan(app: FastAPI):
    url = f"http://localhost:{PORT}"
    webbrowser.open(url)
    print(f"Server is running at {url}")
    yield
    print('finished')

app = FastAPI(lifespan=lifespan)

app.include_router(api_router, prefix='/api/v1')

# 挂载 static 目录，使其可以访问静态文件
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
dist_dir = os.path.join(BASE_DIR, 'dist')
app.mount("/", StaticFiles(directory=dist_dir,  html=True), name="dist")


def start_ui_serve():
    uvicorn.run("agent_ui.start:app",
                host="localhost", port=PORT, reload=True)
