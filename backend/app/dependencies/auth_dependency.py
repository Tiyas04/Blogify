from fastapi import HTTPException, Request, Response, status
from app.config.security import verify_access_token, verify_refresh_token, create_access_token
from bson import ObjectId
from app.config.db import db
from app.models.user_model import get_user_collection

user = get_user_collection(db)

async def get_current_user(request: Request, response: Response):
    access_token = request.cookies.get("access_token")
    payload = None

    if access_token:
        payload = verify_access_token(access_token)

    # If access token is missing or expired, attempt to verify using refresh token
    if not payload:
        refresh_token = request.cookies.get("refresh_token")
        if not refresh_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session expired or credentials missing"
            )

        refresh_payload = verify_refresh_token(refresh_token)
        if not refresh_payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session expired, please sign in again"
            )

        # Retrieve user and verify the token matches the one in DB
        current_user = await user.find_one({"_id": ObjectId(refresh_payload["id"])})
        if not current_user or current_user.get("refresh_token") != refresh_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid session, please sign in again"
            )

        # Generate a new access token
        new_payload = {
            "id": str(current_user["_id"]),
            "email": current_user["email"]
        }
        new_access_token = create_access_token(new_payload)

        # Auto-update the client access token cookie
        response.set_cookie(
            key="access_token",
            value=new_access_token,
            httponly=True,
            secure=False,
            samesite="lax",
            max_age=60 * 30, # 30 minutes
        )
        current_user["id"] = str(current_user.pop("_id"))
    else:
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