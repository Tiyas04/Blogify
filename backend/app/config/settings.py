import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI: str = os.getenv("MONGODB_URI", "")
DATABASE_NAME: str = os.getenv("DATABASE_NAME", "Blogify")
PORT: int = int(os.getenv("PORT", "8000"))
HOST: str = os.getenv("HOST", "127.0.0.1")
LIVE_URL: str = os.getenv("LIVE_URL","")

ACCESS_TOKEN_SECRET: str = os.getenv("ACCESS_TOKEN_SECRET", "")
ACCESS_TOKEN_EXPIRY: int = int(os.getenv("ACCESS_TOKEN_EXPIRY", 30))
REFRESH_TOKEN_SECRET: str = os.getenv("REFRESH_TOKEN_SECRET", "")
REFRESH_TOKEN_EXPIRY: int = int(os.getenv("REFRESH_TOKEN_EXPIRY", 7))

CLOUDINARY_CLOUD_NAME: str = os.getenv("CLOUDINARY_CLOUD_NAME","")
CLOUDINARY_API_KEY: str = os.getenv("CLOUDINARY_API_KEY","")
CLOUDINARY_API_SECRET: str = os.getenv("CLOUDINARY_API_SECRET","")