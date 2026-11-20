from contextlib import asynccontextmanager
from typing import Annotated

import joblib
import pandas as pd
from app.core.database import Base, engine, get_db
from app.models.scenario import SavedScenario
from app.schemas.predict import PredictionRequest, PredictionResponse
from app.schemas.scenario import ScenarioCreate, ScenarioResponse
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# 1. Establish Database Tables
Base.metadata.create_all(bind=engine)

# 2. Global Dictionary to hold models in RAM
ml_models = {}

# 3. The Lifespan Manager: Loads the model ONCE when the server boots
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("SERVER BOOT: Loading Machine Learning models into memory...")
    try:
        # Load the frozen .joblib file into our global dictionary
        ml_models["sales_model"] = joblib.load("app/ml/models/sales_model.joblib")
    except Exception as e:  # noqa: BLE001
        print(f"CRITICAL: Failed to load model. Error: {e}")
    
    yield  # The server accepts HTTP requests here
    
    print("SERVER SHUTDOWN: Purging models from memory...")
    ml_models.clear()

# 4. Initialize FastAPI with the lifespan manager
app = FastAPI(title="Business Dashboard API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Explicitly trust Next.js
    allow_credentials=True,
    allow_methods=["*"], # Allow GET, POST, etc.
    allow_headers=["*"],
)
@app.get("/")
def read_root():
    return {"status": "Backend, Database, and ML Handshake Successful"}

# 5. The Predictive Endpoint
@app.post("/api/v1/predict", response_model=PredictionResponse)
def predict_revenue(request: PredictionRequest):
    model = ml_models.get("sales_model")
    if not model:
        raise HTTPException(status_code=503, detail="Model not loaded into memory.")
    
    # 1. Map the 4 inputs into a 2D structure exactly matching the Kaggle columns
    input_data = pd.DataFrame([{
        "ad_spend": request.ad_spend,
        "price": request.price,
        "discount_rate": request.discount_rate,
        "campaign_duration_days": request.campaign_duration_days,
        "channel": request.channel
    }])
    
    # 2. Execute the multi-variable math
    prediction = model.predict(input_data)
    
    return {"predicted_revenue": round(prediction[0], 2)}

@app.post("/api/v1/scenarios", response_model=ScenarioResponse)
def save_scenario(
    scenario: ScenarioCreate,
    db: Annotated[Session, Depends(get_db)],
):
    db_scenario = SavedScenario(**scenario.model_dump())
    db.add(db_scenario)
    db.commit()
    db.refresh(db_scenario)
    return db_scenario


@app.get("/api/v1/scenarios", response_model=list[ScenarioResponse])
def get_scenarios(db: Annotated[Session, Depends(get_db)]):
    return db.query(SavedScenario).order_by(SavedScenario.created_at.desc()).all()