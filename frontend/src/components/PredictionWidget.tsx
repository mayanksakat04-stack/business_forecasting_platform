"use client";
import { getPrediction } from "@/services/api";
import { useDebounce } from "@/hooks/useDebounce"; // Import your new mechanical gatekeeper
import React, { useEffect } from "react";

export const PredictionWidget = () => {
    // 1. The Raw, Instant State (updates instantly as the slider moves)
    const [adSpend, setAdSpend] = React.useState<number>(500);
    const [price, setPrice] = React.useState<number>(10);
    const [discountRate, setDiscountRate] = React.useState<number>(0.05);
    const [campaignDuration, setCampaignDuration] = React.useState<number>(7);
    
    const [revenue, setRevenue] = React.useState<number | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    // 2. The Debounced State (only updates when the user stops moving the sliders for 300ms)
    const debouncedAdSpend = useDebounce(adSpend, 300);
    const debouncedPrice = useDebounce(price, 300);
    const debouncedDiscount = useDebounce(discountRate, 300);
    const debouncedDuration = useDebounce(campaignDuration, 300);

    // 3. The Auto-Fetch Lifecycle
    // This useEffect watches the DEBOUNCED values, not the raw values.
    // It automatically calls FastAPI whenever the debounced values settle.
    useEffect(() => {
        const fetchPrediction = async () => {
            setError(null);
            try {
                const response = await getPrediction({
                    ad_spend: debouncedAdSpend,
                    price: debouncedPrice,
                    discount_rate: debouncedDiscount,
                    campaign_duration_days: debouncedDuration
                });
                setRevenue(response.predicted_revenue);
            } catch (err) {
                console.error("API Error:", err);
                setError("Failed to fetch prediction.");
            }
        };

        fetchPrediction();
    }, [debouncedAdSpend, debouncedPrice, debouncedDiscount, debouncedDuration]);

    return (
        <div className="flex flex-col w-full max-w-md p-6 mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            <h2 className="mb-6 text-xl font-semibold text-center">Interactive Predictor</h2>

            <div className="space-y-6">
                {/* Ad Spend Slider */}
                <div className="flex flex-col">
                    <label className="flex justify-between text-sm font-bold">
                        <span>Ad Spend</span>
                        <span className="text-blue-500">${adSpend}</span>
                    </label>
                    <input type="range" min="0" max="2000" step="50" 
                        className="w-full mt-2 accent-blue-500"
                        value={adSpend} onChange={(e) => setAdSpend(Number(e.target.value))} />
                </div>

                {/* Price Slider */}
                <div className="flex flex-col">
                    <label className="flex justify-between text-sm font-bold">
                        <span>Product Price</span>
                        <span className="text-blue-500">${price}</span>
                    </label>
                    <input type="range" min="1" max="100" step="1" 
                        className="w-full mt-2 accent-blue-500"
                        value={price} onChange={(e) => setPrice(Number(e.target.value))} />
                </div>

                {/* Discount Rate Slider */}
                <div className="flex flex-col">
                    <label className="flex justify-between text-sm font-bold">
                        <span>Discount Rate</span>
                        <span className="text-blue-500">{(discountRate * 100).toFixed(0)}%</span>
                    </label>
                    <input type="range" min="0" max="0.5" step="0.01" 
                        className="w-full mt-2 accent-blue-500"
                        value={discountRate} onChange={(e) => setDiscountRate(Number(e.target.value))} />
                </div>

                {/* Campaign Duration Slider */}
                <div className="flex flex-col">
                    <label className="flex justify-between text-sm font-bold">
                        <span>Campaign Duration</span>
                        <span className="text-blue-500">{campaignDuration} Days</span>
                    </label>
                    <input type="range" min="1" max="30" step="1" 
                        className="w-full mt-2 accent-blue-500"
                        value={campaignDuration} onChange={(e) => setCampaignDuration(Number(e.target.value))} />
                </div>
            </div>

            {error && <p className="mt-4 text-center text-red-500">{error}</p>}
            
            <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Predicted Revenue</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {revenue !== null ? `$${revenue.toLocaleString()}` : "Calculating..."}
                </p>
            </div>
        </div>
    );
}