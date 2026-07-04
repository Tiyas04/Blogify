from pymongo import database
from fastapi import FastAPI
from app.config.db import db

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
