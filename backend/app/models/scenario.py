from app.core.database import Base
from sqlalchemy import Column, DateTime, Float, Integer, String
from sqlalchemy.sql import func


class SavedScenario(Base):
    __tablename__ = "saved_scenarios"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)  # e.g., "Strategy A - Q4 Push"
    channel = Column(String, nullable=False)
    ad_spend = Column(Float, nullable=False)
    price = Column(Float, nullable=False)
    discount_rate = Column(Float, nullable=False)
    campaign_duration_days = Column(Float, nullable=False)
    predicted_revenue = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())