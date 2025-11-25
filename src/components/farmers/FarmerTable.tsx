'use client';

import Image from 'next/image';

import SortIcon from '../../assets/fm-arrow.svg';
import UpArrowIcon from '../../assets/fm-arrow-top.svg';
import DownArrowIcon from '../../assets/fm-arrow-down.svg';
import ViewIcon from '../../assets/fm-search-table.svg';
import DeleteIcon from '../../assets/fm-delete.svg';

export interface Farmer {
  id: number;
  name: string;
  phone: string;
  groupType: string;
  pondType: string;
  pondCount: number;
  location: string;
  registeredDate: string;
  survivalRate: number;
  change: string;
}

interface FarmerTableProps {
  farmersData: Farmer[];
  onDeleteClick: (farmer: Farmer) => void;
  startIndex?: number;
}

const ChangeIndicator = ({ change }: { change: string }) => {
    const isPositive = !change.includes('-');
    const colorClass = isPositive ? 'text-green-500' : 'text-red-500';
    const Icon = isPositive ? UpArrowIcon : DownArrowIcon;

    return (
        <span className={`flex items-center justify-center gap-1 text-xs`}>
            <Image src={Icon} alt="change" width={12} height={12} className="w-3 h-3" /> 
            <span className={colorClass}>({change})</span>
        </span>
    );
};

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
                        <th className="p-4 text-center"><TableHeader title="อัตราการรอดชีวิต" /></th>
                        <th className="p-4 text-center">Action</th>
                    </tr>
                </thead>
                <tbody className="text-sm text-gray-900 font-normal">
                    {farmersData.map((farmer, index) => (
                        <tr key={farmer.id} className="border-b border-gray-100 last:border-b-0">
                            <td className="p-4 text-center">{startIndex + index + 1}</td>
                            <td className="p-4 text-left">{farmer.name}</td>
                            <td className="p-4 text-center">{farmer.phone}</td>
                            <td className="p-4 text-center">{farmer.groupType}</td>
                            <td className="p-4 text-center">{farmer.pondType}</td>
                            <td className="p-4 text-center">{farmer.pondCount}</td>
                            <td className="p-4 text-center">
                                <button className="text-gray-900 underline">{farmer.location}</button>
                            </td>
                            <td className="p-4 text-center">{farmer.registeredDate}</td>
                            <td className="p-4">
                                <div className="flex items-center justify-center gap-1">
                                    <span>{farmer.survivalRate}</span>
                                    <ChangeIndicator change={farmer.change} />
                                </div>
                            </td>
                            <td className="p-4">
                                <div className="flex justify-center items-center gap-3">
                                    <button className="hover:opacity-75">
                                        <Image src={ViewIcon} alt="view" width={20} height={20} className="w-5 h-5" />
                                    </button>
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