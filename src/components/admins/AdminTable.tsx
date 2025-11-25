'use client';


import SortIcon from '../../assets/fm-arrow.svg';
import EditIcon from '../../assets/rc-edit.svg'; 
import DeleteIcon from '../../assets/fm-delete.svg';

export interface Admin {
    id: number;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    role: "Admin" | "Super Admin" | string;
    createDate: string;
    createBy: string;
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

interface AdminTableProps {
    adminData: Admin[];
    onEdit: (adminId: number) => void;
    onDelete: (admin: Admin) => void; 
    startIndex?: number;
}

const AdminTable = ({ adminData = [], onEdit, onDelete, startIndex = 0 }: AdminTableProps) => { 

    if (adminData.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500 bg-white rounded-xl shadow-sm">
                ไม่พบข้อมูล
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl">
            <table className="w-full min-w-[900px] table-auto">
                <thead>
                    <tr className="text-sm font-medium text-[#ACACAC] bg-black ">
                        
                        <th className="p-4 text-center"><TableHeader title="No." /></th>
                        
                        <th className="p-4 text-left">
                            <div className="flex items-center gap-2">
                                <span>ชื่อ-นามสกุล</span>
                                <img src={SortIcon.src || SortIcon} alt="sort" className="w-4 h-4 opacity-60" />
                            </div>
                        </th>

                        <th className="p-4 text-center"><TableHeader title="Email" /></th>
                        <th className="p-4 text-center"><TableHeader title="สิทธิ์การเข้าถึง" /></th>
                        <th className="p-4 text-center"><TableHeader title="Create Date" /></th>
                        <th className="p-4 text-center"><TableHeader title="Create By" /></th>
                        
                        <th className="p-4 text-center">Action</th>
                    </tr>
                </thead>
                
                <tbody className="text-sm text-gray-900 font-normal bg-white">
                    {adminData.map((admin, index) => (
                        <tr key={admin.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                            
                            <td className="p-4 text-center">{startIndex + index + 1}</td>
                            <td className="p-4 text-left">{admin.name}</td> 
                            <td className="p-4 text-left">{admin.email}</td>
                            <td className="p-4 text-center">{admin.role}</td>
                            <td className="p-4 text-center">{admin.createDate}</td>
                            <td className="p-4 text-center">{admin.createBy}</td>

                            <td className="p-4">
                                <div className="flex justify-center items-center gap-3">
                                    <button onClick={() => onEdit(admin.id)} className="hover:opacity-75 transition-opacity">
                                        <img src={EditIcon.src || EditIcon} alt="edit" className="w-5 h-5" />
                                    </button>
                                    
                                    <button onClick={() => onDelete(admin)} className="hover:opacity-75 transition-opacity">
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

export default AdminTable;