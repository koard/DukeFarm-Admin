'use client';

import React, { useState, useEffect, useRef } from 'react';

const FARM_TYPE_OPTIONS = [
    { label: 'ทั้งหมด', value: '' },
    { label: 'ปลาตุ้ม', value: 'SMALL' },
    { label: 'ปลานิ้ว', value: 'LARGE' },
    { label: 'ปลาตลาด', value: 'MARKET' },
];

interface FarmerListToolbarProps {
    totalCount: number;
    onSearchChange: (term: string) => void;
    onFarmTypeChange: (farmType: string) => void;
    selectedFarmType?: string;
}

const FarmerListToolbar = ({
    totalCount,
    onSearchChange,
    onFarmTypeChange,
    selectedFarmType = '',
}: FarmerListToolbarProps) => {
    const [searchValue, setSearchValue] = useState('');
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Debounce search input
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            onSearchChange(searchValue);
        }, 400);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [searchValue, onSearchChange]);

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">

            {/* ซ้าย: จำนวนเกษตรกร + ค้นหา */}
            <div className="flex items-center gap-4">
                <div className="bg-[#034A30] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm whitespace-nowrap">
                    เกษตรกรทั้งหมด {totalCount} คน
                </div>
                <div className="relative">
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        width="16" height="16" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                        <path d="M16 16L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <input
                        type="text"
                        placeholder="ค้นหาชื่อ หรือ เบอร์โทร..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="pl-9 pr-4 py-2 w-64 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#034A30] focus:border-transparent shadow-sm placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* ขวา: Filter ประเภท */}
            <div className="flex items-center gap-2">
                {FARM_TYPE_OPTIONS.map((opt) => {
                    const isActive = selectedFarmType === opt.value;
                    return (
                        <button
                            key={opt.value}
                            onClick={() => onFarmTypeChange(opt.value)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 border ${isActive
                                    ? 'bg-[#179678] text-white border-[#179678] shadow-sm'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {opt.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default FarmerListToolbar;
