from motor.motor_asyncio import AsyncIOMotorDatabase, AsyncIOMotorCollection

USER_COLLECTIONS = "users"

def get_user_collection(
    database : AsyncIOMotorDatabase
) -> AsyncIOMotorCollection:
    return database[USER_COLLECTIONS]
    