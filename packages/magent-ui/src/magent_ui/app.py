from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from contextlib import asynccontextmanager
import webbrowser
import uvicorn
from magent_ui.routers.main import api_router
import os
from agentuniverse.base.util.system_util import get_project_root_path

PORT = int(os.getenv("MAGENT_UI_SERVER_PORT", "8888"))


@asynccontextmanager
async def lifespan(app: FastAPI):
    url = f"http://localhost:{PORT}"
    webbrowser.open(url)
    print(f"[magent] Server is running at {url}")
    yield
    print('[magent] finished')


app = FastAPI(lifespan=lifespan)
app.include_router(api_router, prefix='/api/v1')


# 挂载 static 目录，使其可以访问静态文件
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
static_dir = os.path.join(BASE_DIR, 'static')
templates_dir = os.path.join(BASE_DIR, 'templates')

if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir,
              html=True), name="static")
else:
    print('[magent] can not find dist files')

templates = Jinja2Templates(directory=templates_dir)


@app.get("/", response_class=HTMLResponse)
async def to_index_page(request: Request):
    return RedirectResponse(url="/app/")


@app.get("/app/{path:path}", response_class=HTMLResponse)
async def to_app_page(request: Request):
    return templates.TemplateResponse(
        request=request, name="index.html", context={"page_config": {"baseUrl": "/app"}, "static_url": "/static"}
    )


def launch():
    project_root_path = get_project_root_path()
    resource_path = project_root_path / 'app' / 'resources'
    if resource_path.exists():
        app.mount("/resources", StaticFiles(directory=resource_path,
                                            html=True), name="resources")
    uvicorn.run(app,
                host="0.0.0.0", port=PORT)
