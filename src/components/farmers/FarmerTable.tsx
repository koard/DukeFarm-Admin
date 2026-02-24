'use client';

import Image from 'next/image';
import Link from 'next/link';

import ViewIcon from '../../assets/fm-search-table.svg';
import DeleteIcon from '../../assets/fm-delete.svg';
import type { FarmerListItem } from '@/types/farmer';

const FARM_TYPE_LABEL: Record<string, string> = {
    SMALL: 'ปลาตุ้ม',
    LARGE: 'ปลานิ้ว',
    MARKET: 'ปลาตลาด',
    small: 'ปลาตุ้ม',
    large: 'ปลานิ้ว',
    market: 'ปลาตลาด',
};

const getFarmTypeArray = (farmer: any): string[] => {
    let types: string[] = [];

    if (Array.isArray(farmer.farmTypes) && farmer.farmTypes.length > 0) {
        types = farmer.farmTypes;
    }
    else if (farmer.farmType) {
        types = [farmer.farmType];
    }
    else if (farmer.groupType) {
        types = farmer.groupType.split(',').map((t: string) => t.trim());
    }

    return types;
};

interface FarmerTableProps {
    farmersData: FarmerListItem[];
    onDeleteClick: (farmer: FarmerListItem) => void;
    startIndex?: number;
}

const TableHeader = ({ title }: { title: string }) => (
    <div className="flex items-center justify-center gap-2">
        <span>{title}</span>
    </div>
);

const FarmerTable = ({ farmersData, onDeleteClick, startIndex = 0 }: FarmerTableProps) => {

    if (farmersData.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500 bg-white rounded-xl shadow-sm">
                ไม่พบข้อมูล
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl">
            <table className="w-full min-w-[1000px] table-auto">
                <thead>
                    <tr className="text-sm font-medium text-[#ACACAC] bg-black ">
                        <th className="p-4 text-center w-16"><TableHeader title="No." /></th>
                        <th className="p-4 text-left">
                            <div className="flex items-center gap-2">
                                <span>ชื่อ-นามสกุล</span>
                            </div>
                        </th>
                        <th className="p-4 text-center"><TableHeader title="เบอร์โทร" /></th>
                        <th className="p-4 text-center"><TableHeader title="ประเภทกลุ่มการเลี้ยง" /></th>
                        <th className="p-4 text-center"><TableHeader title="จำนวนบ่อที่ลงทะเบียน" /></th>
                        <th className="p-4 text-center"><TableHeader title="จำนวนการบันทึก" /></th>
                        <th className="p-4 text-center"><TableHeader title="บันทึกล่าสุด" /></th>
                        <th className="p-4 text-center"><TableHeader title="วันที่ลงทะเบียน" /></th>
                        <th className="p-4 text-center w-24">Action</th>
                    </tr>
                </thead>
                <tbody className="text-sm text-gray-900 font-normal">
                    {farmersData.map((farmer, index) => {
                        const typeArray = getFarmTypeArray(farmer);

                        const regDate = farmer.registeredDate ||
                            ((farmer as any).registeredAt ? new Date((farmer as any).registeredAt).toLocaleDateString('th-TH') : '-');

                        const totalRecords = (farmer as any).totalRecords ?? 0;
                        const lastRecordRaw = (farmer as any).lastRecordDate;
                        const lastRecordDisplay = lastRecordRaw
                            ? new Date(lastRecordRaw).toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' })
                            : '-';

                        return (
                            <tr key={`${farmer.id}-${index}`} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                                <td className="p-4 text-center">{farmer.rowNumber ?? startIndex + index + 1}</td>
                                <td className="p-4 text-left font-medium text-gray-900">{farmer.name || (farmer as any).fullName}</td>
                                <td className="p-4 text-center">{farmer.phone}</td>

                                <td className="p-4">
                                    <div className="flex flex-wrap justify-center gap-2 max-w-[250px] mx-auto">
                                        {typeArray.length > 0 ? (
                                            typeArray.map((t, idx) => {
                                                const label = FARM_TYPE_LABEL[t] || FARM_TYPE_LABEL[t.toUpperCase()] || t;
                                                return (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700 border border-green-600 whitespace-nowrap"
                                                    >
                                                        {label}
                                                    </span>
                                                );
                                            })
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </div>
                                </td>

                                <td className="p-4 text-center">{farmer.pondCount ?? '-'}</td>
                                <td className="p-4 text-center">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                        {totalRecords} รายการ
                                    </span>
                                </td>
                                <td className="p-4 text-center whitespace-nowrap">
                                    {lastRecordDisplay !== '-' ? (
                                        <span className="text-gray-700">{lastRecordDisplay}</span>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>

                                <td className="p-4 text-center whitespace-nowrap">
                                    {regDate}
                                </td>
                                <td className="p-4">
                                    <div className="flex justify-center items-center gap-3">
                                        <Link
                                            href={`/farmers/${farmer.id}?name=${encodeURIComponent(farmer.name || (farmer as any).fullName || '')}`}
                                            className="hover:opacity-75 transition-opacity"
                                        >
                                            <Image src={ViewIcon} alt="view" width={20} height={20} className="w-5 h-5" />
                                        </Link>

                                        <button onClick={() => onDeleteClick(farmer)} className="hover:opacity-75 transition-opacity">
                                            <Image src={DeleteIcon} alt="delete" width={20} height={20} className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default FarmerTable;