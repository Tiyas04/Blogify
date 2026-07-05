from pymongo import ReturnDocument
from datetime import datetime, timezone
from fastapi import HTTPException, status, UploadFile
from bson import ObjectId
from app.config.db import db
from app.config.security import hash_password,verify_password,create_refresh_token,create_access_token
from app.models.user_model import get_user_collection
from app.schemas.user_schema import UserCreate, UserLogin, UserUpdate, UserResponse
from app.utils.cloudinary import upload_to_cloudinary, delete_from_cloudinary

users = get_user_collection(db)

async def register_user(
    user: UserCreate,
    avatar:UploadFile | None=None
    ):

    existing_user = await users.find_one({"email":user.email})

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already exists"
        )

    hashed_password = hash_password(user.password)

    avatar_url = None
    avatar_public_id = None

    if avatar:
        uploaded_avatar = await upload_to_cloudinary(
            avatar,
            "blogify/users"
        )

        avatar_url = uploaded_avatar["url"]
        avatar_public_id = uploaded_avatar["public_id"]

    user_document = {
        "name":user.name,
        "email":user.email,
        "avatar":avatar_url,
        "avatar_public_id":avatar_public_id,
        "bio":user.bio,
        "password":hashed_password,
        "refresh_token":None,
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

    await users.update_one(
        {
            "_id":result.inserted_id
        },
        {
            "$set":{
                "refresh_token" : refresh_token
            }
        }
    )

    return {
        "success":True,
        "message": "User registered successfully",
        "data": {
            "id": str(result.inserted_id),
            "name": user.name,
            "email": user.email,
            "avatar": avatar_url,
            "bio": user.bio,
        },
        "tokens":{
            "access_token": access_token,
            "refresh_token": refresh_token,
        }
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

    await users.update_one(
        {
            "_id":existing_user["_id"]
        },
        {
            "$set":{
                "refresh_token": refresh_token,
                "updated_at":datetime.now(timezone.utc)
            }
        }
    )    

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
        "tokens":{
            "access_token": access_token,
            "refresh_token": refresh_token,
        }
    }

async def logout_user(user_id:str):
    await users.update_one(
        {
            "_id":ObjectId(user_id)
        },
        {
            "$set":{
                "refresh_token":None,
                "updated_at":datetime.now(timezone.utc)
            }
        }
    )

    return True

async def update_user(
    user_id:str,
    user: UserUpdate,
    avatar: UploadFile | None = None
):

    existing_user = await users.find_one(
        {
            "_id":ObjectId(user_id)
        }
    )

    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    updated_data = user.model_dump(exclude_unset=True)

    if avatar:
        if existing_user.get("avatar_public_id"):
            await delete_from_cloudinary(existing_user["avatar_public_id"])
        
        uploaded_avatar = await upload_to_cloudinary(
            avatar,
            "blogify/users"
        )

        updated_data["avatar"] = uploaded_avatar["url"]
        updated_data["avatar_public_id"] = uploaded_avatar["public_id"]

    if not updated_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No data provided to update",
        )

    updated_data["updated_at"] = datetime.now(timezone.utc)

    updated_user = await users.find_one_and_update(
        {
            "_id": ObjectId(user_id)
        },
        {
            "$set": updated_data
        },
        return_document=ReturnDocument.AFTER
    )

    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile could not be updated"
        )

    return {
        "success": True,
        "message": "Profile updated successfully",
        "data": {
            "_id": str(updated_user["_id"]),
            "name": updated_user.get("name"),
            "email": updated_user.get("email"),
            "avatar": updated_user.get("avatar"),
            "bio": updated_user.get("bio")
        }
    }

async def get_user(user_id:str):
    existing_user = await users.find_one(
        {
            "_id":ObjectId(user_id)
        }
    )

    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return {
        "success": True,
        "message": "User profile retrieved successfully",
        "data": UserResponse(
            id = str(existing_user["_id"]),
            name = existing_user.get("name"),
            email = existing_user.get("email"),
            avatar = existing_user.get("avatar"),
            bio = existing_user.get("bio"),
            created_at = existing_user.get("created_at"),
            updated_at = existing_user.get("updated_at")
        )
    }