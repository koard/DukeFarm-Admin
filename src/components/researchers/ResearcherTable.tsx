'use client';

import { useRouter } from 'next/navigation';
import SortIcon from '../../assets/fm-arrow.svg';
import ViewIcon from '../../assets/fm-search-table.svg';
import DeleteIcon from '../../assets/fm-delete.svg';

export interface Researcher {
    id: string | number;
    name: string;
    phone: string;
    position: string;
    affiliation: string;
    registeredDate: string;
}

interface ResearcherTableProps {
    data: Researcher[];
    onDeleteClick: (item: Researcher) => void;
    startIndex?: number; 
}

interface TableHeaderProps {
    title: string;
}

const TableHeader = ({ title }: TableHeaderProps) => (
    <div className="flex items-center justify-center gap-2 cursor-pointer hover:opacity-80">
        <span>{title}</span>
        <img src={SortIcon.src || SortIcon} alt="sort" className="w-3 h-3 opacity-60" />
    </div>
);

const ResearcherTable = ({ data, onDeleteClick, startIndex = 0 }: ResearcherTableProps) => {
    const router = useRouter();

    if (data.length === 0) {
        return <div className="text-center py-10 text-gray-500">ไม่พบข้อมูล</div>;
    }

    const handleViewClick = (item: Researcher) => {
        router.push(`/researchers/${item.id}?name=${encodeURIComponent(item.name)}`);
    };

    return (
        <div className="overflow-x-auto rounded-xl">
            <table className="w-full min-w-[1000px] table-auto">
                <thead>
                    <tr className="text-sm font-medium text-[#ACACAC] bg-black">
                        <th className="p-4 text-center"><TableHeader title="No." /></th>
                        <th className="p-4 text-left">
                            <div className="flex items-center gap-2">
                                <span>ชื่อ-นามสกุล</span>
                                <img src={SortIcon.src || SortIcon} className="w-3 h-3 opacity-60"/>
                            </div>
                        </th>
                        <th className="p-4 text-center"><TableHeader title="เบอร์โทร" /></th>
                        <th className="p-4 text-center"><TableHeader title="ตำแหน่ง" /></th>
                        <th className="p-4 text-center"><TableHeader title="สังกัด" /></th>
                        <th className="p-4 text-center"><TableHeader title="วันที่ลงทะเบียน" /></th>
                        <th className="p-4 text-center">Action</th>
                    </tr>
                </thead>
                <tbody className="text-sm text-gray-900">
                    {data.map((item, index) => (
                        <tr key={item.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                            <td className="p-4 text-center">{startIndex + index + 1}</td>
                            <td className="p-4 text-left">{item.name}</td>
                            <td className="p-4 text-center">{item.phone}</td>
                            <td className="p-4 text-center">{item.position}</td>
                            <td className="p-4 text-center">{item.affiliation}</td>
                            <td className="p-4 text-center">{item.registeredDate}</td>
                            <td className="p-4">
                                <div className="flex justify-center items-center gap-3">
                                    <button 
                                        onClick={() => handleViewClick(item)}
                                        className="hover:scale-110 transition-transform"
                                    >
                                        <img src={ViewIcon.src || ViewIcon} alt="view" className="w-5 h-5" />
                                    </button>
                                    
                                    <button onClick={() => onDeleteClick(item)} className="hover:scale-110 transition-transform">
                                        <img src={DeleteIcon.src || DeleteIcon} alt="delete" className="w-5 h-5" />
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

export default ResearcherTable;