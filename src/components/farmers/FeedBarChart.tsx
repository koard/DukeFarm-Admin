'use client';

import Image from 'next/image';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

import ChartFishIcon from '../../assets/chart-fish.svg';

interface FeedBarChartProps {
    data: any[];
}

const RoundedBar = (props: any) => {
    const { x, y, width, height, fill } = props;
    const radius = 8;
    return (
        <path
            d={`M${x},${y + height} L${x},${y + radius} A${radius},${radius} 0 0 1 ${x + radius},${y} L${x + width - radius},${y} A${radius},${radius} 0 0 1 ${x + width},${y + radius} L${x + width},${y + height} Z`}
            fill={fill}
        />
    );
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white border border-gray-200 p-2 rounded-lg shadow-md text-sm">
                <p className="font-bold text-gray-700 mb-1">{label}</p>
                <p className="text-gray-900 font-medium">
                    {data.food} (kg.) {data.temp ? `/ ${data.temp} °C` : ''}
                </p>
            </div>
        );
    }
    return null;
};

const FeedBarChart = ({ data }: FeedBarChartProps) => {
    
    const currentMonthName = new Date().toLocaleString('en-US', { month: 'short' });

    const calculateTicks = (data: any[]) => {
        if (!data || data.length === 0) return { domainMax: 2, customTicks: [0, 1, 2] };
        const maxValue = Math.max(...data.map((item) => item.food || 0), 0);
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
                    <h2 className="text-base font-bold text-[#093832]">ปริมาณอาหารที่สัมพันธ์อุณหภูมิ</h2>
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
                <h2 className="text-base font-bold text-[#093832]">ปริมาณอาหารที่สัมพันธ์อุณหภูมิ</h2>
            </div>

            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 40, right: 30, left: -10, bottom: 5 }} barCategoryGap="40%">
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={{ stroke: '#E0E0E0', strokeWidth: 1 }} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fill: '#000', fontWeight: 500 }} 
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
                        <Tooltip cursor={{ fill: "rgba(230, 230, 230, 0.5)" }} content={<CustomTooltip />} />
                        <Bar dataKey="food" shape={<RoundedBar />}>
                            {data.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={entry.name === currentMonthName ? "#72B544" : "#E6F2DD"} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default FeedBarChart;