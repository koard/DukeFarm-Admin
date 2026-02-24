'use client';

import Image from 'next/image';

import ViewIcon from '../../assets/fm-search-table.svg';
import EditIcon from '../../assets/rc-edit.svg';
import DeleteIcon from '../../assets/fm-delete.svg';

export interface FarmerHistory {
    id: string;
    date: string;

    farmType?: string | null;

    initialFishCount?: number | string;
    remainingFishCount?: number | string;
    foodType?: string;
    foodAmountKg?: number | null;
    medicineGiven?: string;

    fishAgeDays?: number | null;
    age?: number | string;
    weight?: number;
    pondType?: string;
    pondCount?: number | string;
    fishCount?: number | string;
    temp?: string;
    rain?: number;
    humidity?: number;
}

interface FarmerHistoryTableProps {
    data: FarmerHistory[];
    onView?: (item: FarmerHistory) => void;
    onEdit?: (item: FarmerHistory) => void;
    onDelete?: (item: FarmerHistory) => void;
    startIndex?: number;
}

const FARM_TYPE_MAP: Record<string, string> = {
    'SMALL': 'ปลาตุ้ม',
    'LARGE': 'ปลานิ้ว',
    'MARKET': 'ปลาตลาด',
    'small': 'ปลาตุ้ม',
    'large': 'ปลานิ้ว',
    'market': 'ปลาตลาด',
    'ALL': 'ทั้งหมด'
};

const FarmerHistoryTable = ({
    data,
    onView,
    onEdit,
    onDelete,
    startIndex = 0
}: FarmerHistoryTableProps) => {

    const formatNumber = (num?: number | string | null) => {
        if (num === null || num === undefined || num === '-') return '-';
        if (typeof num === 'string') return num;
        return num.toLocaleString();
    };

    if (!data || data.length === 0) {
        return (
            <div className="w-full">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-5 bg-[#034A30] rounded-full" />
                    <h3 className="text-sm font-bold text-gray-800">ประวัติการบันทึกข้อมูล</h3>
                </div>
                <div className="flex flex-col items-center justify-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-sm">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                        </svg>
                    </div>
                    <p className="text-sm font-semibold text-gray-400">ไม่พบรายการเก็บข้อมูล</p>
                    <p className="text-xs text-gray-300 mt-1">เลือกบ่อหรือรอบการเลี้ยงเพื่อดูข้อมูล</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Section header */}
            <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-5 bg-[#034A30] rounded-full" />
                    <h3 className="text-sm font-bold text-gray-800">ประวัติการบันทึกข้อมูล</h3>
                    <span className="px-2.5 py-0.5 bg-[#034A30]/10 text-[#034A30] text-xs font-bold rounded-full">
                        {data.length} รายการ
                    </span>
                </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] table-auto">
                        <thead>
                            <tr className="bg-gradient-to-r from-[#034A30] to-[#0A8865]">
                                <th className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-white/90 w-[50px]">#</th>
                                <th className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-white/90">วันที่</th>
                                <th className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-white/90">ประเภทฟาร์ม</th>
                                <th className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-white/90">ปล่อย (ตัว)</th>
                                <th className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-white/90">คงเหลือ (ตัว)</th>
                                <th className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-white/90">ประเภทอาหาร</th>
                                <th className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-white/90">อาหาร (กก.)</th>
                                <th className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-white/90">การให้ยา</th>
                                <th className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-white/90 w-[110px]">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-700">
                            {data.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className="border-b border-gray-100/80 last:border-b-0 hover:bg-[#034A30]/[0.03] transition-colors duration-150 group"
                                >
                                    <td className="px-4 py-3.5 text-center">
                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 text-xs font-bold text-gray-500 group-hover:bg-[#034A30]/10 group-hover:text-[#034A30] transition-colors">
                                            {startIndex + index + 1}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-center whitespace-nowrap font-medium">{item.date}</td>
                                    <td className="px-4 py-3.5 text-center">
                                        {item.farmType ? (
                                            <span className="inline-block px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-bold">
                                                {FARM_TYPE_MAP[item.farmType] || item.farmType}
                                            </span>
                                        ) : '-'}
                                    </td>
                                    <td className="px-4 py-3.5 text-center font-semibold">
                                        {formatNumber(item.initialFishCount || item.fishCount)}
                                    </td>
                                    <td className="px-4 py-3.5 text-center font-semibold">
                                        {formatNumber(item.remainingFishCount)}
                                    </td>
                                    <td className="px-4 py-3.5 text-center">
                                        {item.foodType || '-'}
                                    </td>
                                    <td className="px-4 py-3.5 text-center font-semibold">
                                        {(item.foodAmountKg !== null && item.foodAmountKg !== undefined) ? item.foodAmountKg : '-'}
                                    </td>
                                    <td className="px-4 py-3.5 text-center">
                                        {item.medicineGiven ? (
                                            <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold">
                                                {item.medicineGiven}
                                            </span>
                                        ) : (
                                            <span className="text-gray-300">-</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3.5 text-center">
                                        <div className="flex justify-center items-center gap-1.5">
                                            <button
                                                onClick={() => onView?.(item)}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-50 transition-all duration-200 hover:scale-110"
                                                title="ดูรายละเอียด"
                                            >
                                                <Image src={ViewIcon} alt="view" width={18} height={18} />
                                            </button>
                                            <button
                                                onClick={() => onEdit?.(item)}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-amber-50 transition-all duration-200 hover:scale-110"
                                                title="แก้ไข"
                                            >
                                                <Image src={EditIcon} alt="edit" width={18} height={18} />
                                            </button>
                                            <button
                                                onClick={() => onDelete?.(item)}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 transition-all duration-200 hover:scale-110"
                                                title="ลบ"
                                            >
                                                <Image src={DeleteIcon} alt="delete" width={18} height={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FarmerHistoryTable;