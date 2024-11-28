import nest_asyncio
from pathlib import Path
from typing import Any
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
# from fastapi.templating import Jinja2Templates
from contextlib import asynccontextmanager
import webbrowser
import uvicorn
import logging
import os
from uvicorn.config import LOGGING_CONFIG

from .config import to_uvicorn_config, app_config
from .current_executor import process_object
from .utils import is_ipython

# 应用 nest_asyncio 以解决事件循环冲突
nest_asyncio.apply()

# Use uvicorn's default logging configuration
logging.config.dictConfig(LOGGING_CONFIG)  # type: ignore

# Get the uvicorn logger
logger = logging.getLogger("uvicorn")

# 挂载 static 目录，使其可以访问静态文件
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
static_dir = os.path.join(BASE_DIR, 'static')
# templates_dir = os.path.join(BASE_DIR, 'templates')

# templates = Jinja2Templates(directory=templates_dir)


def launch(object: Any, llm_type: str | None = None, **kwargs):
    '''
    Launch the langchain server.
    '''
    process_object(object, llm_type)

    logger.info("Current log level is")
    project_root_path = Path.cwd()

    app_config.load_config(project_root_path=project_root_path, **kwargs)

    if app_config.log_level is not None:
        logger.setLevel(app_config.log_level)

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        url = f"http://localhost:{app_config.port}{app_config.root_path}"
        logger.info(f"Server is running at {url}")

        if app_config.open_browser:
            webbrowser.open(url)

        yield
        logger.info('Server finished')

    app = FastAPI(lifespan=lifespan)

    # # api
    # app.include_router(api_router, prefix=app_config.full_api_path)

    # static
    if os.path.exists(static_dir):
        app.mount(app_config.full_static_path, StaticFiles(
            directory=static_dir, html=True), name="static")
    else:
        logger.info('Can not find static directory. ', static_dir)

    # auto redirect to app url
    @app.get(app_config.root_path, response_class=HTMLResponse)
    async def to_index_page(request: Request):
        return RedirectResponse(url=f"{app_config.app_url}/")

    # html as default, app_path included
    # html_root = app_config.root_path if app_config.root_path.endswith(
    #     '/') else f"{app_config.root_path}/"

    # @app.get(html_root+"{path:path}", response_class=HTMLResponse)
    # async def to_app_page(request: Request):
    #     page_config = {
    #         "baseUrl": app_config.base_url,
    #         "resourceUrl": app_config.resource_url,
    #         "apiUrl": app_config.api_url,
    #         "appUrl": app_config.app_url,
    #         "staticUrl": app_config.static_url,
    #     }
    #     return templates.TemplateResponse(request=request, name="index.html", context={
    #         "page_config": page_config, "static_url": app_config.static_url
    #     })

    uvicorn_config = to_uvicorn_config(app_config.config)
    # 使用 asyncio.run() 运行 uvicorn
    # asyncio.run(uvicorn.run(app, log_level='info',
    #             loop="asyncio", **uvicorn_config))

    if is_ipython():
        # 在 Jupyter Notebook 中运行
        import asyncio
        asyncio.run(uvicorn.run(app, log_level='info',
                                loop="asyncio", **uvicorn_config))  # type: ignore
    else:
        uvicorn.run(app, log_level='info',
                    loop="asyncio", **uvicorn_config)
