from fastapi import HTTPException, Request, status
from app.config.security import verify_access_token
from bson import ObjectId
from app.config.db import db
from app.models.user_model import get_user_collection

user = get_user_collection(db)

async def get_current_user(request: Request):
    access_token = request.cookies.get("access_token")

    if not access_token:
        raise HTTPException(
            status_code= status.HTTP_401_UNAUTHORIZED,
            detail="NO access token found"
        )

    payload = verify_access_token(access_token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    current_user = await user.find_one({"_id": ObjectId(payload["id"])})

    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    current_user["id"] = str(current_user.pop("_id"))

    current_user.pop("password", None)
    current_user.pop("refresh_token", None)
    current_user.pop("avatar_public_id", None)
    current_user.pop("refresh_token_exp", None)

    return current_user