from motor.motor_asyncio import AsyncIOMotorClient
from app.config.settings import MONGODB_URI, DATABASE_NAME

if not MONGODB_URI or not DATABASE_NAME:
    raise ValueError("MONGODB_URI and DATABASE_NAME must be set in environment variables.")

client = AsyncIOMotorClient(MONGODB_URI)
db = client[DATABASE_NAME]

print("MongoDB connection established")
