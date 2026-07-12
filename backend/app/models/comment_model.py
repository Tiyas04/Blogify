from motor.motor_asyncio import AsyncIOMotorDatabase, AsyncIOMotorCollection

comment_collection = "comments"

def get_comment_collection(
    database: AsyncIOMotorDatabase
) -> AsyncIOMotorCollection:
    return database[comment_collection]