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
        <div className="flex flex-col w-full max-w-md p-6 mx-auto bg-white/70 backdrop-blur-md border border-white/80 rounded-2xl shadow-xl text-gray-900">
            <h2 className="mb-6 text-xl font-bold text-center text-black">{title}</h2>

            {/* Marketing Channel Dropdown */}
            <div className="flex flex-col mb-5">
                <label className="text-sm font-bold text-gray-900 mb-2">Marketing Channel</label>
                <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white/80 border border-gray-300 rounded-xl text-sm text-black font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                >
                    {CHANNELS.map((ch) => (
                        <option key={ch} value={ch}>
                            {ch}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-5">
                {/* Ad Spend Slider */}
                <div className="flex flex-col">
                    <label className="flex justify-between text-sm font-bold text-gray-900">
                        <span>Ad Spend</span>
                        <span className="text-blue-600">${adSpend}</span>
                    </label>
                    <input type="range" min="0" max="2000" step="50"
                        className="w-full mt-2 accent-blue-600 cursor-pointer"
                        value={adSpend} onChange={(e) => setAdSpend(Number(e.target.value))} />
                </div>

                {/* Price Slider */}
                <div className="flex flex-col">
                    <label className="flex justify-between text-sm font-bold text-gray-900">
                        <span>Product Price</span>
                        <span className="text-blue-600">${price}</span>
                    </label>
                    <input type="range" min="1" max="100" step="1"
                        className="w-full mt-2 accent-blue-600 cursor-pointer"
                        value={price} onChange={(e) => setPrice(Number(e.target.value))} />
                </div>

                {/* Discount Rate Slider */}
                <div className="flex flex-col">
                    <label className="flex justify-between text-sm font-bold text-gray-900">
                        <span>Discount Rate</span>
                        <span className="text-blue-600">{(discountRate * 100).toFixed(0)}%</span>
                    </label>
                    <input type="range" min="0" max="0.5" step="0.01"
                        className="w-full mt-2 accent-blue-600 cursor-pointer"
                        value={discountRate} onChange={(e) => setDiscountRate(Number(e.target.value))} />
                </div>

                {/* Campaign Duration Slider */}
                <div className="flex flex-col">
                    <label className="flex justify-between text-sm font-bold text-gray-900">
                        <span>Campaign Duration</span>
                        <span className="text-blue-600">{campaignDuration} Days</span>
                    </label>
                    <input type="range" min="1" max="30" step="1"
                        className="w-full mt-2 accent-blue-600 cursor-pointer"
                        value={campaignDuration} onChange={(e) => setCampaignDuration(Number(e.target.value))} />
                </div>
            </div>

            {error && <p className="mt-4 text-center text-red-600 font-medium">{error}</p>}

            {/* Predicted Revenue Box */}
            <div className="mt-8 p-4 bg-white/60 border border-gray-200/80 rounded-xl text-center shadow-inner">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-600">Predicted Revenue</p>
                <p className="text-3xl font-extrabold text-emerald-600 mt-1">
                    {revenue !== null ? `$${revenue.toLocaleString()}` : "Calculating..."}
                </p>
            </div>

            {/* Gradient Save Button */}
            <button
                onClick={handleSave}
                disabled={isSaving || revenue === null}
                className="mt-4 w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
                {isSaving ? "Saving..." : "Save Scenario"}
            </button>
            {saveMessage && (
                <p className="mt-2 text-center text-sm text-emerald-600 font-semibold">
                    {saveMessage}
                </p>
            )}

            <RevenueChart adSpend={adSpend} predictedRevenue={revenue} />
        </div>
    );
}