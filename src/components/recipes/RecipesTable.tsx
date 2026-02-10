'use client';

import ViewIcon from '../../assets/fm-search-table.svg';
import DeleteIcon from '../../assets/fm-delete.svg';
import EditIcon from '../../assets/rc-edit.svg';

import type { Recipe } from '@/app/recipes/page';

const FARM_TYPE_LABEL: Record<string, string> = {
    'SMALL': 'ปลาตุ้ม',
    'LARGE': 'ปลานิ้ว',
    'MARKET': 'ปลาตลาด',
    'NURSERY_SMALL': 'ปลาตุ้ม',
    'NURSERY_LARGE': 'ปลานิ้ว',
    'GROWOUT': 'ปลาตลาด'
};

const FOOD_TYPE_LABEL: Record<string, string> = {
    'FRESH': 'อาหารสด',
    'PELLET': 'อาหารเม็ด',
    'SUPPLEMENT': 'อาหารเสริม',
};

interface TableHeaderProps {
    title: string;
}

const TableHeader = ({ title }: TableHeaderProps) => (
    <div className="flex items-center justify-center gap-2">
        <span>{title}</span>
    </div>
);

interface RecipesTableProps {
    data: Recipe[];
    onView: (itemId: string) => void;
    onEdit: (itemId: string) => void;
    onDelete: (itemId: string) => void;
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
        <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-100">
            <table className="w-full min-w-[1100px] table-auto">
                <thead>
                    <tr className="text-sm font-medium text-[#ACACAC] bg-black">
                        <th className="p-4 text-center"><TableHeader title="No." /></th>
                        <th className="p-4 text-left">
                            <div className="flex items-center gap-2">
                                <span>ชื่อสูตรอาหาร</span>
                            </div>
                        </th>
                        <th className="p-4 text-center"><TableHeader title="ประเภทอาหาร" /></th>
                        <th className="p-4 text-center"><TableHeader title="กลุ่มการเลี้ยง" /></th>
                        <th className="p-4 text-center"><TableHeader title="ขนาดที่แนะนำ" /></th>
                        <th className="p-4 text-center"><TableHeader title="ผู้สร้าง" /></th>
                        <th className="p-4 text-center"><TableHeader title="วันที่สร้าง" /></th>
                        <th className="p-4 text-center"><TableHeader title="วันที่อัปเดตล่าสุด" /></th>
                        <th className="p-4 text-center">Action</th>
                    </tr>
                </thead>

                <tbody className="text-sm text-gray-900 font-normal bg-white">
                    {data.map((item, index) => {
                        const rawFarmType = item.farmType || (item as any).primaryFarmType || '';
                        const farmTypeKey = rawFarmType.toUpperCase();
                        const displayFarmType = FARM_TYPE_LABEL[farmTypeKey] || rawFarmType || '-';

                        const foodTypeKey = (item.foodType || '').toUpperCase();
                        const displayFoodType = FOOD_TYPE_LABEL[foodTypeKey] || item.foodType || '-';

                        let displayStage = item.targetStage || item.ageRange || '-';
                        displayStage = displayStage
                            .replace(/KG|kg|Kg/g, 'กิโลกรัม')
                            .replace(/GRAM|gram|Gram/g, 'กรัม')
                            .replace(/cm|CM/g, 'ซม.');

                        return (
                            <tr key={item.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                                <td className="p-4 text-center">{startIndex + index + 1}</td>
                                <td className="p-4 text-left font-medium">{item.name}</td>
                                
                                <td className="p-4 text-center text-gray-900">
                                    {displayFoodType}
                                </td>
                                
                                <td className="p-4 text-center">{displayFarmType}</td>
                                <td className="p-4 text-center">{displayStage}</td>
                                <td className="p-4 text-center">{item.author || '-'}</td>
                                <td className="p-4 text-center">{item.createdAt}</td>
                                <td className="p-4 text-center">{item.updatedAt}</td>
                                
                                <td className="p-4">
                                    <div className="flex justify-center items-center gap-3">
                                        <button onClick={() => onView(item.id)} className="hover:opacity-75 transition-opacity" title="ดูรายละเอียด">
                                            <img src={ViewIcon.src || ViewIcon} alt="view" className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => onEdit(item.id)} className="hover:opacity-75 transition-opacity" title="แก้ไข">
                                            <img src={EditIcon.src || EditIcon} alt="edit" className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => onDelete(item.id)} className="hover:opacity-75 transition-opacity" title="ลบ">
                                            <img src={DeleteIcon.src || DeleteIcon} alt="delete" className="w-5 h-5" />
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

export default RecipesTable;