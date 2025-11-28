'use client';

import React from 'react';
import Image from 'next/image';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

import ChartFishIcon from '../../assets/chart-fish.svg';

interface WeightLineChartProps {
    data: any[];
}

const WeightLineChart = ({ data }: WeightLineChartProps) => {
    
    const calculateTicks = (data: any[]) => {
        if (!data || data.length === 0) return { domainMax: 2, customTicks: [0, 1, 2] };
        const maxValue = Math.max(...data.map((item) => item.growth || 0), 0);
        const topEdge = Math.ceil(maxValue);
        const domainMax = Math.max(topEdge, 2);
        const customTicks: number[] = [];
        if (domainMax <= 4) {
            for (let i = 0; i <= domainMax; i += 0.5) customTicks.push(i);
        } else {
            for (let i = 0; i <= domainMax; i += 1) customTicks.push(i);
        }
        return { domainMax, customTicks };
    };

    const { domainMax, customTicks } = calculateTicks(data);

    if (!data || data.length === 0) {
        return (
            <div className="w-full">
                <div className="flex items-center mb-4 gap-2">
                    <Image src={ChartFishIcon} alt="icon" width={24} height={24} />
                    <h2 className="text-base font-bold text-[#093832]">น้ำหนักเฉลี่ยของปลา</h2>
                </div>
                <div className="h-[250px] w-full flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-400">
                    ไม่มีข้อมูล
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex items-center mb-4 gap-2">
                <Image src={ChartFishIcon} alt="icon" width={24} height={24} />
                <h2 className="text-base font-bold text-[#093832]">น้ำหนักเฉลี่ยของปลา</h2>
            </div>
            
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 40, right: 30, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={{ stroke: '#E0E0E0', strokeWidth: 1 }} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fill: '#000', fontWeight: 500 }} 
                            padding={{ left: 20, right: 20 }} 
                            interval={0} 
                        />
                        <YAxis 
                            ticks={customTicks} 
                            domain={[0, domainMax]} 
                            interval={0} 
                            axisLine={{ stroke: '#E0E0E0', strokeWidth: 1 }} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fill: '#000', fontWeight: 500 }}
                            label={{ value: "kg.", position: "insideTopLeft", dy: -40, dx: 35, fill: "#000", fontSize: 12, fontWeight: 500 }}
                            tickFormatter={(val) => val === 0 ? "0" : Number.isInteger(val) ? val.toFixed(0) : val.toFixed(1)}
                        />
                        <Tooltip 
                            cursor={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                            contentStyle={{ backgroundColor: "white", border: "1px solid #E5E7EB", borderRadius: "0.5rem", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                            labelStyle={{ color: "#4B5563", fontWeight: "bold" }} itemStyle={{ color: "#000000" }}
                            formatter={(value: any) => [`${value} kg.`, "อัตราการเจริญเติบโต"]}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="growth" 
                            stroke="#179678" 
                            strokeWidth={3} 
                            dot={false} 
                            activeDot={{ r: 6, fill: "#179678", stroke: "#fff", strokeWidth: 2 }} 
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default WeightLineChart;