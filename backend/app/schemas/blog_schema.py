from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class AuthorInfo(BaseModel):
    id: str
    name: str
    avatar: Optional[str] = None


class BlogCreate(BaseModel):
    title: str = Field(..., min_length=5, max_length=150)
    content: str = Field(..., min_length=20)
    category: str = Field(..., max_length=50)
    tags: list[str] = []


class BlogUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=5, max_length=150)
    content: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[list[str]] = None


class BlogResponse(BaseModel):
    id: str
    title: str
    content: str
    cover_image: Optional[str] = None
    category: str
    tags: list[str]
    author: AuthorInfo
    likes_count: int
    comments_count: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)