'use client';

import Image from "next/image";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

import ChartFishIcon from "../../assets/chart-fish.svg";

const NORMAL_COLOR = "#E6F2DD";
const HIGHLIGHT_COLOR = "#72B544";

interface FeedingData {
    name: string;
    food: number;
}


interface RoundedBarProps {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    fill?: string;
}

const RoundedBar = (props: RoundedBarProps) => {
    const { x = 0, y = 0, width = 0, height = 0, fill } = props;
    const radius = 8;

    return (
        <path
            d={`M${x},${y + height} 
             L${x},${y + radius} 
             A${radius},${radius} 0 0 1 ${x + radius},${y} 
             L${x + width - radius},${y} 
             A${radius},${radius} 0 0 1 ${x + width},${y + radius} 
             L${x + width},${y + height} 
             Z`}
            fill={fill}
        />
    );
};

interface FeedingChartProps {
    data: FeedingData[];
}

function FeedingChart({ data }: FeedingChartProps) {
    if (!data) return null;

    const currentMonthName = new Date().toLocaleString('en-US', { month: 'short' });

    const maxValue = Math.max(...data.map((item) => item.food || 0), 0);
    const topEdge = Math.ceil(maxValue);
    const domainMax = Math.max(topEdge, 2);

    const customTicks: number[] = [];
    if (domainMax <= 4) {
        for (let i = 0; i <= domainMax; i += 0.5) customTicks.push(i);
    } else {
        for (let i = 0; i <= domainMax; i += 1) customTicks.push(i);
    }

    const MIN_BAR_WIDTH = 70;
    const totalRequiredWidth = data.length * MIN_BAR_WIDTH;
    
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
                <h2 className="text-lg font-semibold text-[#093832]">
                    ปริมาณอาหารที่สัมพันธ์อุณหภูมิ
                </h2>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                
                <div className="w-full overflow-x-auto pb-2">
                    
                    <div 
                        style={{ width: chartWidthStyle }} 
                        className="h-[250px] lg:w-full min-w-[300px]"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data}
                                margin={{ top: 40, right: 30, left: -10, bottom: 5 }}
                                barCategoryGap="40%"
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />

                                <XAxis
                                    dataKey="name"
                                    tickLine={false}
                                    axisLine={{ stroke: '#E0E0E0', strokeWidth: 1 }}
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
                                    cursor={{ fill: "rgba(230, 230, 230, 0.5)" }}
                                    contentStyle={{
                                        backgroundColor: "white",
                                        border: "1px solid #E5E7EB",
                                        borderRadius: "0.5rem",
                                    }}
                                    labelStyle={{ color: "#4B5563", fontWeight: "bold" }}
                                    formatter={(value: number) => [`${value} kg.`, "ปริมาณอาหาร"]}
                                />

                                <Bar dataKey="food" shape={<RoundedBar />} barSize={23}>
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.name === currentMonthName ? HIGHLIGHT_COLOR : NORMAL_COLOR}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default FeedingChart;