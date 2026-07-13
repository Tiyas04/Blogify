from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
import bcrypt
from app.config.settings import (ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, 
                            REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY)

def hash_password(password: str) -> str:
    # Direct bcrypt hashing (utf-8 encoded)
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(password: str, hashed_password: str) -> bool:
    # Direct bcrypt verification
    try:
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        return False

def create_access_token(data:dict) -> str:
    payload = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRY
    )

    payload.update({
        "exp":expire
    })

    return jwt.encode(
        payload,
        ACCESS_TOKEN_SECRET,
        algorithm="HS256"
    )

def create_refresh_token(data:dict) -> str:
    payload = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        days=REFRESH_TOKEN_EXPIRY
    )

    payload.update({
        "exp": expire
    })

    return jwt.encode(
        payload,
        REFRESH_TOKEN_SECRET,
        algorithm="HS256"
    )

def verify_access_token(token:str):
    try:
        payload = jwt.decode(
            token,
            ACCESS_TOKEN_SECRET,
            algorithms=["HS256"]
        )

        return payload
    except JWTError:
        return None

def verify_refresh_token(token:str):
    try:
        payload = jwt.decode(
            token,
            REFRESH_TOKEN_SECRET,
            algorithms=["HS256"]
        )

        return payload
    except JWTError:
        return None