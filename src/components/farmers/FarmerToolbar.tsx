'use client';

import React from 'react';

const ICON_BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

interface PondItem {
    id: string;
    label: string;
}

interface ProductionCycleItem {
    id: string;
    label: string;
    status: string;
    isActive: boolean;
}

interface FarmerToolbarProps {
    isHistoryLoading?: boolean;
    activePond?: string;
    setActivePond?: (val: string) => void;
    setCurrentPage?: (val: number) => void;
    ponds?: PondItem[];
    productionCycles?: ProductionCycleItem[];
    activeProductionCycle?: string;
    setActiveProductionCycle?: (val: string) => void;
}

const FarmerToolbar = ({
    isHistoryLoading = false,
    activePond = 'ALL',
    setActivePond,
    setCurrentPage,
    ponds = [],
    productionCycles = [],
    activeProductionCycle,
    setActiveProductionCycle,
}: FarmerToolbarProps) => {
    return (
        <div className="space-y-4 mb-6">
            {/* Pond Selection - Horizontal scrollable pills */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-sm p-4">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-1 h-5 bg-[#179678] rounded-full" />
                    <span className="text-sm font-bold text-gray-800">เลือกบ่อ</span>
                    {isHistoryLoading && (
                        <div className="flex items-center gap-1.5 ml-auto">
                            <div className="w-1.5 h-1.5 bg-[#179678] rounded-full animate-pulse" />
                            <span className="text-xs text-gray-400 animate-pulse">กำลังโหลด...</span>
                        </div>
                    )}
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {ponds.length > 0 ? ponds.map((pond) => {
                        const isActive = activePond === pond.id;
                        return (
                            <button
                                key={pond.id}
                                onClick={() => {
                                    setActivePond?.(pond.id);
                                    setCurrentPage?.(1);
                                }}
                                className={`group relative flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${isActive
                                    ? 'bg-gradient-to-r from-[#034A30] to-[#0A8865] text-white shadow-lg shadow-[#034A30]/25 scale-[1.02]'
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800 hover:shadow-md border border-gray-200/60'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-white/20' : 'bg-white shadow-sm'}`}>
                                    <img
                                        src={isActive ? `${ICON_BASE}/icon_farmers/famicons_fish_w.svg` : `${ICON_BASE}/icon_farmers/famicons_fish_b.svg`}
                                        alt="fish-icon"
                                        width={18}
                                        height={18}
                                        className="object-contain"
                                    />
                                </div>
                                <span>{pond.label}</span>
                                {isActive && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                                )}
                            </button>
                        );
                    }) : (
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50 text-sm text-gray-400">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>
                            ไม่มีข้อมูลบ่อ
                        </div>
                    )}
                </div>
            </div>

            {/* Production Cycle Selector */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-sm p-4">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-1 h-5 bg-amber-500 rounded-full" />
                    <span className="text-sm font-bold text-gray-800">รอบการเลี้ยง</span>
                </div>
                <div className="relative">
                    <select
                        value={activeProductionCycle || ''}
                        onChange={(e) => {
                            setActiveProductionCycle?.(e.target.value);
                            setCurrentPage?.(1);
                        }}
                        disabled={productionCycles.length === 0 || isHistoryLoading}
                        className="w-full appearance-none px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#179678]/30 focus:border-[#179678] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed pr-10"
                    >
                        {productionCycles.length === 0 ? (
                            <option value="">ไม่มีข้อมูลรอบการเลี้ยง</option>
                        ) : (
                            productionCycles.map((cycle) => (
                                <option key={cycle.id} value={cycle.id}>
                                    {cycle.label} {cycle.isActive ? '● ปัจจุบัน' : ''}
                                </option>
                            ))
                        )}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FarmerToolbar;