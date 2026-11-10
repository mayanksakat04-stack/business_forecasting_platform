from pydantic import BaseModel, Field

class PredictionRequest(BaseModel):
    ad_spend: float = Field(..., ge=0, description="Amount spent on advertising")
    price: float = Field(..., ge=0, description="Price of the product")
    discount_rate: float = Field(..., ge=0, description="Discount applied (e.g., 0.10 for 10%)")
    campaign_duration_days: float = Field(..., ge=0, description="Length of the campaign in days")

class PredictionResponse(BaseModel):
    predicted_revenue: float