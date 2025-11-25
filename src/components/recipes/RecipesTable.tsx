'use client';

import SortIcon from '../../assets/fm-arrow.svg';
import ViewIcon from '../../assets/fm-search-table.svg';
import DeleteIcon from '../../assets/fm-delete.svg';
import EditIcon from '../../assets/rc-edit.svg';


export interface Recipe {
    id: number;
    name: string;
    ageRange: string;
    ageType: 'range' | 'specific';
    ageStart: string | null;
    ageEnd: string | null;
    ageSpecific: string | null;
    details: string;
    recommendations: string;
    author: string;
    createdAt: string;
    updatedAt: string;
}

interface TableHeaderProps {
    title: string;
}

const TableHeader = ({ title }: TableHeaderProps) => (
    <div className="flex items-center justify-center gap-2">
        <span>{title}</span>
        <img src={SortIcon.src || SortIcon} alt="sort" className="w-4 h-4 opacity-60" />
    </div>
);

interface RecipesTableProps {
    data: Recipe[];
    onView: (itemId: number) => void;
    onEdit: (itemId: number) => void;
    onDelete: (itemId: number) => void;
    startIndex?: number; 
}

const RecipesTable = ({ data = [], onView, onEdit, onDelete, startIndex = 0 }: RecipesTableProps) => {

    if (data.length === 0) {
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
                                <span>ชื่อสูตรอาหาร</span>
                                <img src={SortIcon.src || SortIcon} alt="sort" className="w-4 h-4 opacity-60" />
                            </div>
                        </th>

                        <th className="p-4 text-center"><TableHeader title="อายุปลาที่แนะนำ (วัน)" /></th>
                        <th className="p-4 text-center"><TableHeader title="ผู้สร้าง" /></th>
                        <th className="p-4 text-center"><TableHeader title="วันที่สร้าง" /></th>
                        <th className="p-4 text-center"><TableHeader title="วันที่อัปเดตล่าสุด" /></th>
                        
                        <th className="p-4 text-center">Action</th>
                    </tr>
                </thead>
                
                <tbody className="text-sm text-gray-900 font-normal bg-white">
                    
                    {data.map((item, index) => (
                        
                        <tr key={item.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                            
                            <td className="p-4 text-center">{startIndex + index + 1}</td>
                            <td className="p-4 text-left">{item.name}</td> 
                            <td className="p-4 text-left">{item.ageRange}</td>
                            <td className="p-4 text-left">{item.author}</td>
                            <td className="p-4 text-center">{item.createdAt}</td>
                            <td className="p-4 text-center">{item.updatedAt}</td>
                            <td className="p-4">
                                <div className="flex justify-center items-center gap-3">
                                    <button onClick={() => onView(item.id)} className="hover:opacity-75 transition-opacity">
                                        <img src={ViewIcon.src || ViewIcon} alt="view" className="w-5 h-5" />
                                    </button>
                                
                                    <button onClick={() => onEdit(item.id)} className="hover:opacity-75 transition-opacity">
                                        <img src={EditIcon.src || EditIcon} alt="edit" className="w-5 h-5" />
                                    </button>
                                    
                                    <button onClick={() => onDelete(item.id)} className="hover:opacity-75 transition-opacity">
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

export default RecipesTable;