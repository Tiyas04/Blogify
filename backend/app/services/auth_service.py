from unicodedata import name
from datetime import datetime, timezone
from fastapi import HTTPException, status
from app.config.db import db
from app.config.security import hash_password,verify_password,create_refresh_token,create_access_token
from app.models.user_model import get_user_collection
from app.schemas.user_schema import UserCreate, UserLogin

users = get_user_collection(db)

async def register_user(user: UserCreate):

    existing_user = await users.find_one({"email":user.email})

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already exists"
        )

    hashed_password = hash_password(user.password)

    user_document = {
        "name":user.name,
        "email":user.email,
        "avatar":user.avatar,
        "bio":user.bio,
        "password":hashed_password,
        "created_at":datetime.now(timezone.utc),
        "updated_at":datetime.now(timezone.utc)
    }

    result = await users.insert_one(user_document)

    payload = {
        "id":str(result.inserted_id),
        "email":user.email
    }

    access_token = create_access_token(payload)
    refresh_token = create_refresh_token(payload)

    return {
        "success":True,
        "message": "User registered successfully",
        "data": {
            "id": str(result.inserted_id),
            "name": user.name,
            "email": user.email,
            "avatar": user.avatar,
            "bio": user.bio,
        },
        "access_token": access_token,
        "refresh_token": refresh_token,
    }

async def login_user(user: UserLogin):

    existing_user = await users.find_one(
        {"email": user.email}
    )

    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    if not verify_password(
        user.password,
        existing_user["password"],
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    payload = {
        "id": str(existing_user["_id"]),
        "email": existing_user["email"],
    }

    access_token = create_access_token(payload)
    refresh_token = create_refresh_token(payload)

    return {
        "success":True,
        "message": "User logged in successfully",
        "data": {
            "id": str(existing_user["_id"]),
            "name": existing_user["name"],
            "email": existing_user["email"],
            "avatar": existing_user.get("avatar"),
            "bio": existing_user.get("bio"),
        },
        "access_token": access_token,
        "refresh_token": refresh_token,
    }