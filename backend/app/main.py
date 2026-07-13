from app.config.settings import LIVE_URL
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.db import db
from app.routes.auth_route import router as auth_router
from app.routes.blog_route import router as blog_router
from app.routes.comment_route import router as comment_router
from app.routes.likes_route import router as likes_router

origins = [
    LIVE_URL,
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174"
]

app = FastAPI(
    title="Blogify",
    description="A blogging website",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
app.include_router(blog_router)
app.include_router(comment_router)
app.include_router(likes_router)