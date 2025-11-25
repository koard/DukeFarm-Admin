'use client';

import React, { ChangeEvent } from 'react';

import DownArrowIcon from '../../assets/fm-down.svg';
import SearchIcon from '../../assets/fm-search.svg';
import PlusIcon from '../../assets/rc-plus.svg';

interface AdminToolbarProps {
    count?: number;
    onSearchChange: (searchTerm: string) => void;
    onRoleChange: (role: string) => void;
    onAddAdminClick: () => void;
}

const AdminToolbar = ({
    count = 0,
    onSearchChange,
    onRoleChange,
    onAddAdminClick,
}: AdminToolbarProps) => {
    
    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e.target.value);
    };
    
    const handleRoleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        onRoleChange(e.target.value);
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
            <div>
                <h2 className="text-xl font-semibold">ทั้งหมด ({count})</h2>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                
                <div 
                    className="relative w-full sm:w-auto h-10
                               focus-within:border-[#034A30] focus-within:ring-1 focus-within:ring-[#034A30]
                               border border-gray-300 rounded-md"
                >
                    <select
                        className="w-full h-full pl-4 pr-10 text-sm text-gray-600 bg-transparent rounded-md appearance-none 
                                   focus:outline-none" 
                        onChange={handleRoleChange}
                    >
                        <option value="">สิทธิ์การเข้าถึง ทั้งหมด</option>
                        <option value="Admin">Admin</option>
                        <option value="Super Admin">Super Admin</option>
                    </select>
                    <img
                        src={DownArrowIcon.src || DownArrowIcon}
                        alt="arrow"
                        className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" 
                    />
                </div>

                <div 
                    className="relative w-full sm:w-50 h-10
                               focus-within:border-[#034A30] focus-within:ring-1 focus-within:ring-[#034A30]
                               border border-gray-300 rounded-md" 
                >
                    <input 
                        type="text" 
                        placeholder="ค้นหา ชื่อ หรือ อีเมล"
                        className="w-full h-full pl-10 pr-4 text-sm rounded-md focus:outline-none" 
                        onChange={handleSearchChange}
                    />
                    <img src={SearchIcon.src || SearchIcon} alt="search" className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" /> 
                </div>

                <button
                    onClick={onAddAdminClick}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto h-10 px-4 py-2 bg-[#179678] text-white rounded-md shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#179678]/50"
                >
                    <img src={PlusIcon.src || PlusIcon} alt="add" className="w-5 h-5" />
                    <span className="text-sm">เพิ่มผู้ดูแลระบบ</span>
                </button>
            </div>
        </div>
    );
};

export default AdminToolbar;