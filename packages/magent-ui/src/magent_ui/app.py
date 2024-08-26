from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from contextlib import asynccontextmanager
import webbrowser
import uvicorn
import logging
from magent_ui.routers.main import api_router
from magent_ui.config import to_uvicorn_config, app_config
import os
from agentuniverse.base.util.system_util import get_project_root_path
from uvicorn.config import LOGGING_CONFIG

# Use uvicorn's default logging configuration
logging.config.dictConfig(LOGGING_CONFIG) # type: ignore

# Get the uvicorn logger
logger = logging.getLogger("uvicorn")

# 挂载 static 目录，使其可以访问静态文件
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
static_dir = os.path.join(BASE_DIR, 'static')
templates_dir = os.path.join(BASE_DIR, 'templates')


templates = Jinja2Templates(directory=templates_dir)

def launch(**kwargs):
    logger.info("Current log level is")
    project_root_path = get_project_root_path()

    app_config.load_config(project_root_path=project_root_path, **kwargs)

    if app_config.log_level is not None:
        logger.setLevel(app_config.log_level)



    @asynccontextmanager
    async def lifespan(app: FastAPI):
        if app_config.open_browser:
            url = f"http://localhost:{app_config.port}{app_config.root_path}"
            webbrowser.open(url)
        logger.info(f"Server is running at {url}")
        yield
        logger.info('Server finished')

    app = FastAPI(lifespan=lifespan)

    # api
    app.include_router(api_router, prefix=app_config.full_api_path)

    # static
    if os.path.exists(static_dir):
        app.mount(app_config.full_static_path, StaticFiles(directory=static_dir,
                                                    html=True), name="static")
    else:
        logger.info('Can not find static directory. ', static_dir)

    # resources
    if not app_config.resource_dir_path.exists():
        logger.info('Resource directory not exist. create at',
                    app_config.resource_dir_path)
        os.makedirs(app_config.resource_dir_path)

    app.mount(app_config.full_resource_path, StaticFiles(directory=app_config.resource_dir_path,
                                                  html=True))

    # auto redirect to app url
    @app.get(app_config.root_path, response_class=HTMLResponse)
    async def to_index_page(request: Request):
        return RedirectResponse(url=f"{app_config.app_url}/")

    # html as default, app_path included
    html_root = app_config.root_path if app_config.root_path.endswith(
        '/') else f"{app_config.root_path}/"

    @app.get(html_root+"{path:path}", response_class=HTMLResponse)
    async def to_app_page(request: Request):
        page_config = {
            "baseUrl": app_config.base_url,
            "resourceUrl": app_config.resource_url,
            "apiUrl": app_config.api_url,
            "appUrl": app_config.app_url,
            "staticUrl": app_config.static_url,
        }
        return templates.TemplateResponse(
            request=request, name="index.html", context={
                "page_config": page_config, "static_url": app_config.static_url
            }
        )

    uvicorn_config = to_uvicorn_config(app_config.config)
    uvicorn.run(app, log_level='info', **uvicorn_config)
