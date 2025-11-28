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

interface GrowthData {
    name: string;
    growth: number;
}

interface GrowthChartProps {
    data: GrowthData[];
}

function GrowthChart({ data }: GrowthChartProps) {
    if (!data) return null;

    const maxValue = Math.max(...data.map((item) => item.growth || 0), 0);
    const topEdge = Math.ceil(maxValue);
    const domainMax = Math.max(topEdge, 2);

    const customTicks: number[] = [];
    if (domainMax <= 4) {
        for (let i = 0; i <= domainMax; i += 0.5) customTicks.push(i);
    } else {
        for (let i = 0; i <= domainMax; i += 1) customTicks.push(i);
    }

    const MIN_POINT_WIDTH = 70;
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
                    น้ำหนักเฉลี่ยของปลา                </h2>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                
                <div className="w-full overflow-x-auto pb-2">
                    
                    <div style={{ width: chartWidthStyle, minWidth: '100%' }} className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={data}
                                margin={{ top: 40, right: 30, left: -10, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />

                                <XAxis
                                    dataKey="name"
                                    tickLine={false}
                                    axisLine={{ stroke: '#E0E0E0', strokeWidth: 1 }}
                                    padding={{ left: 20, right: 20 }}
                                    tick={{ fill: "#000", fontSize: 10, fontWeight: 500 }}
                                    interval={0} 
                                />

                                <YAxis
                                    ticks={customTicks}
                                    domain={[0, domainMax]}
                                    interval={0}
                                    label={{
                                        value: "kg.",
                                        position: "insideTopLeft",
                                        dy: -40,
                                        dx: 35,
                                        fill: "#000",
                                        fontSize: 12,
                                        fontWeight: 500,
                                    }}
                                    tickLine={false}
                                    axisLine={{ stroke: '#E0E0E0', strokeWidth: 1 }}
                                    tickFormatter={(value: number) => {
                                        if (value === 0) return "0";
                                        return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
                                    }}
                                    tick={{ fill: "#000", fontSize: 10, fontWeight: 500 }}
                                />

                                <Tooltip
                                    cursor={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                                    contentStyle={{
                                        backgroundColor: "white",
                                        border: "1px solid #E5E7EB",
                                        borderRadius: "0.5rem",
                                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                    }}
                                    labelStyle={{ color: "#4B5563", fontWeight: "bold" }}
                                    itemStyle={{ color: "#000000" }}
                                    formatter={(value: number) => [`${value} kg.`, "อัตราการเจริญเติบโต"]}
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

            </div>
        </div>
    );
}

export default GrowthChart;