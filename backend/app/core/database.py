from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

# 1. The Connection String (Format: dialect+driver://username:password@host:port/database)
# Replace these with your actual local PostgreSQL credentials
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:Admin%40123@localhost:5432/dashboard_db"

# 2. The Engine is the factory. It manages the connection pool.
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# 3. SessionLocal is a factory for individual database sessions. 
# We disable autocommit so we can control database transactions manually.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Our Base class for models (from our previous step)
class Base(DeclarativeBase):
    pass