from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class CommentAuthor(BaseModel):
    id: str
    name:str
    avatar:Optional[str] = None

class CommentCreate(BaseModel):
    content: str = Field(..., min_length=1,max_length=1000, description="Comment Content")

class CommentUpdate(BaseModel):
    content: Optional[str] = Field(None, min_length=1,max_length=1000, description="Comment Content")

class CommentInDB(BaseModel):
    id: str
    blog_id: str
    author: CommentAuthor
    content: str
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)