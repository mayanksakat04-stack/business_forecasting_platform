from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import String, Float, DateTime
from datetime import datetime

# 1. We create a Base class. All our models will inherit from this.
# SQLAlchemy uses this registry to know which tables to create in the DB.
class Base(DeclarativeBase):
    pass

# 2. We define our Model. This represents a table in PostgreSQL.
class Sale(Base):
    __tablename__ = "sales"

    # 3. Modern SQLAlchemy uses Mapped[] for strict static typing. 
    # This gives you autocomplete in your IDE and catches errors before runtime.
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    product_name: Mapped[str] = mapped_column(String(100), nullable=False)
    revenue: Mapped[float] = mapped_column(Float, nullable=False)
    
    # 4. We pass a default factory so the DB automatically stamps the time of insertion.
    date_recorded: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)