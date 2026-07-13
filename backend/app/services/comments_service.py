from app.schemas.comment_schema import CommentUpdate
from pymongo import DESCENDING
from datetime import datetime, timezone
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status
from app.config.db import db
from app.models.blog_model import get_blog_collection
from app.models.comment_model import get_comment_collection
from app.schemas.comment_schema import CommentCreate

blogs = get_blog_collection(db)
comments = get_comment_collection(db)

async def create_comment(
    blog_id: str,
    comment: CommentCreate,
    current_user: dict
):
    if not current_user or not isinstance(current_user, dict) or "id" not in current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required to comment on a blog",
        )

    try:
        object_id = ObjectId(blog_id)
    except InvalidId:
        raise HTTPException(
            status_code = status.HTTP_400_BAD_REQUEST,
            detail = "Invalid blog id"
        )

    existing_blog = await blogs.find_one(
        {
            "_id": object_id
        }
    )

    if not existing_blog:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "Blog not found"
        )

    comment_document = {
        "blog_id": blog_id,
        "author_id":current_user["id"],
        "author":{
            "id":current_user["id"],
            "name":current_user["name"],
            "avatar":current_user.get('avatar')
        },
        "content":comment.content,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }

    result = await comments.insert_one(comment_document)

    await blogs.update_one(
        {
            "_id":object_id
        },
        {
            "$inc":{
                "comments_count":1
            }
        }
    )

    return {
        "success": True,
        "message": "Comment added successfully",
        "data":{
            "id":str(result.inserted_id),
            **comment_document
        }
    }

async def get_all_comments(
    blog_id:str
):
    try:
        object_id = ObjectId(blog_id)

    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid blog id"
        )

    existing_blog = await blogs.find_one(
        {
            "_id": object_id
        }
    )

    if not existing_blog:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "Blog not found"
        )

    cursor = comments.find(
        {
            "blog_id":blog_id
        }
    ).sort(
        "created_at",
        DESCENDING
    )

    comment_list = await cursor.to_list(length=None)

    for comment in comment_list:
        comment["id"] = str(comment.pop("_id"))

    return {
        "success": True,
        "message": "Comments fetched successfully",
        "count": len(comment_list),
        "data": comment_list
    }

async def update_comment(
    comment_id:str,
    comment:CommentUpdate,
    current_user:dict
):
    if not current_user or not isinstance(current_user, dict) or "id" not in current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required to edit comments",
        )

    try:
        object_id = ObjectId(comment_id)

    except InvalidId:
        raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Invalid comment id"
        )

    existing_comment = await comments.find_one(
        {
            "_id":object_id
        }
    )

    if not existing_comment:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "Comment not found"
        )

    if existing_comment["author_id"] != current_user["id"]:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = "You are not authorized to edit this comment"
        )

    update_data = comment.model_dump(
        exclude_unset=True
    )

    update_data["updated_at"] = datetime.now(timezone.utc)

    await comments.update_one(
        {
            "_id":object_id
        },
        {
            "$set": update_data
        }
    )

    updated_comment = await comments.find_one(
        {
            "_id":object_id
        }
    )

    if not updated_comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found after update"
        )

    updated_comment["id"] = str(updated_comment.pop("_id"))

    return {
    "success": True,
    "message": "Comment updated successfully",
    "data": updated_comment,
    }

async def delete_comment(
    comment_id:str,
    current_user:dict
):
    if not current_user or not isinstance(current_user, dict) or "id" not in current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required to delete comments",
        )

    try:
        object_id = ObjectId(comment_id)

    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid comment id"
        )

    existing_comment = await comments.find_one(
        {
            "_id":object_id
        }
    )

    if not existing_comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )

    if existing_comment["author_id"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You are not authorized to delete this comment"
        )

    await comments.delete_one(
        {
            "_id":object_id
        }
    )

    await blogs.update_one(
        {
            "_id": ObjectId(existing_comment["blog_id"])
        },
        {
            "$inc":{
                "comments_count":-1
            }
        }
    )

    return {
        "success": True,
        "message": "Comment deleted successfully",
    }