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

const getSurvivalColor = (p: number | null) => {
    if (p === null) return { ring: 'stroke-gray-200', text: 'text-gray-400', badge: 'bg-gray-100 text-gray-400', label: '-' };
    if (p >= 90) return { ring: 'stroke-emerald-500', text: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-700', label: 'สูง' };
    if (p >= 75) return { ring: 'stroke-amber-500', text: 'text-amber-600', badge: 'bg-amber-50 text-amber-700', label: 'ปกติ' };
    if (p >= 50) return { ring: 'stroke-orange-500', text: 'text-orange-600', badge: 'bg-orange-50 text-orange-700', label: 'ค่อนข้างต่ำ' };
    return { ring: 'stroke-red-500', text: 'text-red-600', badge: 'bg-red-50 text-red-700', label: 'ต่ำมาก' };
};

/* Animated ring for survival rate */
const SurvivalRing = ({ percentage }: { percentage: number | null }) => {
    const color = getSurvivalColor(percentage);
    const r = 36;
    const circumference = 2 * Math.PI * r;
    const offset = percentage !== null ? circumference - (percentage / 100) * circumference : circumference;

    return (
        <div className="relative w-24 h-24 mx-auto">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r={r} fill="none" strokeWidth="6" className="stroke-gray-100" />
                <circle
                    cx="40" cy="40" r={r} fill="none" strokeWidth="6"
                    strokeLinecap="round"
                    className={`${color.ring} transition-all duration-1000 ease-out`}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-lg font-black ${color.text}`}>
                    {percentage !== null ? `${percentage}%` : '-'}
                </span>
            </div>
        </div>
    );
};

const StatCard = ({
    icon, label, value, unit, gradient, textColor = 'text-gray-900', delay = '0ms',
    children,
}: {
    icon: React.ReactNode; label: string; value: string | number; unit?: string;
    gradient: string; textColor?: string; delay?: string;
    children?: React.ReactNode;
}) => (
    <div
        className={`group relative ${gradient} rounded-2xl p-5 shadow-sm border border-white/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
        style={{ animationDelay: delay }}
    >
        {/* Decorative corner blob */}
        <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
        <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-white/30 backdrop-blur-sm flex items-center justify-center shadow-sm">
                    {icon}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider opacity-70">{label}</span>
            </div>
            {children ?? (
                <div className="flex items-baseline gap-1.5">
                    <p className={`text-3xl font-black ${textColor} tracking-tight`}>{value}</p>
                    {unit && <span className="text-sm font-bold opacity-60">{unit}</span>}
                </div>
            )}
        </div>
    </div>
);

const FarmerDashboard = ({
    loading = false,
    fishType = "-",
    avgWeight = "-",
    releaseCount = "-",
    remainingCount = "-",
    survivalRate = null,
}: FarmerDashboardProps) => {

    const survivalColor = getSurvivalColor(survivalRate);
    const v = (val: string | number) => loading ? '...' : val;

    return (
        <div className="w-full mb-6">
            {/* Section header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-5 bg-[#034A30] rounded-full" />
                <h3 className="text-sm font-bold text-gray-800">ข้อมูลสรุป</h3>
            </div>

            {/* Bento grid layout */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">

                {/* ประเภทปลา */}
                <StatCard
                    gradient="bg-gradient-to-br from-amber-50 to-orange-50"
                    icon={<img src={`${ICON_BASE}/icon_farmers/ion_fish.svg`} alt="" width={18} height={18} />}
                    label="ประเภทปลา"
                    value={v(fishType)}
                    delay="0ms"
                />

                {/* น้ำหนักปลาเฉลี่ย */}
                <StatCard
                    gradient="bg-gradient-to-br from-violet-50 to-purple-50"
                    icon={<img src={`${ICON_BASE}/icon_farmers/line.svg`} alt="" width={18} height={18} />}
                    label="น้ำหนักเฉลี่ย"
                    value={v(avgWeight)}
                    unit="กรัม"
                    delay="50ms"
                />

                {/* อัตราการรอด - Ring visualization */}
                <div className="row-span-2 group relative bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 shadow-sm border border-emerald-100/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-100/40 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
                    <div className="relative z-10 flex flex-col items-center gap-3">
                        <div className="flex items-center gap-2 mb-1">
                            <img src={`${ICON_BASE}/icon_farmers/famicons_fish-bb.svg`} alt="" width={18} height={18} />
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">อัตราการรอด</span>
                        </div>
                        <SurvivalRing percentage={loading ? null : survivalRate} />
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${survivalColor.badge}`}>
                            {survivalColor.label}
                        </span>
                    </div>
                </div>

                {/* จำนวนที่ปล่อย */}
                <StatCard
                    gradient="bg-gradient-to-br from-sky-50 to-blue-50"
                    icon={<img src={`${ICON_BASE}/icon_farmers/ix_water-fish.svg`} alt="" width={18} height={18} />}
                    label="จำนวนที่ปล่อย"
                    value={v(releaseCount)}
                    unit="ตัว"
                    delay="100ms"
                />

                {/* คงเหลือ */}
                <StatCard
                    gradient="bg-gradient-to-br from-orange-50 to-amber-50"
                    icon={<img src={`${ICON_BASE}/icon_farmers/Group 1000003034.svg`} alt="" width={18} height={18} />}
                    label="คงเหลือ"
                    value={v(remainingCount)}
                    unit="ตัว"
                    delay="150ms"
                />

            </div>
        </div>
    );
};

export default FarmerDashboard;