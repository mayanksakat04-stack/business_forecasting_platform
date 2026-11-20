"use client";
import { getPrediction, saveScenario } from "@/services/api";
import { useDebounce } from "@/hooks/useDebounce"; // Import your new mechanical gatekeeper
import React, { useEffect } from "react";
import { RevenueChart } from "./RevenueChart";


interface PredictionWidgetProps {
    title?: string;
    onRevenueChange?: (revenue: number) => void;
    onScenarioSaved?: () => void;
}

const CHANNELS = [
    "Search",
    "Social Media",
    "Affiliate",
    "Email",
    "TV",
    "Influencer"
];



export const PredictionWidget: React.FC<PredictionWidgetProps> = ({
    title = "Interactive Predictor",
    onRevenueChange,
    onScenarioSaved
}) => {
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


    const [channel, setChannel] = React.useState<string>("Social Media");
    const debouncedChannel = useDebounce(channel, 300);

    const [isSaving, setIsSaving] = React.useState<boolean>(false);
    const [saveMessage, setSaveMessage] = React.useState<string | null>(null);
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
                    campaign_duration_days: debouncedDuration,
                    channel: debouncedChannel
                });
                setRevenue(response.predicted_revenue);
                if (onRevenueChange) {
                    onRevenueChange(response.predicted_revenue);
                };
            } catch (err) {
                console.error("API Error:", err);
                setError("Failed to fetch prediction.");
            }
        };

        fetchPrediction();
    }, [debouncedAdSpend, debouncedPrice, debouncedDiscount, debouncedDuration, debouncedChannel]);

    const handleSave = async () => {
        if (revenue === null) return;
        setIsSaving(true);
        setSaveMessage(null);

        try {
            await saveScenario({
                name: `${title} - ${channel}`,
                channel,
                ad_spend: adSpend,
                price,
                discount_rate: discountRate,
                campaign_duration_days: campaignDuration,
                predicted_revenue: revenue,
            });
            setSaveMessage("Saved to database!");
            if (onScenarioSaved) onScenarioSaved();
            setTimeout(() => setSaveMessage(null), 2500);
        } catch (err) {
            console.error("Save Error:", err);
            setSaveMessage("Failed to save.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col w-full max-w-md p-6 mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            <h2 className="mb-6 text-xl font-semibold text-center">{title}</h2>

            {/* Marketing Channel Dropdown */}
            <div className="flex flex-col">
                <label className="text-sm font-bold mb-2">Marketing Channel</label>
                <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {CHANNELS.map((ch) => (
                        <option key={ch} value={ch}>
                            {ch}
                        </option>
                    ))}
                </select>
            </div>
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

            <button
                onClick={handleSave}
                disabled={isSaving || revenue === null}
                className="mt-4 w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-500 text-white font-semibold rounded-lg transition-colors cursor-pointer"
            >
                {isSaving ? "Saving..." : "Save Scenario"}
            </button>
            {saveMessage && (
                <p className="mt-2 text-center text-sm text-green-400 font-medium">
                    {saveMessage}
                </p>
            )}
            <RevenueChart adSpend={adSpend} predictedRevenue={revenue} />
        </div>
    );
}