"use client";
import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";

interface RevenueChartProps {
    adSpend: number;
    predictedRevenue: number | null;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ adSpend, predictedRevenue }) => {
    // Format the data into the exact array of objects Recharts expects
    const data = [
        {
            name: "Ad Spend",
            amount: adSpend,
            color: "#3b82f6", // Blue
        },
        {
            name: "Baseline",
            amount: 143.85, // The intercept 'b' learned by your model
            color: "#9ca3af", // Gray
        },
        {
            name: "Predicted Rev",
            amount: predictedRevenue ?? 0,
            color: "#22c55e", // Green
        },
    ];

    return (
        <div className="w-full h-72 p-4 mt-6 bg-white/60 border border-gray-200/80 rounded-xl shadow-sm">
            <h3 className="mb-4 text-xs font-bold text-center uppercase tracking-wider text-gray-700">
                Financial Impact Breakdown
            </h3>

            <ResponsiveContainer width="100%" height="85%">
                <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.6} />
                    <XAxis dataKey="name" stroke="#111827" fontSize={12} fontWeight={600} />
                    <YAxis stroke="#111827" fontSize={12} />
                    <Tooltip
                        formatter={(value) => [`$${Number(value ?? 0).toFixed(2)}`, "Amount"]}
                        contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                            borderColor: "#e2e8f0",
                            borderRadius: "10px",
                            color: "#111827",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                        }}
                    />
                    <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};