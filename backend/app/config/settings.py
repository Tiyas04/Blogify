import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI: str = os.getenv("MONGODB_URI", "")
DATABASE_NAME: str = os.getenv("DATABASE_NAME", "Blogify")
PORT: int = int(os.getenv("PORT", "8000"))
HOST: str = os.getenv("HOST", "127.0.0.1")