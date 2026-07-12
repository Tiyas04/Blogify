from fastapi import APIRouter, Depends, Path, status
from app.dependencies.auth_dependency import get_current_user
from app.schemas.comment_schema import CommentCreate, CommentUpdate
from app.services.comments_services import create_comment, get_all_comments, update_comment, delete_comment

router = APIRouter(
    prefix="/comments",
    tags=["Comments"],
)

@router.post(
    "/blog/{blog_id}",
    status_code=status.HTTP_201_CREATED
)
async def create_comment_route(
    comment: CommentCreate,
    blog_id: str = Path(...),
    current_user=Depends(get_current_user),
):
    return await create_comment(blog_id, comment, current_user)

@router.get(
    "/blog/{blog_id}",
    status_code=status.HTTP_200_OK
)
async def get_all_comments_route(
    blog_id: str = Path(...),
):
    return await get_all_comments(blog_id)

@router.put(
    "/{comment_id}",
    status_code=status.HTTP_200_OK
)
async def update_comment_route(
    comment: CommentUpdate,
    comment_id: str = Path(...),
    current_user=Depends(get_current_user),
):
    return await update_comment(comment_id, comment, current_user)

@router.delete(
    "/{comment_id}",
    status_code=status.HTTP_200_OK
)
async def delete_comment_route(
    comment_id: str = Path(...),
    current_user=Depends(get_current_user),
):
    return await delete_comment(comment_id, current_user)
