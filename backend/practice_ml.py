import pandas as pd
from sklearn.linear_model import LinearRegression

# 1. THE HISTORICAL DATA (The "Answers")
# We use Pandas to create a basic table (DataFrame).
# In the real world, this data would come from your PostgreSQL database.
data = {
    "ad_spend": [100, 200, 300, 400, 500],
    "revenue": [250, 450, 650, 850, 1050]
}
df = pd.DataFrame(data)

print("--- Historical Data ---")
print(df)
print("\n")

# 2. PREPARING THE FEATURES (X) AND TARGET (y)
# Scikit-Learn expects 'X' (inputs) to be a 2D array/table, even if it's just one column.
# It expects 'y' (output) to be a 1D array/list.
X = df[["ad_spend"]] 
y = df["revenue"]

# 3. TRAINING THE ALGORITHM
# We initialize the model and run .fit(). 
# This is where the calculus happens to find 'm' (weight) and 'b' (intercept).
model = LinearRegression()
model.fit(X, y)

print("--- The Math Behind the Curtain ---")
print(f"Multiplier (m): {model.coef_[0]}")
print(f"Baseline (b): {model.intercept_}")
print("\n")

# 4. MAKING A PREDICTION
# We want to know the revenue if a client spends $600 on ads.
# We must pass the input in the exact same 2D format as the training data.
new_client_spend = pd.DataFrame({"ad_spend": [600]})
predicted_revenue = model.predict(new_client_spend)

print("--- The Prediction ---")
print(f"If you spend $600, predicted revenue is: ${predicted_revenue[0]:.2f}")