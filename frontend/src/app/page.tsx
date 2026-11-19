"use client";
import React, { useState } from "react";
import { PredictionWidget } from "@/components/PredictionWidget";

export default function Home() {
    const [revenueA, setRevenueA] = useState<number | null>(null);
    const [revenueB, setRevenueB] = useState<number | null>(null);

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
                    />
                    <PredictionWidget 
                        title="Strategy B (Challenger)" 
                        onRevenueChange={setRevenueB} 
                    />
                </div>
            </div>
        </main>
    );
}