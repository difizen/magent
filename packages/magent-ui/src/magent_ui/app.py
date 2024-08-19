from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from contextlib import asynccontextmanager
import webbrowser
import uvicorn
from magent_ui.routers.main import api_router
from magent_ui.config import load_config
import os
from agentuniverse.base.util.system_util import get_project_root_path


# 挂载 static 目录，使其可以访问静态文件
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
static_dir = os.path.join(BASE_DIR, 'static')
templates_dir = os.path.join(BASE_DIR, 'templates')


templates = Jinja2Templates(directory=templates_dir)

api_path = 'api'
static_path = 'static'
resource_path = 'resources'
app_path = 'app'


def launch(**kwargs):
    project_root_path = get_project_root_path()
    config = load_config(kwargs, project_root_path)
    port = config.get('port', 8888)
    base_root_path = '/'
    root_path = config.get('root_path', base_root_path)
    base_url = config.get('base_url', None)
    if base_url is None:
        base_url = root_path

    if not root_path.startswith('/'):
        print('[magent] root_path should start with "/" ', root_path)
        root_path = f'/{root_path}'
        config['root_path'] = root_path

    api_path = 'api'
    static_path = 'static'
    resource_path = 'resources'
    app_path = 'app'

    full_api_path = os.path.join(root_path, api_path)
    full_static_path = os.path.join(root_path, static_path)
    full_resource_path = os.path.join(root_path, resource_path)
    full_app_path = os.path.join(root_path, app_path)

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        url = f"http://localhost:{port}{root_path}"
        webbrowser.open(url)
        print(f"[magent] Server is running at {url}")
        yield
        print('[magent] finished')

    app = FastAPI(lifespan=lifespan)

    # api
    app.include_router(api_router, prefix=full_api_path)

    # static
    if os.path.exists(static_dir):
        app.mount(full_static_path, StaticFiles(directory=static_dir,
                                                html=True), name="static")
    else:
        print('[magent] can not find static directory. ', static_dir)

    # resources
    resource_dir_path = project_root_path / 'app' / 'resources'
    if resource_dir_path.exists():
        app.mount(full_resource_path, StaticFiles(directory=resource_dir_path,
                                                  html=True))
    else:
        print('[magent] can not find resource directory. ', resource_dir_path)

    api_url = os.path.join(base_url, api_path)
    static_url = os.path.join(base_url, static_path)
    resource_url = os.path.join(base_url, resource_path)
    app_url = os.path.join(base_url, app_path)

    # index
    @app.get(root_path, response_class=HTMLResponse)
    async def to_index_page(request: Request):
        return RedirectResponse(url=f"{app_url}/")

    # index html
    html_root = root_path if root_path.endswith(
        '/') else f"{root_path}/"

    @app.get(html_root+"{path:path}", response_class=HTMLResponse)
    async def to_app_page(request: Request):

        page_config = {
            "baseUrl": base_url,
            "resourceUrl": resource_url,
            "apiUrl": api_url,
            "appUrl": app_url,
            "staticUrl": static_url,
        }
        return templates.TemplateResponse(
            request=request, name="index.html", context={
                "page_config": page_config, "static_url": static_url
            }
        )

    # remove unsupported config key
    del config['base_url']

    # root path has already taken effect
    del config['root_path']

    uvicorn.run(app, **config)
