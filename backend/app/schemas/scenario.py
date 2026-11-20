from datetime import datetime
from typing import Literal
from pydantic import BaseModel, Field

class ScenarioCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    channel: Literal['Search', 'Social Media', 'Affiliate', 'Email', 'TV', 'Influencer']
    ad_spend: float = Field(..., ge=0)
    price: float = Field(..., ge=0)
    discount_rate: float = Field(..., ge=0)
    campaign_duration_days: float = Field(..., ge=0)
    predicted_revenue: float

class ScenarioResponse(ScenarioCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True  # Allows Pydantic to read SQLAlchemy ORM objects directly