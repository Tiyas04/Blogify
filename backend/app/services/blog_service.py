from app.utils.cloudinary import delete_from_cloudinary
from pymongo import ASCENDING, DESCENDING
from bson import ObjectId
from datetime import datetime, timezone
from fastapi import HTTPException, UploadFile, status
from app.config.db import db
from app.models.blog_model import get_blog_collection
from app.schemas.blog_schema import BlogCreate, BlogUpdate
from app.utils.cloudinary import upload_to_cloudinary

blogs = get_blog_collection(db)

async def create_blog(blog: BlogCreate, current_user: dict, cover_image: UploadFile | None = None):

    cover_image_url = None
    cover_image_public_id = None

    if cover_image:
        upload_cover_image = await upload_to_cloudinary(
            cover_image,
            "blogify/blogs"
        )
        
        cover_image_url = upload_cover_image["url"]
        cover_image_public_id = upload_cover_image["public_id"]

    author_info = {
        "id": current_user["id"],
        "name": current_user.get("name", ""),
        "email": current_user.get("email", ""),
        "avatar": current_user.get("avatar") or current_user.get("avatar_url")
    }

    blog_document = {
        "title": blog.title,
        "content": blog.content,
        "category": blog.category,
        "tags": blog.tags,
        "cover_image_public_id": cover_image_public_id,
        "cover_image_url": cover_image_url,
        "author": author_info,
        "likes_count": 0,
        "comments_count": 0,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }

    result = await blogs.insert_one(blog_document)

    blog_data = {
        "id": str(result.inserted_id),
        "title": blog.title,
        "content": blog.content,
        "category": blog.category,
        "tags": blog.tags,
        "cover_image_public_id": cover_image_public_id,
        "cover_image_url": cover_image_url,
        "author": author_info,
        "likes_count": 0,
        "comments_count": 0,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }

    return {
        "success": True,
        "message": "Blog created successfully",
        "data": blog_data
    }

async def get_all_blogs(
    page: int = 1,
    limit: int = 10,
    search: str | None = None,
    category: str | None = None,
    sort: str = "latest",
    ):
    
    query = {}

    if search:
        query["title"] = {
            "$regex": search,
            "$options": "i"
        }
    
    if category:
        query["category"] = category

    skip = (page -1 ) * limit

    sort_order = DESCENDING

    if sort =="oldest":
        sort_order = ASCENDING

    cursor = (
        blogs.find(query)
        .sort("created_at", sort_order)
        .skip(skip)
        .limit(limit)
    )

    blog_list = await cursor.to_list(length=limit)

    total = await blogs.count_documents(query)

    for blog in blog_list:
        blog["id"] = str(blog.pop("_id"))
        blog.pop("cover_image_public_id",None)

    return {
        "success":True,
        "data":blog_list,
        "pagination":{
            "total_blogs":total,
            "page":page,
            "limit":limit,
            "pages":(total + limit -1) // limit
        }
    }
    
async def get_blog_by_id(blog_id: str):
    if not blog_id or not ObjectId.is_valid(blog_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid blog ID format"
        )
    
    blog = await blogs.find_one(
        {
            "_id": ObjectId(blog_id)
        }
    )

    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found"
        )

    blog["id"] = str(blog.pop("_id"))
    blog.pop("cover_image_public_id", None)

    return {
        "success": True,
        "message": "Blog fetched successfully",
        "data": blog
    }

async def update_blog(
    blog_id: str,
    blog: BlogUpdate,
    current_user: dict,
    cover_image: UploadFile | None = None
):
    if not blog_id or not ObjectId.is_valid(blog_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid blog ID format"
        )

    object_id = ObjectId(blog_id)

    existing_blog = await blogs.find_one(
        {
            "_id": object_id
        }
    )

    if not existing_blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found"
        )

    if existing_blog["author"]["id"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to update this blog"
        )
    
    update_data = blog.model_dump(exclude_unset=True)

    if cover_image:

        if existing_blog.get("cover_image_public_id"):
            await delete_from_cloudinary(
                existing_blog["cover_image_public_id"]
            )

        uploaded_image = await upload_to_cloudinary(
            cover_image,
            "blogify/blogs"
        )

        update_data["cover_image_url"] = uploaded_image["url"]
        update_data["cover_image_public_id"] = uploaded_image["public_id"]

    update_data["updated_at"] = datetime.now(timezone.utc)

    await blogs.update_one(
        {
            "_id": object_id
        },
        {
            "$set": update_data
        }
    )

    updated_blog = await blogs.find_one({
        "_id": object_id
    })

    if not updated_blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found after update"
        )

    updated_blog["id"] = str(updated_blog.pop("_id"))
    updated_blog.pop("cover_image_public_id", None)

    return {
        "success": True,
        "message": "Blog updated successfully",
        "data": updated_blog
    }

async def delete_blog(
    blog_id: str,
    current_user: dict
):
    if not blog_id or not ObjectId.is_valid(blog_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid blog ID format"
        )

    object_id = ObjectId(blog_id)

    existing_blog = await blogs.find_one(
        {
            "_id": object_id
        }
    )

    if not existing_blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found"
        )

    if existing_blog["author"]["id"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to delete this blog"
        )
    
    if existing_blog.get("cover_image_public_id"):
        await delete_from_cloudinary(
            existing_blog["cover_image_public_id"]
        )

    await blogs.delete_one(
        {
            "_id": object_id
        }
    )

    return {
        "success": True,
        "message": "Blog deleted successfully"
    }