export interface PredictionResponse {
    predicted_revenue: number;
}

export interface PredictionRequest {
    ad_spend: number;
    price: number;
    discount_rate: number;
    campaign_duration_days: number;
}

export const getPrediction = async (data: PredictionRequest): Promise<PredictionResponse> => {
    const response = await fetch("http://127.0.0.1:8000/api/v1/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch prediction from backend");
    }

    return response.json();
};