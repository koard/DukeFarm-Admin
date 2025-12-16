'use client';

import React, { ChangeEvent } from 'react';

import SearchIcon from '../../assets/fm-search.svg';
import PlusIcon from '../../assets/rc-plus.svg';
import DownArrowIcon from '../../assets/fm-down.svg';

const FARM_TYPE_OPTIONS = [
    { value: 'SMALL', label: 'ปลาตุ้ม' },
    { value: 'LARGE', label: 'ปลานิ้ว' },
    { value: 'MARKET', label: 'ปลาตลาด' },
];

interface RecipesToolbarProps {
    totalItems?: number; 
    onSearch: (searchTerm: string) => void; 
    onFilterChange: (filterValue: string) => void; 
    onAddClick: () => void; 
}

const RecipesToolbar = ({
    totalItems = 0, 
    onSearch,     
    onFilterChange, 
    onAddClick,    
}: RecipesToolbarProps) => {

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        onSearch(e.target.value);
    };

    const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
        onFilterChange(e.target.value);
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
            <div>
                <h2 className="text-xl font-semibold">ทั้งหมด ({totalItems})</h2>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                

                <div 
                    className="relative w-full sm:w-60 h-10
                             focus-within:border-[#034A30] focus-within:ring-1 focus-within:ring-[#034A30]
                             border border-gray-300 rounded-md bg-white" 
                >
                    <input 
                        type="text" 
                        placeholder="ค้นหา ชื่อ, ช่วงอายุ หรือผู้สร้าง"
                        className="w-full h-full pl-10 pr-4 text-sm rounded-md focus:outline-none bg-transparent" 
                        onChange={handleSearchChange}
                    />
                    <img src={SearchIcon.src || SearchIcon} alt="search" className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" /> 
                </div>

                <div 
                    className="relative w-full sm:w-48 h-10
                             focus-within:border-[#034A30] focus-within:ring-1 focus-within:ring-[#034A30]
                             border border-gray-300 rounded-md bg-white"
                >
                    <select
                        className="w-full h-full pl-4 pr-10 text-sm rounded-md focus:outline-none appearance-none bg-transparent text-gray-700"
                        onChange={handleFilterChange}
                        defaultValue=""
                    >
                        <option value="">ทั้งหมด (ทุกกลุ่ม)</option>
                        {FARM_TYPE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <img 
                        src={DownArrowIcon.src || DownArrowIcon} 
                        alt="arrow" 
                        className="absolute w-4 h-4 text-gray-400 right-3 top-1/2 -translate-y-1/2 pointer-events-none" 
                    />
                </div>

                <button
                    onClick={onAddClick}
                    className="flex items-center justify-center h-10 px-4 text-sm text-white
                             bg-[#179678] rounded-md shadow-sm hover:bg-opacity-90 
                             focus:outline-none focus:ring-2 focus:ring-[#179678] focus:ring-offset-2
                             w-full sm:w-auto whitespace-nowrap" 
                >
                    <img src={PlusIcon.src || PlusIcon} alt="add" className="w-4 h-4 mr-2" />
                    <span>สร้างสูตรอาหาร</span> 
                </button>

            </div>
        </div>
    );
};

export default RecipesToolbar;