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

const TableHeader = ({ title }: { title: string }) => (
    <div className="flex items-center justify-center gap-2">
        <span>{title}</span>
    </div>
);

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
                <div className="text-center py-10 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
                    ไม่พบรายการเก็บข้อมูล
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">

            <div className="flex items-center justify-between gap-4 mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                    ประวัติการบันทึก
                </h3>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px] table-auto">
                        <thead>
                            <tr className="text-sm font-medium text-[#ACACAC] bg-black">
                                <th className="p-3 text-center w-[60px]"><TableHeader title="No." /></th>
                                <th className="p-3 text-center"><TableHeader title="วันที่เก็บข้อมูล" /></th>
                                <th className="p-3 text-center"><TableHeader title="ประเภทฟาร์ม" /></th>                              
                                <th className="p-3 text-center"><TableHeader title="จำนวนปลาที่ปล่อย (ตัว)" /></th>
                                <th className="p-3 text-center"><TableHeader title="จำนวนปลาที่เหลือ (ตัว)" /></th>
                                <th className="p-3 text-center"><TableHeader title="ประเภทอาหาร" /></th>
                                <th className="p-3 text-center"><TableHeader title="ปริมาณอาหาร (กก.)" /></th>
                                <th className="p-3 text-center"><TableHeader title="การให้ยา" /></th>
                                
                                <th className="p-3 text-center w-[120px]">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-900 font-normal">
                            {data.map((item, index) => (
                                <tr key={item.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-center">{startIndex + index + 1}</td>
                                    <td className="p-4 text-center whitespace-nowrap">{item.date}</td>

                                    <td className="p-4 text-center">
                                        {item.farmType ? (FARM_TYPE_MAP[item.farmType] || item.farmType) : '-'}
                                    </td>

                                    <td className="p-4 text-center">
                                        {formatNumber(item.initialFishCount || item.fishCount)} 
                                    </td>
                                    
                                    <td className="p-4 text-center">
                                        {formatNumber(item.remainingFishCount)}
                                    </td>

                                    <td className="p-4 text-center">
                                        {item.foodType || '-'}
                                    </td>

                                    <td className="p-4 text-center">
                                        {(item.foodAmountKg !== null && item.foodAmountKg !== undefined) ? item.foodAmountKg : '-'}
                                    </td>

                                    <td className="p-4 text-center">
                                        {item.medicineGiven || '-'}
                                    </td>

                                    <td className="p-4 text-center">
                                        <div className="flex justify-center items-center gap-3">
                                            <button
                                                onClick={() => onView && onView(item)}
                                                className="hover:opacity-75 transition-opacity"
                                                title="ดูรายละเอียด"
                                            >
                                                <Image src={ViewIcon} alt="view" width={20} height={20} className="w-5 h-5" />
                                            </button>

                                            <button
                                                onClick={() => onEdit && onEdit(item)}
                                                className="hover:opacity-75 transition-opacity"
                                                title="แก้ไข"
                                            >
                                                <Image src={EditIcon} alt="edit" width={20} height={20} className="w-5 h-5" />
                                            </button>

                                            <button
                                                onClick={() => onDelete && onDelete(item)}
                                                className="hover:opacity-75 transition-opacity"
                                                title="ลบ"
                                            >
                                                <Image src={DeleteIcon} alt="delete" width={20} height={20} className="w-5 h-5" />
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