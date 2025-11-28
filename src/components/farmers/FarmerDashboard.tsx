'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import FishPurpleIcon from '../../assets/famicons_fish-p.svg';

// --- เปลี่ยน Import เป็นไฟล์ชื่อใหม่ ---
import WeightLineChart from './WeightLineChart';
import FeedBarChart from './FeedBarChart';

// --- Mock Data ---
const DATA_6M = {
    growth: [
        { name: 'Jan', growth: 0.8 }, { name: 'Feb', growth: 1.0 }, { name: 'Mar', growth: 1.5 },
        { name: 'Apr', growth: 1.2 }, { name: 'May', growth: 1.3 }, { name: 'Jun', growth: 1.0 },
    ],
    feed: [
        { name: 'Jan', food: 10, temp: 32 }, { name: 'Feb', food: 5, temp: 33 }, { name: 'Mar', food: 15, temp: 31 },
        { name: 'Apr', food: 8, temp: 34 }, { name: 'May', food: 30, temp: 36.6 }, { name: 'Jun', food: 10, temp: 32 },
    ]
};

const DATA_3M = {
    growth: [
        { name: 'Apr', growth: 1.2 }, { name: 'May', growth: 1.3 }, { name: 'Jun', growth: 1.0 },
    ],
    feed: [
        { name: 'Apr', food: 8, temp: 34 }, { name: 'May', food: 30, temp: 36.6 }, { name: 'Jun', food: 10, temp: 32 },
    ]
};

const DATA_EMPTY = { growth: [], feed: [] };

const FarmerDashboard = () => {
    const [timeRange, setTimeRange] = useState('6M');
    // กำหนด Type ให้ชัดเจนเพื่อความปลอดภัย
    const [chartData, setChartData] = useState<{ growth: any[], feed: any[] }>(DATA_6M);

    useEffect(() => {
        if (timeRange === '6M') setChartData(DATA_6M);
        else if (timeRange === '3M') setChartData(DATA_3M);
        else setChartData(DATA_EMPTY);
    }, [timeRange]);

    return (
        <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            
            {/* Header: Badge & Filter */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAD6FD] text-[#6925C0] text-sm font-bold">
                    <Image src={FishPurpleIcon} alt="fish" width={20} height={20} />
                    กลุ่มอนุบาลขนาดใหญ่
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">ข้อมูล ณ วันที่</span>
                    <div className="relative">
                        <select 
                            className="appearance-none bg-[#F3F4F6] text-gray-700 text-sm font-medium rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#093832]"
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

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#FFF5F5] rounded-xl p-5 flex flex-col justify-between h-[140px]">
                    <div>
                        <div className="flex items-center gap-2 text-[#B91C1C] text-sm font-bold mb-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20v-6M6 20V10M18 20V4"/></svg>
                            การทานอาหาร (Kg.)
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-[#B91C1C]">4.8</span>
                            <span className="text-xs font-bold text-red-500 mb-1">▼ (-20%)</span>
                        </div>
                    </div>
                    <div className="border-t border-red-100 pt-2 flex justify-between items-center text-xs">
                        <span className="text-gray-600">ปริมาณอาหารที่ให้สะสม (Kg.)</span>
                        <span className="font-bold text-gray-900">7.8</span>
                    </div>
                </div>
                <div className="bg-[#F0FDFA] rounded-xl p-5 flex flex-col justify-center items-center h-[140px]">
                    <div className="flex items-center gap-2 text-[#0F766E] text-sm font-bold mb-1">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8v4l3 3M3.22 12A9 9 0 1 1 12 21.22"/></svg>
                        อายุปลา (วัน)
                    </div>
                    <span className="text-4xl font-bold text-[#0F766E]">45 วัน</span>
                </div>
                <div className="bg-[#F0FDFA] rounded-xl p-5 flex flex-col justify-center items-center h-[140px]">
                    <div className="flex items-center gap-2 text-[#0F766E] text-sm font-bold mb-1">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.9 10.6C19.9 8.3 17.5 6.8 15 6.8C14.3 6.8 13.6 6.9 12.9 7.2L11.5 5.8C11.1 5.4 10.5 5.4 10.1 5.8L8.7 7.2C8 6.9 7.3 6.8 6.6 6.8C4.1 6.8 1.7 8.3 0.7 10.6"/></svg>
                        น้ำหนักเฉลี่ย
                    </div>
                    <span className="text-4xl font-bold text-[#0F766E]">1.5</span>
                </div>
            </div>

            {/* --- Charts Section (เรียกใช้ Component ใหม่) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* ใช้ Optional Chaining ป้องกัน Error */}
                <WeightLineChart data={chartData?.growth} />
                <FeedBarChart data={chartData?.feed} />
            </div>
        </div>
    );
};

export default FarmerDashboard;