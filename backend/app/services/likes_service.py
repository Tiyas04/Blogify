from datetime import datetime, timezone
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status
from app.config.db import db
from app.models.blog_model import get_blog_collection
from app.models.likes_model import get_like_collection

blogs = get_blog_collection(db)
likes = get_like_collection(db)

async def toggle_like(
    blog_id: str,
    current_user: dict,
):
    if not current_user or not isinstance(current_user, dict) or "id" not in current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required to like a blog",
        )

    try:
        object_id = ObjectId(blog_id)

    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid blog id",
        )

    existing_blog = await blogs.find_one(
        {
            "_id": object_id
        }
    )

    if not existing_blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found",
        )

    existing_like = await likes.find_one(
        {
            "blog_id": blog_id,
            "user_id": current_user["id"],
        }
    )

    if existing_like:

        await likes.delete_one(
            {
                "_id": existing_like["_id"]
            }
        )

        await blogs.update_one(
            {
                "_id": object_id
            },
            {
                "$inc": {
                    "likes_count": -1
                }
            }
        )

        return {
            "success": True,
            "liked": False,
            "message": "Blog unliked successfully",
        }

    like_document = {
        "blog_id": blog_id,
        "user_id": current_user["id"],
        "created_at": datetime.now(timezone.utc),
    }

    await likes.insert_one(
        like_document
    )

    await blogs.update_one(
        {
            "_id": object_id
        },
        {
            "$inc": {
                "likes_count": 1
            }
        }
    )

    return {
        "success": True,
        "liked": True,
        "message": "Blog liked successfully",
    }

async def get_blog_likes(
    blog_id: str,
):

    try:
        object_id = ObjectId(blog_id)

    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid blog id",
        )

    existing_blog = await blogs.find_one(
        {
            "_id": object_id
        }
    )

    if not existing_blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found",
        )

    return {
        "success": True,
        "message": "Likes fetched successfully",
        "likes_count": existing_blog["likes_count"],
    }

async def is_blog_liked(
    blog_id: str,
    current_user: dict,
):
    if not current_user or not isinstance(current_user, dict) or "id" not in current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required to check like status",
        )

    try:
        object_id = ObjectId(blog_id)

    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid blog id",
        )

    existing_blog = await blogs.find_one(
        {
            "_id": object_id
        }
    )

    if not existing_blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found",
        )

    existing_like = await likes.find_one(
        {
            "blog_id": blog_id,
            "user_id": current_user["id"],
        }
    )

    return {
        "success": True,
        "liked": existing_like is not None,
    }