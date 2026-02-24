'use client';

import React from 'react';

const ICON_BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

export interface FarmerDashboardProps {
    loading?: boolean;
    fishType?: string;
    avgWeight?: string | number;
    releaseCount?: string | number;
    remainingCount?: string | number;
    survivalRate?: number | null;
    marketSize?: string;
    productionCycleCount?: number;
}

const getSurvivalStatusStyles = (percentage: number | null) => {
    if (percentage === null) {
        return {
            bg: "bg-gray-50",
            text: "text-gray-400",
            label: "-"
        };
    }
    if (percentage >= 90) {
        return {
            bg: "bg-[#E6FFFA]",
            text: "text-[#047857]",
            label: "▲ (สูง)"
        };
    } else if (percentage >= 75) {
        return {
            bg: "bg-[#FFF9C4]",
            text: "text-[#854D0E]",
            label: "● (ปกติ)"
        };
    } else if (percentage >= 50) {
        return {
            bg: "bg-[#FFCCBC]",
            text: "text-[#BF360C]",
            label: "▼ (ค่อนข้างต่ำ)"
        };
    } else {
        return {
            bg: "bg-[#FFCDD2]",
            text: "text-[#B91C1C]",
            label: "▼ (ต่ำมาก)"
        };
    }
};

const FarmerDashboard = ({
    loading = false,
    fishType = "-",
    avgWeight = "-",
    releaseCount = "-",
    remainingCount = "-",
    survivalRate = null,
    marketSize = "-",
    productionCycleCount = 0,
}: FarmerDashboardProps) => {

    const status = getSurvivalStatusStyles(survivalRate);

    return (
        <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex items-stretch gap-3 min-w-[1100px]">

                {/* -------------------------------------------------------------------------
                    1. ประเภทปลา & น้ำหนักปลาเฉลี่ย 
                ------------------------------------------------------------------------- */}
                <div className="bg-gradient-to-r from-[#FFF6E2] via-[#FFF6E2] to-[#E6DAFF] rounded-2xl shadow-sm flex overflow-hidden border border-orange-50/20 flex-[1.5] h-[96px]">

                    {/* ฝั่งซ้าย: ประเภทปลา */}
                    <div className="flex-1 flex flex-col p-4 relative">
                        <div className="flex items-center gap-1.5 mb-1">
                            <img src={`${ICON_BASE}/icon_farmers/ion_fish.svg`} alt="type" width={18} height={18} />
                            <span className="text-sm font-bold text-gray-900">ประเภทปลา</span>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                            <p className="text-2xl font-black text-black">
                                {loading ? "..." : fishType}
                            </p>
                        </div>
                        {/* เส้นคั่นสีขาวแบบยาว */}
                        <div className="absolute right-0 top-3 bottom-3 w-px bg-white shadow-sm opacity-80"></div>
                    </div>

                    {/* ฝั่งขวา: น้ำหนักปลาเฉลี่ย */}
                    <div className="flex-1 flex flex-col p-4">
                        <div className="flex items-center gap-1.5 mb-1">
                            <img src={`${ICON_BASE}/icon_farmers/line.svg`} alt="avg" width={18} height={18} />
                            <span className="text-sm font-bold text-gray-900">น้ำหนักปลาเฉลี่ย</span>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                            <p className="text-2xl font-black text-black">
                                {loading ? "..." : avgWeight} <span className="text-sm font-bold text-gray-900 ml-1">กรัม</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* -------------------------------------------------------------------------
                    2. จำนวนที่ปล่อย 
                ------------------------------------------------------------------------- */}
                <div className="bg-[#4A59FF] rounded-2xl p-4 relative overflow-hidden text-white shadow-md flex-1 flex flex-col h-[96px]">
                    <span className="text-base font-medium opacity-90">จำนวนที่ปล่อย</span>
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-3xl font-black leading-none relative z-10">
                            {loading ? "..." : releaseCount}
                        </p>
                    </div>
                    <img
                        src={`${ICON_BASE}/icon_farmers/ix_water-fish.svg`}
                        alt="fish"
                        width={60}
                        height={50}
                        className="absolute bottom-0 right-0 opacity-90 translate-x-1 translate-y-1"
                    />
                </div>

                {/* -------------------------------------------------------------------------
                    3. คงเหลือ 
                ------------------------------------------------------------------------- */}
                <div className="bg-[#E0A84D] rounded-2xl p-4 relative overflow-hidden text-white shadow-md flex-1 flex flex-col h-[96px]">
                    <span className="text-base font-medium opacity-90">คงเหลือ</span>
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-3xl font-black leading-none relative z-10">
                            {loading ? "..." : remainingCount}
                        </p>
                    </div>
                    <img
                        src={`${ICON_BASE}/icon_farmers/Group 1000003034.svg`}
                        alt="group"
                        width={60}
                        height={50}
                        className="absolute bottom-0 right-0 opacity-90 translate-x-1 translate-y-1"
                    />
                </div>

                {/* -------------------------------------------------------------------------
                    4. อัตราการรอด 
                ------------------------------------------------------------------------- */}
                <div className={`${status.bg} rounded-2xl p-4 flex flex-col shadow-sm border border-white/40 transition-colors duration-300 flex-1 h-[96px]`}>
                    <div className="flex items-center gap-2 mb-2">
                        <img src={`${ICON_BASE}/icon_farmers/famicons_fish-bb.svg`} alt="survival" width={22} height={22} />
                        <span className="text-base font-bold text-gray-700">อัตราการรอด</span>
                    </div>
                    <div className="flex flex-col items-center justify-center flex-1">
                        <div className="flex items-baseline gap-1">
                            <span className={`text-3xl font-black ${status.text}`}>
                                {loading ? "..." : (survivalRate !== null ? `${survivalRate}%` : "-")}
                            </span>
                            <span className={`text-xs font-bold ${status.text}`}>
                                {status.label}
                            </span>
                        </div>
                    </div>
                </div>

                {/* -------------------------------------------------------------------------
                    5. ขนาดที่เหมาะสำหรับการขาย 
                ------------------------------------------------------------------------- */}
                <div className="bg-[#F1DFFF] rounded-2xl p-4 flex flex-col shadow-sm border border-purple-100/30 flex-[1.2] h-[96px]">
                    <div className="flex items-center gap-2 mb-2">
                        <img src={`${ICON_BASE}/icon_farmers/weight.svg`} alt="weight" width={20} height={20} />
                        <span className="text-base font-bold text-gray-700">ขนาดที่เหมาะสำหรับการขาย</span>
                    </div>
                    <div className="flex justify-center items-baseline gap-1 flex-1">
                        <p className="text-2xl font-black text-black">
                            {loading ? "..." : marketSize}
                        </p>
                        <span className="text-lg font-bold text-black">กรัม</span>
                    </div>
                </div>

                {/* -------------------------------------------------------------------------
                    6. จำนวนรอบการเลี้ยง 
                ------------------------------------------------------------------------- */}
                <div className="bg-[#E0F2F1] rounded-2xl p-4 flex flex-col shadow-sm border border-teal-100/30 flex-1 h-[96px]">
                    <div className="flex items-center gap-2 mb-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 8V12L15 15" stroke="#0D7377" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="12" cy="12" r="9" stroke="#0D7377" strokeWidth="2" />
                        </svg>
                        <span className="text-base font-bold text-gray-700">รอบการเลี้ยง</span>
                    </div>
                    <div className="flex justify-center items-baseline gap-1 flex-1">
                        <p className="text-2xl font-black text-[#0D7377]">
                            {loading ? "..." : productionCycleCount}
                        </p>
                        <span className="text-lg font-bold text-[#0D7377]">รอบ</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FarmerDashboard;