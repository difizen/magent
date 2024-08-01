from pathlib import Path
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import webbrowser
import uvicorn
from magent_ui.routers.main import api_router
import os

PORT = 9000


@asynccontextmanager
async def lifespan(app: FastAPI):
    url = f"http://localhost:{PORT}"
    webbrowser.open(url)
    print(f"[magent] Server is running at {url}")
    yield
    print('[magent] finished')


app = FastAPI(lifespan=lifespan)
app.include_router(api_router, prefix='/api/v1')


def launch():

    # 挂载 static 目录，使其可以访问静态文件
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    static_dir = os.path.join(BASE_DIR, 'static')
    if os.path.exists(static_dir):
        app.mount("/static", StaticFiles(directory=static_dir,
                  html=True), name="static")
    else:
        print('[magent] can not find dist files')
    uvicorn.run(f"magent_ui.app:app",
                host="localhost", port=PORT, reload=True)
