from fastapi import FastAPI
from app.config.db import db
from app.routes.auth_route import router as auth_router

app = FastAPI(
    title="Blogify",
    description="A blogging website",
    version="1.0.0"
)

@app.get("/")
async def home():
    return {
        "message":"Welcome to blogify"
    }

@app.get("/health")
async def health():
    collections = await db.list_collection_names()

    return {
        "status": "Connected",
        "collections": collections
    }

app.include_router(auth_router)
