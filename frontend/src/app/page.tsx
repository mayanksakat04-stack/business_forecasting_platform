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
            return { text: "Adjust sliders to compare strategies...", color: "bg-gray-700" };
        }
        const diff = Math.abs(revenueA - revenueB).toFixed(2);

        if (revenueA > revenueB) {
            return {
                text: `Strategy A wins by +$${diff}`,
                color: "bg-green-600"
            };
        } else if (revenueB > revenueA) {
            return {
                text: `Strategy B wins by +$${diff}`,
                color: "bg-blue-600"
            };
        } else {
            return {
                text: "Both strategies generate identical predicted revenue",
                color: "bg-gray-600"
            };
        }
    };

    const status = getComparisonStatus();

    return (
        <main className="min-h-screen p-8 bg-gray-100 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
                    Business Strategy Simulator (A/B Mode)
                </h1>

                {/* Live Comparison Banner */}
                <div className={`p-4 mb-8 text-center text-white font-bold text-lg rounded-lg shadow-md transition-colors ${status.color}`}>
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

                {/* Saved Scenarios History Table */}
                <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                        Saved Scenarios (PostgreSQL)
                    </h2>
                    {savedScenarios.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            No scenarios saved yet. Adjust a strategy and click Save Scenario.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                                <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                    <tr>
                                        <th className="px-4 py-3">Scenario</th>
                                        <th className="px-4 py-3">Channel</th>
                                        <th className="px-4 py-3">Ad Spend</th>
                                        <th className="px-4 py-3">Price</th>
                                        <th className="px-4 py-3">Discount</th>
                                        <th className="px-4 py-3">Duration</th>
                                        <th className="px-4 py-3 text-right">Predicted Rev</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {savedScenarios.map((item) => (
                                        <tr key={item.id} className="border-b dark:border-gray-700">
                                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{item.name}</td>
                                            <td className="px-4 py-3">{item.channel}</td>
                                            <td className="px-4 py-3">${item.ad_spend}</td>
                                            <td className="px-4 py-3">${item.price}</td>
                                            <td className="px-4 py-3">{(item.discount_rate * 100).toFixed(0)}%</td>
                                            <td className="px-4 py-3">{item.campaign_duration_days}d</td>
                                            <td className="px-4 py-3 text-right font-bold text-green-500">
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