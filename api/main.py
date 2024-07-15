from fastapi import FastAPI
from fastapi_pagination import add_pagination

from routers.main import api_router

from dao.account import init_db

from db import SessionLocal

from config import settings


with SessionLocal() as session:
    init_db(session)

tags_metadata = [
    {
        "name": "magent",
        "description": "magent ",
    },
]
app = FastAPI(
    openapi_tags=tags_metadata,
    title="magent API",
    description="An opensource agent maker",
    version="v0.1.0",
)
add_pagination(app)

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
async def root():
    return {"message": "Hello World"}
