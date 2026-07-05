from jose import JWTError
from fastapi import Depends, HTTPException, Request, status
from app.config.security import verify_access_token

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

    return payload