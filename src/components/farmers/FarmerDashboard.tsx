'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";

import GrowthChart from "../farmers/WeightLineChart"; 
import FeedingChart from "../farmers/FeedBarChart";

import IconFoodGrains from '../../assets/db-food-grains.svg';
import IconFish from '../../assets/db-fish.svg';
import IconWeight from '../../assets/db-weight.svg';

interface DashboardData {
    food: number;
    accFood: number;
    age: number;
    weight: number;
    growthChart: any[]; 
    feedingChart: any[];
}

interface FarmerDashboardProps {
    farmTypes: string[]; 
    feedChartData?: any[];   
    growthChartData?: any[]; 
}

const FarmerDashboard = ({ 
    farmTypes = [], 
    feedChartData = [], 
    growthChartData = [] 
}: FarmerDashboardProps) => {
    
    const availableTypes = farmTypes.length > 0 ? farmTypes : ['SMALL'];
    const [selectedType, setSelectedType] = useState<string>(availableTypes[0]);
    
    const [timeRange, setTimeRange] = useState('6M');

    const [dashboardData, setDashboardData] = useState<DashboardData>({
        food: 0,
        accFood: 0,
        age: 0,
        weight: 0,
        growthChart: [],
        feedingChart: []
    });

    const getLabel = (type: string) => {
        const t = type.toUpperCase();
        if (t.includes('SMALL')) return 'ปลาตุ้ม';
        if (t.includes('LARGE')) return 'ปลานิ้ว';
        if (t.includes('MARKET') || t.includes('GROWOUT')) return 'ปลาตลาด';
        return type;
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                
                console.log(`Fetching data for: ${selectedType} range: ${timeRange}`);
                
                setDashboardData(prev => ({
                    ...prev,
                    food: 0,
                    accFood: 0,
                    age: 0,
                    weight: 0,
                    growthChart: [], 
                    feedingChart: []
                }));

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            }
        };

        fetchDashboardData();
    }, [selectedType, timeRange]);

    return (
        <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                
                <div className="flex flex-wrap gap-2">
                    {availableTypes.map((type) => {
                        const isActive = selectedType === type;
                        return (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`
                                    px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 border border-[#034A30]
                                    ${isActive 
                                        ? 'bg-[#034A30] text-white shadow-md transform scale-105' 
                                        : 'bg-white text-[#034A30] hover:bg-green-50'
                                    }
                                `}
                            >
                                {getLabel(type)}
                            </button>
                        );
                    })}
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
                            <span className="text-4xl font-bold text-[#A10000]">{dashboardData.food}</span>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center text-[#FF1212]">
                                <span className="text-[10px] mr-1">▼</span>
                                <span className="text-base font-bold">(-20%)</span>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-[#FFCDD2] pt-2 flex justify-between items-center text-base">
                        <span className="text-gray-800 text-sm">ปริมาณอาหารที่ให้สะสม (Kg.)</span>
                        <span className="font-bold text-gray-900 text-sm">{dashboardData.accFood}</span>
                    </div>
                </div>

                <div className="bg-[#F4FFFC] rounded-xl flex items-center h-[140px] col-span-1 lg:col-span-2 relative">
                    <div className="flex-1 flex flex-col justify-center h-full px-8">
                        <div className="flex items-center justify-start gap-2 text-[#0F614E] text-base font-bold mb-1 w-full">
                            <Image src={IconFish} alt="fish" width={20} height={20} />
                            อายุปลา (วัน)
                        </div>
                        <div className="flex justify-center w-full">
                            <span className="text-3xl font-bold text-[#0F614E] mt-2">{dashboardData.age} วัน</span>
                        </div>
                    </div>

                    <div className="w-[1px] bg-[#D0EBE5] h-[60%] absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"></div>

                    <div className="flex-1 flex flex-col justify-center h-full px-8">
                        <div className="flex items-center justify-start gap-2 text-[#0F614E] text-base font-bold mb-1 w-full">
                            <Image src={IconWeight} alt="weight" width={20} height={20} />
                            น้ำหนักเฉลี่ย
                        </div>
                        <div className="flex justify-center w-full">
                            <span className="text-3xl font-bold text-[#0F614E] mt-2">{dashboardData.weight}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <GrowthChart data={growthChartData} />
                <FeedingChart data={feedChartData} />
            </div>
        </div>
    );
};

export default FarmerDashboard;