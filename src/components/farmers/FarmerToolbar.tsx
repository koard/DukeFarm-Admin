'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

import CalendarIcon from '../../assets/fm-calendar.svg';
import DownArrowIcon from '../../assets/fm-down.svg';
import SearchIcon from '../../assets/fm-search.svg';

interface FarmerToolbarProps {
    count?: number;
    onSearchChange: (value: string) => void;
    onDateChange: (value: string) => void;
    // ลบ onTypeChange ออก เพราะไม่ได้ใช้กรองประเภทบ่อแล้ว
    onGroupTypeChange: (value: string) => void;
}

const FarmerToolbar = ({
    count = 50,
    onSearchChange,
    onDateChange,
    onGroupTypeChange,
}: FarmerToolbarProps) => {
    const [selectedDate, setSelectedDate] = useState('');
    const dateInputRef = useRef<HTMLInputElement>(null); 
    
    // ลบ state selectedPondType ออก
    const [selectedGroupType, setSelectedGroupType] = useState('');

    const handleDateSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value);
        if (onDateChange) {
            onDateChange(e.target.value);
        }
    };

    const handleCalendarIconClick = () => {
        if (dateInputRef.current) {
            try {
                dateInputRef.current.showPicker();
            } catch (error) {
                console.error("Browser doesn't support showPicker():", error);
            }
        }
    };

    // ลบ handleTypeChange ออก

    const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedGroupType(e.target.value);
        if (onGroupTypeChange) onGroupTypeChange(e.target.value);
    }

    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
            <div>
                <h2 className="text-xl font-semibold">ทั้งหมด ({count})</h2>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                
                {/* 1. ตัวกรองวันที่ */}
                <div className="relative w-full sm:w-auto h-10 focus-within:border-[#034A30] focus-within:ring-1 focus-within:ring-[#034A30] border border-gray-300 rounded-md">
                    <div className="flex items-center justify-between w-full h-full pl-4 pr-10"> 
                        <span className={`text-sm ${selectedDate ? 'text-gray-900' : 'text-gray-600' } pointer-events-none`}>
                            {selectedDate ? new Date(selectedDate).toLocaleDateString('th-TH') : 'วันที่ลงทะเบียน'}
                        </span>
                        <Image 
                            src={CalendarIcon} 
                            alt="Calendar" 
                            width={16} 
                            height={16} 
                            className="w-4 h-4 cursor-pointer text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" 
                            onClick={handleCalendarIconClick} 
                        />
                    </div>
                    <input
                        ref={dateInputRef} 
                        type="date"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0" 
                        onChange={handleDateSelect}
                    />
                </div>

                {/* 2. ตัวกรองกลุ่มการเลี้ยง (แก้ไขค่าให้ตรงกับ API) */}
                <div className="relative w-full sm:w-auto h-10 focus-within:border-[#034A30] focus-within:ring-1 focus-within:ring-[#034A30] border border-gray-300 rounded-md">
                    <select
                        className={`w-full h-full pl-4 pr-10 text-sm bg-transparent rounded-md appearance-none focus:outline-none ${selectedGroupType === "" ? 'text-gray-600' : 'text-gray-600'}`}
                        value={selectedGroupType}
                        onChange={handleGroupChange}
                    >
                        <option value="">ประเภทกลุ่ม ทั้งหมด</option>
                        {/* ส่งค่าภาษาอังกฤษไปหลังบ้าน แต่โชว์ภาษาไทย */}
                        <option value="SMALL">ปลาตุ้ม</option>
                        <option value="LARGE">ปลานิ้ว</option>
                        <option value="MARKET">ปลาตลาด</option>
                    </select>
                    <Image 
                        src={DownArrowIcon} 
                        alt="arrow" 
                        width={16} 
                        height={16} 
                        className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" 
                    />
                </div>

                {/* (ลบ Dropdown ประเภทบ่อ ออกไปแล้ว) */}

                {/* 3. ช่องค้นหา */}
                <div className="relative w-full sm:w-50 h-10 focus-within:border-[#034A30] focus-within:ring-1 focus-within:ring-[#034A30] border border-gray-300 rounded-md">
                    <input 
                        type="text" 
                        placeholder="ค้นหา ชื่อ หรือ เบอร์โทร"
                        className="w-full h-full pl-10 pr-4 text-sm rounded-md focus:outline-none" 
                        onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                    />
                    <Image 
                        src={SearchIcon} 
                        alt="search" 
                        width={24} 
                        height={24} 
                        className="absolute w-6 h-4 text-gray-400 left-3 top-1/2 -translate-y-1/2" 
                    /> 
                </div>
            </div>
        </div>
    );
};

export default FarmerToolbar;