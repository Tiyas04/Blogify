import cloudinary
import cloudinary.uploader
from fastapi import UploadFile
from app.config.settings import CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

cloudinary.config(
    cloud_name = CLOUDINARY_CLOUD_NAME,
    api_key = CLOUDINARY_API_KEY,
    api_secret = CLOUDINARY_API_SECRET, 
    secure = True
)

async def upload_to_cloudinary(
    file: UploadFile,
    folder: str
):
    result = cloudinary.uploader.upload(
        file=file.file,
        folder=folder,
        
    )

    return {
        "url":result["secure_url"],
        "public_id": result["public_id"]
    }

async def delete_from_cloudinary(public_id: str):
    return cloudinary.uploader.destroy(public_id)