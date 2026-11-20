"use client";
import React, { useState, useEffect } from "react";
import { PredictionWidget } from "@/components/PredictionWidget";
import { getScenarios, ScenarioResponse } from "@/services/api";
export default function Home() {
    const [revenueA, setRevenueA] = useState<number | null>(null);
    const [revenueB, setRevenueB] = useState<number | null>(null);
    const [savedScenarios, setSavedScenarios] = useState<ScenarioResponse[]>([]);

    const loadScenarios = async () => {
        try {
            const data = await getScenarios();
            setSavedScenarios(data);
        } catch (err) {
            console.error("Error loading scenarios:", err);
        }
    };

    useEffect(() => {
        loadScenarios();
    }, []);

    // Calculate the live difference between Strategy A and Strategy B
    const getComparisonStatus = () => {
        if (revenueA === null || revenueB === null) {
            return { text: "Adjust sliders to compare strategies...", color: "bg-white/80 text-gray-800 border-gray-200" };
        }
        const diff = Math.abs(revenueA - revenueB).toFixed(2);

        if (revenueA > revenueB) {
            return { text: `Strategy A wins by +$${diff}`, color: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-transparent" };
        } else if (revenueB > revenueA) {
            return { text: `Strategy B wins by +$${diff}`, color: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent" };
        } else {
            return { text: "Both strategies generate identical predicted revenue", color: "bg-white/80 text-gray-800 border-gray-200" };
        }
    };

    const status = getComparisonStatus();

    return (
        <main className="min-h-screen p-8 bg-gradient-to-br from-slate-200 via-gray-100 to-slate-200 text-gray-900">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-extrabold text-center text-black tracking-tight mb-6">
                    Business Strategy Simulator
                </h1>

                {/* Live Comparison Banner */}
                <div className={`p-4 mb-8 text-center font-bold text-lg rounded-2xl shadow-lg backdrop-blur-md border transition-all ${status.color}`}>
                    {status.text}
                </div>

                {/* Side-by-Side Strategy Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <PredictionWidget
                        title="Strategy A (Baseline)"
                        onRevenueChange={setRevenueA}
                        onScenarioSaved={loadScenarios}
                    />
                    <PredictionWidget
                        title="Strategy B (Challenger)"
                        onRevenueChange={setRevenueB}
                        onScenarioSaved={loadScenarios}
                    />
                </div>

                {/* Saved Scenarios History Table (Glassmorphic) */}
                <div className="mt-12 bg-white/70 backdrop-blur-md border border-white/80 rounded-2xl shadow-xl p-6">
                    <h2 className="text-xl font-bold text-black mb-4">
                        Saved Scenarios (PostgreSQL)
                    </h2>
                    {savedScenarios.length === 0 ? (
                        <p className="text-gray-600 text-sm">
                            No scenarios saved yet. Adjust a strategy and click Save Scenario.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-800">
                                <thead className="text-xs uppercase bg-gray-200/70 text-black font-bold">
                                    <tr>
                                        <th className="px-4 py-3 rounded-tl-lg">Scenario</th>
                                        <th className="px-4 py-3">Channel</th>
                                        <th className="px-4 py-3">Ad Spend</th>
                                        <th className="px-4 py-3">Price</th>
                                        <th className="px-4 py-3">Discount</th>
                                        <th className="px-4 py-3">Duration</th>
                                        <th className="px-4 py-3 text-right rounded-tr-lg">Predicted Rev</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {savedScenarios.map((item) => (
                                        <tr key={item.id} className="border-b border-gray-200/80 hover:bg-white/60 transition-colors">
                                            <td className="px-4 py-3 font-semibold text-black">{item.name}</td>
                                            <td className="px-4 py-3">{item.channel}</td>
                                            <td className="px-4 py-3">${item.ad_spend}</td>
                                            <td className="px-4 py-3">${item.price}</td>
                                            <td className="px-4 py-3">{(item.discount_rate * 100).toFixed(0)}%</td>
                                            <td className="px-4 py-3">{item.campaign_duration_days}d</td>
                                            <td className="px-4 py-3 text-right font-bold text-emerald-600">
                                                ${item.predicted_revenue.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}