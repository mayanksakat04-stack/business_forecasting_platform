from fastapi import FastAPI, HTTPException
from contextlib import asynccontextmanager
import joblib
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware # <-- NEW IMPORT
from app.core.database import engine, Base
from app.models.sales import Sale
from app.schemas.predict import PredictionRequest, PredictionResponse

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
    except Exception as e:
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
        "campaign_duration_days": request.campaign_duration_days
    }])
    
    # 2. Execute the multi-variable math
    prediction = model.predict(input_data)
    
    return {"predicted_revenue": round(prediction[0], 2)}