from datetime import datetime
from pydantic import BaseModel, ConfigDict


class LikeResponse(BaseModel):
    id: str
    blog_id: str
    user_id: str
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )