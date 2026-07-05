from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=100, description="Name of the user")
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100, description="Password of the user")
    bio: Optional[str] = Field(None, max_length=200, description="Bio of the user")

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=3, max_length=100)
    bio: Optional[str] = Field(None, max_length=200)
    avatar: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    avatar: Optional[str] = None
    bio: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class UserInDB(UserResponse):
    hashed_password: str
