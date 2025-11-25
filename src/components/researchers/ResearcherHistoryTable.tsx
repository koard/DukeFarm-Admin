'use client';

import Image from 'next/image';

import SortIcon from '../../assets/fm-arrow.svg';
import ViewIcon from '../../assets/fm-search-table.svg';
import DeleteIcon from '../../assets/fm-delete.svg';

export interface HistoryData {
  id: number;
  date: string;
  farm: string;
  groupType: string;
}

interface ResearcherHistoryTableProps {
  data: HistoryData[];
  startIndex?: number;
  onDeleteClick?: (item: HistoryData) => void;
}

const TableHeader = ({ title }: { title: string }) => (
    <div className="flex items-center justify-center gap-2 cursor-pointer hover:opacity-80">
        <span>{title}</span>
        <Image src={SortIcon} alt="sort" width={12} height={12} className="w-3 h-3 opacity-60" />
    </div>
);

const ResearcherHistoryTable = ({ data, startIndex = 0, onDeleteClick }: ResearcherHistoryTableProps) => {
    
    if (data.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-gray-100 shadow-sm">
                ไม่พบข้อมูล
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full min-w-[1000px] table-auto">
                <thead>
                    <tr className="text-sm font-medium text-[#ACACAC] bg-black">
                        <th className="p-4 text-center w-[10%]"><TableHeader title="No." /></th>
                        <th className="p-4 text-center w-[20%]"><TableHeader title="วันที่กรอกข้อมูล" /></th>
                        <th className="p-4 text-left w-[30%] pl-8">
                            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
                                <span>ข้อมูลเกษตรกร</span>
                                <Image src={SortIcon} alt="sort" width={12} height={12} className="w-3 h-3 opacity-60" />
                            </div>
                        </th>
                        <th className="p-4 text-center w-[25%]"><TableHeader title="ประเภทกลุ่มการเลี้ยง" /></th>
                        <th className="p-4 text-center w-[15%]">Action</th>
                    </tr>
                </thead>
                <tbody className="text-sm text-gray-900">
                    {data.map((item, index) => (
                        <tr key={item.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                            <td className="p-4 text-center">{startIndex + index + 1}</td>
                            <td className="p-4 text-center">{item.date}</td>
                            <td className="p-4 text-left pl-8">{item.farm}</td>
                            <td className="p-4 text-center">{item.groupType || "กลุ่มอนุบาลขนาดเล็ก"}</td>
                            <td className="p-4">
                                <div className="flex justify-center items-center gap-3">
                                    <button className="hover:scale-110 transition-transform">
                                        <Image src={ViewIcon} alt="view" width={20} height={20} className="w-5 h-5" />
                                    </button>
                                    
                                    <button 
                                        onClick={() => onDeleteClick && onDeleteClick(item)} 
                                        className="hover:scale-110 transition-transform"
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
    );
};

export default ResearcherHistoryTable;