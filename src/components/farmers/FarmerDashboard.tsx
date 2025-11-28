'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";

import GrowthChart from "../farmers/WeightLineChart"; 
import FeedingChart from "../farmers/FeedBarChart";

import FishPurpleIcon from '../../assets/famicons_fish-p.svg';
import FishGreenIcon from '../../assets/famicons_fish-g.svg'; 
import FishYellowIcon from '../../assets/famicons_fish-y.svg';
import IconFoodGrains from '../../assets/db-food-grains.svg';
import IconFish from '../../assets/db-fish.svg';
import IconWeight from '../../assets/db-weight.svg';

const FULL_YEAR_DATA = {
    growthChart: [
        { name: "Jan", growth: 0.55 }, { name: "Feb", growth: 0.6 }, { name: "Mar", growth: 0.9 },
        { name: "Apr", growth: 1.3 }, { name: "May", growth: 1.0 }, { name: "Jun", growth: 1.05 },
        { name: "Jul", growth: 1.0 }, { name: "Aug", growth: 0.95 }, { name: "Sep", growth: 0.9 },
        { name: "Oct", growth: 1.0 }, { name: "Nov", growth: 0.8 }, 
    ],
    feedingChart: [
        { name: "Jan", food: 0.8, temp: 28 }, { name: "Feb", food: 0.3, temp: 27 }, { name: "Mar", food: 0.85, temp: 29 },
        { name: "Apr", food: 0.5, temp: 30 }, { name: "May", food: 1.2, temp: 31 }, { name: "Jun", food: 0.7, temp: 29 },
        { name: "Jul", food: 0.5, temp: 28 }, { name: "Aug", food: 0.25, temp: 27 }, { name: "Sep", food: 0.7, temp: 28 },
        { name: "Oct", food: 0.5, temp: 26 }, { name: "Nov", food: 0.25, temp: 25 },
    ]
};

interface FarmerDashboardProps {
    groupType?: string; 
}

const FarmerDashboard = ({ groupType = "กลุ่มอนุบาลขนาดใหญ่" }: FarmerDashboardProps) => {
    const [timeRange, setTimeRange] = useState('6M');
    
    const [chartData, setChartData] = useState(() => {
        return {
            growthChart: FULL_YEAR_DATA.growthChart.slice(-6),
            feedingChart: FULL_YEAR_DATA.feedingChart.slice(-6)
        };
    });

    const getGroupStyle = (type: string) => {
        if (type === 'กลุ่มผู้เลี้ยงขนาดตลาด') {
            return {
                bgColor: '#9DFFEB',
                textColor: '#007066',
                icon: FishGreenIcon
            };
        } else if (type === 'กลุ่มอนุบาลขนาดเล็ก') {
            return {
                bgColor: '#FFF3CA',
                textColor: '#917618',
                icon: FishYellowIcon
            };
        }
        return {
            bgColor: '#DB9DFF',
            textColor: '#470070',
            icon: FishPurpleIcon
        };
    };

    const style = getGroupStyle(groupType);

    useEffect(() => {
        let slicedGrowth: any[] = [];
        let slicedFeeding: any[] = [];

        if (timeRange === '6M') {
            slicedGrowth = FULL_YEAR_DATA.growthChart.slice(-6);
            slicedFeeding = FULL_YEAR_DATA.feedingChart.slice(-6);
        } else if (timeRange === '3M') {
            slicedGrowth = FULL_YEAR_DATA.growthChart.slice(-3);
            slicedFeeding = FULL_YEAR_DATA.feedingChart.slice(-3);
        } else if (timeRange === 'NOW') {
            slicedGrowth = FULL_YEAR_DATA.growthChart.slice(-1);
            slicedFeeding = FULL_YEAR_DATA.feedingChart.slice(-1);
        }

        setChartData({
            growthChart: slicedGrowth,
            feedingChart: slicedFeeding
        });
    }, [timeRange]);

    return (
        <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div 
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold transition-colors"
                    style={{ 
                        backgroundColor: style.bgColor, 
                        color: style.textColor 
                    }}
                >
                    {style.icon && <Image src={style.icon} alt="fish-icon" width={20} height={20} />}
                    {groupType}
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">ข้อมูล ณ วันที่</span>
                    <div className="relative">
                        <select 
                            className="appearance-none bg-[#F3F4F6] text-gray-700 text-sm font-medium rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#093832] cursor-pointer"
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                        >
                            <option value="6M">ข้อมูล 6 เดือนล่าสุด</option>
                            <option value="3M">ข้อมูล 3 เดือนล่าสุด</option>
                            <option value="NOW">ข้อมูล ณ ปัจจุบัน</option>
                        </select>
                         <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor"><path d="M1 1L5 5L9 1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                    </div>
                </div>
            </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#FFEBEC] rounded-xl p-5 flex flex-col justify-between h-[140px] col-span-1">
                    <div>
                        <div className="flex items-center gap-2 text-[#A10000] text-base font-bold mb-2">
                            <Image src={IconFoodGrains} alt="food" width={18} height={18} />
                            การทานอาหาร (Kg.)
                        </div>
                        <div className="relative flex items-center justify-center mt-2">
                            <span className="text-4xl font-bold text-[#A10000]">4.8</span>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center text-[#FF1212]">
                                <span className="text-[10px] mr-1">▼</span>
                                <span className="text-base font-bold">(-20%)</span>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-[#FFCDD2] pt-2 flex justify-between items-center text-base">
                        <span className="text-gray-800 text-sm">ปริมาณอาหารที่ให้สะสม (Kg.)</span>
                        <span className="font-bold text-gray-900 text-sm">7.8</span>
                    </div>
                </div>

                <div className="bg-[#F4FFFC] rounded-xl flex items-center h-[140px] col-span-1 lg:col-span-2 relative">
                    <div className="flex-1 flex flex-col justify-center h-full px-8">
                        <div className="flex items-center justify-start gap-2 text-[#0F614E] text-base font-bold mb-1 w-full">
                            <Image src={IconFish} alt="fish" width={20} height={20} />
                            อายุปลา (วัน)
                        </div>
                        <div className="flex justify-center w-full">
                            <span className="text-3xl font-bold text-[#0F614E] mt-2">45 วัน</span>
                        </div>
                    </div>

                    <div className="w-[1px] bg-[#D0EBE5] h-[60%] absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"></div>

                    <div className="flex-1 flex flex-col justify-center h-full px-8">
                        <div className="flex items-center justify-start gap-2 text-[#0F614E] text-base font-bold mb-1 w-full">
                            <Image src={IconWeight} alt="weight" width={20} height={20} />
                            น้ำหนักเฉลี่ย
                        </div>
                        <div className="flex justify-center w-full">
                            <span className="text-3xl font-bold text-[#0F614E] mt-2">1.5</span>
                        </div>
                    </div>

                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {chartData.growthChart && <GrowthChart data={chartData.growthChart} />}
                {chartData.feedingChart && <FeedingChart data={chartData.feedingChart} />}
            </div>
        </div>
    );
};

export default FarmerDashboard;