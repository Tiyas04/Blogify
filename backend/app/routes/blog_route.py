from fastapi import APIRouter, Depends, File, Form, Query, UploadFile, status
from app.dependencies.auth_dependency import get_current_user
from app.schemas.blog_schema import BlogCreate, BlogUpdate
from app.services.blog_service import create_blog, get_all_blogs, get_blog_by_id, update_blog, delete_blog

router = APIRouter(
    prefix="/blogs",
    tags=["Blogs"]
)

@router.post(
    "/create-blog",
    status_code=status.HTTP_201_CREATED
)
async def create_blog_route(
    title: str = Form(...),
    content: str = Form(...),
    category: str = Form(...),
    tags: str = Form(""),
    cover_image: UploadFile | None = File(None),
    current_user=Depends(get_current_user),
):
    blog = BlogCreate(
        title=title,
        content=content,
        category=category,
        tags=[tag.strip() for tag in tags.split(",") if tag.strip()],
    )

    return await create_blog(
        blog,
        current_user,
        cover_image,
    )

@router.get(
    "/get-all-blogs",
     status_code=status.HTTP_200_OK,
)
async def get_all_blogs_route(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    search: str | None = None,
    category: str | None = None,
    sort: str = "latest",
):
    return await get_all_blogs(
        page,
        limit,
        search,
        category,
        sort
    )

@router.get(
    "/{blog_id}",
    status_code=status.HTTP_200_OK
)
async def get_blog_by_id_route(blog_id:str):
    return await get_blog_by_id(blog_id)

@router.patch(
    "/update-blog/{blog_id}",
    status_code=status.HTTP_200_OK
)
async def update_blog_route(
    blog_id: str,
    title: str | None = Form(None),
    content: str | None = Form(None),
    category: str | None = Form(None),
    tags: str | None = Form(None),
    cover_image: UploadFile | None = File(None),
    current_user=Depends(get_current_user),
):
    blog = BlogUpdate(
        title=title,
        content=content,
        category=category,
        tags=[
            tag.strip()
            for tag in tags.split(",")
        ] if tags else None,
    )

    return await update_blog(
        blog_id,
        blog,
        current_user,
        cover_image,
    )

@router.delete(
    "/delete-blog/{blog_id}",
    status_code=status.HTTP_200_OK
)
async def delete_blog_route(
    blog_id: str,
    current_user=Depends(get_current_user),
):
    return await delete_blog(
        blog_id,
        current_user
    )