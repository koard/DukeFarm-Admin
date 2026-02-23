'use client';

import React from 'react';
import Image from 'next/image';

const PERIOD_FILTERS = [
    { label: 'ข้อมูลย้อนหลัง 1 เดือน', value: '1M' },
    { label: 'ข้อมูลย้อนหลัง 3 เดือน', value: '3M' },
    { label: 'ข้อมูลย้อนหลัง 6 เดือน', value: '6M' },
    { label: 'ข้อมูลทั้งหมด', value: 'ALL' },
];

const MOCK_PONDS = [
    { id: 'pond_1', label: 'บ่อที่ 1' },
    { id: 'pond_2', label: 'บ่อที่ 2' },
];

interface FarmerToolbarProps {
    isHistoryLoading: boolean;
    activePond: string;
    setActivePond: (val: string) => void;
    filterPeriod: string;
    setFilterPeriod: (val: string) => void;
    setCurrentPage: (val: number) => void;
}

const FarmerToolbar = ({
    isHistoryLoading,
    activePond,
    setActivePond,
    filterPeriod,
    setFilterPeriod,
    setCurrentPage,
}: FarmerToolbarProps) => {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            
            {/* ซ้าย: ส่วนปุ่มเลือกบ่อ */}
            <div className="flex flex-wrap items-center gap-2">
                {MOCK_PONDS.map((pond) => {
                    const isActive = activePond === pond.id;
                    return (
                        <button
                            key={pond.id}
                            onClick={() => {
                                setActivePond(pond.id);
                                setCurrentPage(1);
                            }}
                            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 border ${
                                isActive
                                    ? 'bg-[#179678] text-white border-[#179678] shadow-sm' 
                                    : 'bg-white text-gray-800 border-gray-400 hover:bg-gray-50'
                            }`}
                        >
                            <Image
                                src={isActive ? "/icon_farmers/famicons_fish_w.svg" : "/icon_farmers/famicons_fish_b.svg"}
                                alt="fish-icon"
                                width={18}
                                height={18}
                                className="object-contain"
                            />
                            {pond.label}
                        </button>
                    );
                })}
            </div>

            {/* ขวา: ส่วนกรองเดือน */}
            <div className="flex items-center gap-2">
                {isHistoryLoading && <span className="text-sm font-normal text-gray-500 mr-2">(กำลังโหลด...)</span>}
                <select
                    value={filterPeriod}
                    onChange={(e) => {
                        setFilterPeriod(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#034A30] focus:border-transparent shadow-sm cursor-pointer"
                >
                    {PERIOD_FILTERS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
            
        </div>
    );
};

export default FarmerToolbar;