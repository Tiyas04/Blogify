from motor.motor_asyncio import AsyncIOMotorCollection
from motor.motor_asyncio import AsyncIOMotorDatabase
from motor.motor_asyncio import AsyncIOMotorClient
from motor.motor_asyncio import AsyncIOMotorDatabase, AsyncIOMotorCollection

USER_COLLECTIONS = "users"

def get_user_collection(
    database : AsyncIOMotorDatabase
) -> AsyncIOMotorCollection:
    return database[USER_COLLECTIONS]
