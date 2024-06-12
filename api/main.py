from fastapi import FastAPI

from routers.main import api_router

from routers.account.crud import init_db

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

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
async def root():
    return {"message": "Hello World"}
