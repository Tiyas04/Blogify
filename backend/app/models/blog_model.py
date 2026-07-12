from motor.motor_asyncio import AsyncIOMotorCollection, AsyncIOMotorDatabase

BLOG_COLLECTION = "blogs"

def get_blog_collection(
    database: AsyncIOMotorDatabase
) -> AsyncIOMotorCollection:
    return database[BLOG_COLLECTION]