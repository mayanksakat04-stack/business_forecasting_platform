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
        <div className="w-full h-72 p-4 mt-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <h3 className="mb-4 text-sm font-semibold text-center uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Financial Impact Breakdown
            </h3>
            
            {/* ResponsiveContainer automatically scales the chart to fit any screen size */}
            <ResponsiveContainer width="100%" height="85%">
                <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip 
                        formatter={(value) => [`$${Number(value ?? 0).toFixed(2)}`, "Amount"]}
                        contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "#fff" }}
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