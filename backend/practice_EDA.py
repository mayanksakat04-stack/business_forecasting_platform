# import kagglehub

# # Download latest version
# path = kagglehub.dataset_download("amineipad/e-commerce-marketing-and-sales-revenue-prediction")

# print("Path to dataset files:", path)

import pandas as pd

# Load the CSV file into a DataFrame
df = pd.read_csv("/home/mayank-sakat/.cache/kagglehub/datasets/amineipad/e-commerce-marketing-and-sales-revenue-prediction/versions/1/train.csv")
print(df.head())
print("\nDataFrame Info:")
print(df.info())