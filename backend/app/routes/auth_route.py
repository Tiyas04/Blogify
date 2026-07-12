from fastapi import APIRouter, status, UploadFile, File, Form, Response, Depends
from app.schemas.user_schema import UserCreate, UserLogin, UserUpdate
from app.services.auth_service import register_user, login_user, logout_user, update_user, get_user
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

@router.patch(
    "/update-profile",
    status_code = status.HTTP_200_OK
)
async def update_profile(
    response: Response,
    current_user= Depends(get_current_user),
    name: str = Form(...),
    bio: str | None = Form(None),
    avatar: UploadFile | None = File(None),
):
    user = UserUpdate(
        name = name,
        bio = bio
    )

    result = await update_user(current_user["id"], user, avatar)
    
    return {
        "success": result["success"],
        "message": result["message"],
        "data": result["data"]
    }

@router.get(
    "/profile",
    status_code=status.HTTP_200_OK
)
async def get_profile(current_user= Depends(get_current_user)):

    result = await get_user(current_user["id"])

    return {
        "success": result["success"],
        "message": result["message"],
        "data": result["data"]
    }