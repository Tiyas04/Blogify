from fastapi import APIRouter, Depends, Path, status
from app.dependencies.auth_dependency import get_current_user
from app.services.likes_service import toggle_like, get_blog_likes, is_blog_liked

router = APIRouter(
    prefix="/likes",
    tags=["Likes"],
)

@router.post(
    "/blog/{blog_id}",
    status_code=status.HTTP_200_OK,
)
async def toggle_like_route(
    blog_id: str = Path(...),
    current_user=Depends(get_current_user),
):
    return await toggle_like(
        blog_id,
        current_user,
    )

@router.get(
    "/blog/{blog_id}",
    status_code=status.HTTP_200_OK,
)
async def get_blog_likes_route(
    blog_id: str = Path(...),
):
    return await get_blog_likes(blog_id)

@router.get(
    "/blog/{blog_id}/liked",
    status_code=status.HTTP_200_OK,
)
async def is_blog_liked_route(
    blog_id: str = Path(...),
    current_user=Depends(get_current_user),
):
    return await is_blog_liked(
        blog_id,
        current_user,
    )