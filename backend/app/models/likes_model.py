from motor.motor_asyncio import AsyncIOMotorCollection, AsyncIOMotorDatabase

LIKE_COLLECTION = "likes"

def get_like_collection(
    database: AsyncIOMotorDatabase,
) -> AsyncIOMotorCollection:
    return database[LIKE_COLLECTION]