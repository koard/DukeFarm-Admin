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
    temp?: number; 
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

    if (!height || height <= 0) return null;

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


const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload; 
        
        return (
            <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg z-50">
                <p className="text-[#093832] font-bold mb-1">วันที่: {label}</p>
                <div className="space-y-1">
                    <p className="text-sm text-gray-700">
                        🐟 ปริมาณอาหาร : <span className="font-semibold">{data.food}</span> kg.
                    </p>
                    {data.temp !== undefined && (
                        <p className="text-sm text-gray-700">
                            🌡️ อุณหภูมิ : <span className="font-semibold">{data.temp}</span> °C
                        </p>
                    )}
                </div>
            </div>
        );
    }
    return null;
};

interface FeedingChartProps {
    data: FeedingData[];
}

function FeedingChart({ data }: FeedingChartProps) {
    if (!data || data.length === 0) {
        return (
             <div className="w-full">
                <div className="flex items-center mb-4">
                    <Image src={ChartFishIcon} alt="Fish Icon" width={24} height={24} className="w-6 h-6 mr-2" />
                    <h2 className="text-base font-semibold text-[#093832]">ปริมาณอาหารที่สัมพันธ์อุณหภูมิ</h2>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center h-[250px] text-gray-400">
                    <p>ยังไม่มีข้อมูลการให้อาหาร</p>
                </div>
            </div>
        );
    }

    const maxValue = Math.max(...data.map((item) => item.food || 0), 0);
    const topEdge = Math.ceil(maxValue * 1.2);
    const domainMax = Math.max(topEdge, 2);

    const customTicks: number[] = [];
    if (domainMax <= 4) {
        for (let i = 0; i <= domainMax; i += 0.5) customTicks.push(i);
    } else {
        const step = Math.ceil(domainMax / 5);
        for (let i = 0; i <= domainMax; i += step) customTicks.push(i);
    }

    const MIN_BAR_WIDTH = 60;
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
                <h2 className="text-base font-semibold text-[#093832]">
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
                                margin={{ top: 30, right: 30, left: -10, bottom: 5 }}
                                barCategoryGap="30%"
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />

                                <XAxis
                                    dataKey="name"
                                    tickLine={false}
                                    axisLine={{ stroke: '#E0E0E0', strokeWidth: 1 }}
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

                                <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />

                                <Bar dataKey="food" shape={<RoundedBar />} barSize={30}>
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={index === data.length - 1 ? HIGHLIGHT_COLOR : NORMAL_COLOR}
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