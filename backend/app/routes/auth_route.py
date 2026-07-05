from fastapi import APIRouter, status, UploadFile, File, Form, Response, Depends
from app.schemas.user_schema import UserCreate, UserLogin
from app.services.auth_service import register_user, login_user, logout_user
from app.dependencies.auth_dependency import get_current_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
)
async def register(
    response: Response,
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    avatar: UploadFile | None = File(None),
    bio: str | None = Form(None)
):
    user = UserCreate(
        name=name,
        email=email,
        password=password,
        bio=bio,
    )

    result = await register_user(user, avatar)

    response.set_cookie(
        key="access_token",
        value=result["tokens"]["access_token"],
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 30,
    )

    response.set_cookie(
        key="refresh_token",
        value=result["tokens"]["refresh_token"],
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 60 * 24 * 7,
    )

    return {
        "success":result["success"],
        "message":result["message"],
        "data":result["data"]
    }

@router.post(
    "/login",
    status_code=status.HTTP_200_OK
)
async def login(
    response: Response,
    user: UserLogin
    ):
    result = await login_user(user)

    response.set_cookie(
        key="access_token",
        value=result["tokens"]["access_token"],
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60*30
    )

    response.set_cookie(
        key="refresh_token",
        value=result["tokens"]["refresh_token"],
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60*60*24*7
    )

    return{
        "success":result["success"],
        "message":result["message"],
        "data":result["data"]
    }

@router.post(
    "/logout",
    status_code=status.HTTP_200_OK
)
async def logout(
    response: Response,
    current_user= Depends(get_current_user)
):
    await logout_user(current_user["id"])

    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")

    return {
        "success":True,
        "message": "Logged out successfully",
        "data":None
    }