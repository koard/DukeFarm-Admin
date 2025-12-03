'use client';

import Image from 'next/image';
import Link from 'next/link';

import SortIcon from '../../assets/fm-arrow.svg';
import ViewIcon from '../../assets/fm-search-table.svg';
import DeleteIcon from '../../assets/fm-delete.svg';
import type { FarmerListItem } from '@/types/farmer';

interface FarmerTableProps {
    farmersData: FarmerListItem[];
    onDeleteClick: (farmer: FarmerListItem) => void;
  startIndex?: number;
}

const TableHeader = ({ title }: { title: string }) => (
    <div className="flex items-center justify-center gap-2">
        <span>{title}</span>
        <Image src={SortIcon} alt="sort" width={16} height={16} className="w-4 h-4 opacity-60" />
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
            <table className="w-full min-w-[1100px] table-auto">
                <thead>
                    <tr className="text-sm font-medium text-[#ACACAC] bg-black ">
                        <th className="p-4 text-center"><TableHeader title="No." /></th>
                        <th className="p-4 text-left">
                            <div className="flex items-center gap-2">
                                <span>ชื่อ-นามสกุล</span>
                                <Image src={SortIcon} alt="sort" width={16} height={16} className="w-4 h-4 opacity-60" />
                            </div>
                        </th>
                        <th className="p-4 text-center"><TableHeader title="เบอร์โทร" /></th>
                        <th className="p-4 text-center"><TableHeader title="ประเภทกลุ่มการเลี้ยง" /></th>
                        <th className="p-4 text-center"><TableHeader title="ประเภทบ่อ" /></th>
                        <th className="p-4 text-center"><TableHeader title="จำนวนบ่อ" /></th>
                        <th className="p-4 text-center"><TableHeader title="ตำแหน่งฟาร์ม" /></th>
                        <th className="p-4 text-center"><TableHeader title="วันที่ลงทะเบียน" /></th>
                        <th className="p-4 text-center">Action</th>
                    </tr>
                </thead>
                <tbody className="text-sm text-gray-900 font-normal">
                    {farmersData.map((farmer, index) => (
                        <tr key={`${farmer.id}-${index}`} className="border-b border-gray-100 last:border-b-0">
                            <td className="p-4 text-center">{farmer.rowNumber ?? startIndex + index + 1}</td>
                            <td className="p-4 text-left">{farmer.name}</td>
                            <td className="p-4 text-center">{farmer.phone}</td>
                            <td className="p-4 text-center">{farmer.groupType}</td>
                            <td className="p-4 text-center">{farmer.pondType ?? '-'}</td>
                            <td className="p-4 text-center">{farmer.pondCount ?? '-'}</td>
                            <td className="p-4 text-center">
                                <button className="text-gray-900 underline">{farmer.location}</button>
                            </td>
                            <td className="p-4 text-center">{farmer.registeredDate}</td>
                            <td className="p-4">
                                <div className="flex justify-center items-center gap-3">
                                    
                                    <Link 
                                        href={`/farmers/${farmer.id}?name=${encodeURIComponent(farmer.name)}`} 
                                        className="hover:opacity-75"
                                    >
                                        <Image src={ViewIcon} alt="view" width={20} height={20} className="w-5 h-5" />
                                    </Link>
                                    
                                    <button onClick={() => onDeleteClick(farmer)} className="hover:opacity-75">
                                        <Image src={DeleteIcon} alt="delete" width={20} height={20} className="w-5 h-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FarmerTable;