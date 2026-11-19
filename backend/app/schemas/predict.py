from pydantic import BaseModel, Field
from typing import Literal
class PredictionRequest(BaseModel):
    ad_spend: float = Field(..., ge=0, description="Amount spent on advertising")
    price: float = Field(..., ge=0, description="Price of the product")
    discount_rate: float = Field(..., ge=0, description="Discount applied (e.g., 0.10 for 10%)")
    campaign_duration_days: float = Field(..., ge=0, description="Length of the campaign in days")
    channel: Literal[
        'Search', 'Social Media', 'Affiliate', 'Email', 'TV', 'Influencer'
    ] = Field(..., description="Exact marketing channel")
class PredictionResponse(BaseModel):
    predicted_revenue: float