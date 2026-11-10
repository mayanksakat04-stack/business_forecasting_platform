import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
import joblib
import os

print("1. Generating synthetic historical business data...")
# We set a 'seed' so the random numbers generate the exact same way every time you run it.
np.random.seed(42)
num_records = 500

# Generate 500 random ad spend values between $100 and $2,000
ad_spend = np.random.randint(100, 2000, num_records)

# We define a hidden "true" rule: Revenue = (2.5 * Ad Spend) + 1500
# But we inject "Noise" (random Gaussian variance between -$300 and +$300) 
# to simulate real-world unpredictability.
noise = np.random.normal(0, 300, num_records) 
revenue = (2.5 * ad_spend) + 1500 + noise

# Create the DataFrame and save it as a CSV so you can visually inspect it later
df = pd.DataFrame({"ad_spend": ad_spend, "revenue": revenue})
df.to_csv("synthetic_business_data.csv", index=False)
print(f"Generated {num_records} rows and saved to synthetic_business_data.csv")

print("\n2. Training the Machine Learning Algorithm...")
X = df[["ad_spend"]]
y = df["revenue"]

model = LinearRegression()
model.fit(X, y)

print("--- The Learned Mathematics ---")
print(f"Algorithm calculated Multiplier (m): {model.coef_[0]:.4f}")
print(f"Algorithm calculated Baseline (b): {model.intercept_:.4f}")

print("\n3. Freezing the Model for Production...")
# Create the models directory if it doesn't exist yet
os.makedirs("app/ml/models", exist_ok=True)

# Save the trained model to disk
model_path = "app/ml/models/sales_model.joblib"
joblib.dump(model, model_path)
print(f"Model successfully saved to: {model_path}")