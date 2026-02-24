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
    startDate?: string;
    endDate?: string | null;
}

interface SummaryData {
    fishType?: string;
    avgWeight?: string | number;
    releaseCount?: string | number;
    remainingCount?: string | number;
    survivalRate?: number | null;
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
    summary?: SummaryData;
}

const getStatusBadge = (status: string, isActive: boolean) => {
    if (!isActive) {
        return <span className="bg-red-100 text-red-600 px-2.5 py-0.5 rounded-full text-xs font-bold">สิ้นสุดแล้ว</span>;
    }
    if (status === 'PLANNING') {
        return <span className="bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full text-xs font-bold">รอการบันทึกข้อมูล</span>;
    }
    return <span className="bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-bold">กำลังดำเนินการ</span>;
};

const getDurationDays = (startDate?: string, endDate?: string | null, isActive?: boolean) => {
    if (!startDate) return null;
    const start = new Date(startDate).getTime();
    const end = (!isActive && endDate) ? new Date(endDate).getTime() : Date.now();
    return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
};

const getSurvivalColor = (p: number | null | undefined) => {
    if (p === null || p === undefined) return { ring: 'stroke-gray-200', text: 'text-gray-400', badge: 'bg-gray-100 text-gray-400', label: '-' };
    if (p >= 90) return { ring: 'stroke-emerald-500', text: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-700', label: 'สูง' };
    if (p >= 75) return { ring: 'stroke-amber-500', text: 'text-amber-600', badge: 'bg-amber-50 text-amber-700', label: 'ปกติ' };
    if (p >= 50) return { ring: 'stroke-orange-500', text: 'text-orange-600', badge: 'bg-orange-50 text-orange-700', label: 'ค่อนข้างต่ำ' };
    return { ring: 'stroke-red-500', text: 'text-red-600', badge: 'bg-red-50 text-red-700', label: 'ต่ำมาก' };
};

const SurvivalRing = ({ percentage }: { percentage: number | null | undefined }) => {
    const color = getSurvivalColor(percentage);
    const r = 28;
    const circumference = 2 * Math.PI * r;
    const offset = (percentage !== null && percentage !== undefined) ? circumference - (percentage / 100) * circumference : circumference;
    return (
        <div className="relative w-16 h-16">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r={r} fill="none" strokeWidth="5" className="stroke-gray-100" />
                <circle cx="32" cy="32" r={r} fill="none" strokeWidth="5"
                    strokeLinecap="round"
                    className={`${color.ring} transition-all duration-1000 ease-out`}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-xs font-black ${color.text}`}>
                    {(percentage !== null && percentage !== undefined) ? `${percentage}%` : '-'}
                </span>
            </div>
        </div>
    );
};

const FarmerToolbar = ({
    isHistoryLoading = false,
    activePond = 'ALL',
    setActivePond,
    setCurrentPage,
    ponds = [],
    productionCycles = [],
    activeProductionCycle,
    setActiveProductionCycle,
    summary,
}: FarmerToolbarProps) => {
    const viewingCycle = productionCycles.find(c => c.id === activeProductionCycle);

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

            {/* Production Cycle Card - Light background */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-sm p-5">
                {/* Header with cycle selector */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-5 bg-amber-500 rounded-full" />
                        {productionCycles.length > 1 ? (
                            <div className="relative inline-block">
                                <select
                                    value={activeProductionCycle || ''}
                                    onChange={(e) => {
                                        setActiveProductionCycle?.(e.target.value);
                                        setCurrentPage?.(1);
                                    }}
                                    disabled={isHistoryLoading}
                                    className="appearance-none bg-gray-50 border border-gray-200 text-sm font-bold text-gray-800 pl-3 pr-8 py-1.5 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#179678]/30 focus:border-[#179678] transition-all disabled:opacity-50"
                                >
                                    {productionCycles.map((cycle) => (
                                        <option key={cycle.id} value={cycle.id}>
                                            {cycle.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                                </div>
                            </div>
                        ) : productionCycles.length === 1 ? (
                            <span className="text-sm font-bold text-gray-800">{productionCycles[0].label}</span>
                        ) : (
                            <span className="text-sm font-bold text-gray-800">รอบการเลี้ยง</span>
                        )}
                    </div>
                    {viewingCycle && getStatusBadge(viewingCycle.status, viewingCycle.isActive)}
                </div>

                {/* Cycle details */}
                {viewingCycle ? (
                    <div className="space-y-2.5 bg-gray-50/80 rounded-xl p-4 border border-gray-100">
                        {/* Date & Duration — hide when PLANNING */}
                        {viewingCycle.status !== 'PLANNING' && viewingCycle.startDate ? (
                            <>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">วันที่เริ่มปล่อยปลา</span>
                                    <span className="font-semibold text-gray-800">
                                        {new Date(viewingCycle.startDate).toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                    </span>
                                </div>

                                {/* End date — only for ended cycles */}
                                {!viewingCycle.isActive && viewingCycle.endDate && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">วันที่สิ้นสุด</span>
                                        <span className="font-semibold text-gray-800">
                                            {new Date(viewingCycle.endDate).toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                        </span>
                                    </div>
                                )}

                                {/* Duration */}
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">ระยะเวลา</span>
                                    <span className="font-semibold text-[#034A30]">
                                        {getDurationDays(viewingCycle.startDate, viewingCycle.endDate, viewingCycle.isActive)} วัน
                                    </span>
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-gray-400">รอการบันทึกข้อมูลรอบนี้</p>
                        )}
                    </div>
                ) : (
                    <p className="text-sm text-gray-400">{productionCycles.length === 0 ? 'ไม่มีข้อมูลรอบการเลี้ยง' : 'กำลังเตรียมรอบการเลี้ยง...'}</p>
                )}

                {/* Summary Section */}
                {summary && (
                    <div className="mt-4 pt-4 border-t border-gray-200/60">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-1 h-5 bg-[#034A30] rounded-full" />
                            <span className="text-sm font-bold text-gray-800">ข้อมูลสรุป</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {/* Row 1: ประเภทปลา, น้ำหนักเฉลี่ย, อัตราการรอด */}
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3.5 border border-amber-100/60">
                                <div className="flex items-center gap-1.5 mb-1.5">
                                    <img src={`${ICON_BASE}/icon_farmers/ion_fish.svg`} alt="" width={14} height={14} />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">ประเภทปลา</span>
                                </div>
                                <p className="text-lg font-black text-gray-900">{isHistoryLoading ? '...' : (summary.fishType || '-')}</p>
                            </div>

                            <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-3.5 border border-violet-100/60">
                                <div className="flex items-center gap-1.5 mb-1.5">
                                    <img src={`${ICON_BASE}/icon_farmers/line.svg`} alt="" width={14} height={14} />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">น้ำหนักเฉลี่ย</span>
                                </div>
                                <p className="text-lg font-black text-gray-900">{isHistoryLoading ? '...' : (summary.avgWeight ?? '-')} <span className="text-xs font-semibold text-gray-400">กรัม</span></p>
                            </div>

                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3.5 border border-emerald-100/60 flex items-center gap-3">
                                <SurvivalRing percentage={isHistoryLoading ? null : (summary.survivalRate ?? null)} />
                                <div>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">อัตราการรอด</span>
                                    <span className={`text-xs font-bold mt-1 block ${getSurvivalColor(summary.survivalRate).badge} px-2 py-0.5 rounded-full text-center`}>
                                        {getSurvivalColor(summary.survivalRate).label}
                                    </span>
                                </div>
                            </div>

                            {/* Row 2: จำนวนที่ปล่อย, คงเหลือ */}
                            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-3.5 border border-sky-100/60">
                                <div className="flex items-center gap-1.5 mb-1.5">
                                    <img src={`${ICON_BASE}/icon_farmers/ix_water-fish.svg`} alt="" width={14} height={14} />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">จำนวนที่ปล่อย</span>
                                </div>
                                <p className="text-lg font-black text-gray-900">{isHistoryLoading ? '...' : (summary.releaseCount ?? '-')} <span className="text-xs font-semibold text-gray-400">ตัว</span></p>
                            </div>

                            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-3.5 border border-orange-100/60">
                                <div className="flex items-center gap-1.5 mb-1.5">
                                    <img src={`${ICON_BASE}/icon_farmers/Group 1000003034.svg`} alt="" width={14} height={14} />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">คงเหลือ</span>
                                </div>
                                <p className="text-lg font-black text-gray-900">{isHistoryLoading ? '...' : (summary.remainingCount ?? '-')} <span className="text-xs font-semibold text-gray-400">ตัว</span></p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FarmerToolbar;