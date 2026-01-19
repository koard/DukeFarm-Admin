'use client';

import Image from "next/image";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import ChartFishIcon from "../../assets/chart-fish.svg";

interface WeightData {
    name: string;
    weight: number;
}

interface WeightChartProps {
    data: WeightData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg z-50">
                <p className="text-[#093832] font-bold mb-1">วันที่: {label}</p>
                <p className="text-sm text-gray-700">
                    ⚖️ น้ำหนักเฉลี่ย: <span className="font-semibold">{payload[0].value}</span> kg.
                </p>
            </div>
        );
    }
    return null;
};

function WeightLineChart({ data }: WeightChartProps) {
    if (!data || data.length === 0) {
        return (
             <div className="w-full">
                <div className="flex items-center mb-4">
                    <Image src={ChartFishIcon} alt="Fish Icon" width={24} height={24} className="w-6 h-6 mr-2" />
                    <h2 className="text-base font-semibold text-[#093832]">น้ำหนักเฉลี่ยของปลา</h2>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center h-[250px] text-gray-400">
                    <p>ยังไม่มีข้อมูลน้ำหนัก</p>
                </div>
            </div>
        );
    }

    const maxValue = Math.max(...data.map((item) => item.weight || 0), 0);
    const topEdge = Math.ceil(maxValue * 1.2); 
    const domainMax = Math.max(topEdge, 1); 

    const customTicks: number[] = [];
    if (domainMax <= 2) {
        for (let i = 0; i <= domainMax; i += 0.2) customTicks.push(i);
    } else {
        const step = Math.ceil(domainMax / 5);
        for (let i = 0; i <= domainMax; i += step) customTicks.push(i);
    }

    const MIN_POINT_WIDTH = 60;
    const totalRequiredWidth = data.length * MIN_POINT_WIDTH;
    const chartWidthStyle = totalRequiredWidth > 600 ? `${totalRequiredWidth}px` : '100%';

    return (
        <div>
            <div className="flex items-center mb-4">
                <Image
                    src={ChartFishIcon}
                    alt="Fish Icon"
                    width={24}
                    height={24}
                    className="w-6 h-6 mr-2"
                />
                <h2 className="text-base font-semibold text-[#093832]">
                    น้ำหนักเฉลี่ยของปลา
                </h2>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                
                <div className="w-full overflow-x-auto pb-2">
                    
                    <div style={{ width: chartWidthStyle }} className="h-[250px] lg:w-full min-w-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={data}
                                margin={{ top: 20, right: 30, left: -10, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />

                                <XAxis
                                    dataKey="name"
                                    tickLine={false}
                                    axisLine={{ stroke: '#E0E0E0', strokeWidth: 1 }}
                                    padding={{ left: 20, right: 20 }}
                                    tick={{ fill: "#000", fontSize: 11, fontWeight: 500 }}
                                    interval={0} 
                                />

                                <YAxis
                                    ticks={customTicks}
                                    domain={[0, domainMax]}
                                    interval={0}
                                    label={{
                                        value: "kg.",
                                        position: "insideTopLeft",
                                        dy: -30,
                                        dx: 25,
                                        fill: "#666",
                                        fontSize: 12,
                                    }}
                                    tickLine={false}
                                    axisLine={{ stroke: '#E0E0E0', strokeWidth: 1 }}
                                    tickFormatter={(value: number) => {
                                        if (value === 0) return "0";
                                        return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(2);
                                    }}
                                    tick={{ fill: "#000", fontSize: 10, fontWeight: 500 }}
                                />

                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#E5E7EB", strokeWidth: 1 }} />

                                <Line
                                    type="monotone"
                                    dataKey="weight" 
                                    stroke="#179678"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: "#179678", strokeWidth: 0 }}
                                    activeDot={{ r: 6, fill: "#179678", stroke: "#fff", strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default WeightLineChart;