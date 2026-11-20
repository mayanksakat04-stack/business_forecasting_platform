export interface PredictionResponse {
    predicted_revenue: number;
}

export interface PredictionRequest {
    ad_spend: number;
    price: number;
    discount_rate: number;
    campaign_duration_days: number;
    channel: string;
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


export interface ScenarioCreate {
    name: string;
    channel: string;
    ad_spend: number;
    price: number;
    discount_rate: number;
    campaign_duration_days: number;
    predicted_revenue: number;
}

export interface ScenarioResponse extends ScenarioCreate {
    id: number;
    created_at: string;
}

export async function saveScenario(data: ScenarioCreate): Promise<ScenarioResponse> {
    const response = await fetch("http://127.0.0.1:8000/api/v1/scenarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to save scenario");
    }
    return response.json();
}

export async function getScenarios(): Promise<ScenarioResponse[]> {
    const response = await fetch("http://127.0.0.1:8000/api/v1/scenarios");
    if (!response.ok) {
        throw new Error("Failed to fetch saved scenarios");
    }
    return response.json();
}

