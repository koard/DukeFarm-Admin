import React, { useState, useRef, ChangeEvent } from 'react';

import CalendarIcon from '../../assets/fm-calendar.svg';
import DownArrowIcon from '../../assets/fm-down.svg';
import SearchIcon from '../../assets/fm-search.svg';

interface ResearcherHistoryToolbarProps {
  count: number;
  onSearchChange?: (value: string) => void;
  onDateChange?: (date: string) => void;
  onGroupTypeChange?: (groupType: string) => void;
}

const ResearcherHistoryToolbar = ({ 
    count, 
    onSearchChange, 
    onDateChange, 
    onGroupTypeChange 
}: ResearcherHistoryToolbarProps) => {
    
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedGroupType, setSelectedGroupType] = useState<string>('');
    
    const dateInputRef = useRef<HTMLInputElement>(null);

    const handleDateSelect = (e: ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value);
        if (onDateChange) onDateChange(e.target.value);
    };

    const handleGroupChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedGroupType(e.target.value);
        if (onGroupTypeChange) onGroupTypeChange(e.target.value);
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full mb-4">
            <div>
                <h2 className="text-lg font-bold text-[#034A30]">รายการการกรอกข้อมูลทั้งหมด ({count})</h2>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                
                <div className="relative w-full sm:w-auto h-10 border border-gray-300 rounded-md focus-within:border-[#034A30] focus-within:ring-1 focus-within:ring-[#034A30]">
                    <div className="flex items-center justify-between w-full h-full pl-4 pr-10">
                        <span className={`text-sm ${selectedDate ? 'text-gray-900' : 'text-gray-600'} pointer-events-none`}>
                            {selectedDate ? new Date(selectedDate).toLocaleDateString('th-TH') : 'วันที่กรอกข้อมูล'}
                        </span>
                        <img 
                            src={CalendarIcon.src || CalendarIcon}
                            alt="Calendar" 
                            className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" 
                            onClick={() => dateInputRef.current?.showPicker()} 
                        />
                    </div>
                    <input 
                        ref={dateInputRef} 
                        type="date" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        onChange={handleDateSelect} 
                    />
                </div>

                <div className="relative w-full sm:w-auto h-10 border border-gray-300 rounded-md focus-within:border-[#034A30] focus-within:ring-1 focus-within:ring-[#034A30]">
                    <select 
                        className={`w-full h-full pl-4 pr-10 text-sm bg-transparent rounded-md appearance-none outline-none ${selectedGroupType === "" ? 'text-gray-600' : 'text-gray-900'}`}
                        value={selectedGroupType}
                        onChange={handleGroupChange}
                    >
                        <option value="">ประเภทกลุ่ม ทั้งหมด</option>
                        <option value="กลุ่มอนุบาลขนาดเล็ก">กลุ่มอนุบาลขนาดเล็ก</option>
                        <option value="กลุ่มอนุบาลขนาดใหญ่">กลุ่มอนุบาลขนาดใหญ่</option>
                        <option value="กลุ่มผู้เลี้ยงขนาดตลาด">กลุ่มผู้เลี้ยงขนาดตลาด</option>
                    </select>
                    <img 
                        src={DownArrowIcon.src || DownArrowIcon} 
                        alt="arrow" 
                        className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" 
                    />
                </div>

                <div className="relative w-full sm:w-64 h-10 border border-gray-300 rounded-md focus-within:border-[#034A30] focus-within:ring-1 focus-within:ring-[#034A30]">
                    <input
                        type="text"
                        placeholder="ค้นหา ชื่อเกษตรกร"
                        className="w-full h-full pl-10 pr-4 text-sm rounded-md focus:outline-none"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchChange && onSearchChange(e.target.value)}
                    />
                    <img 
                        src={SearchIcon.src || SearchIcon} 
                        alt="search" 
                        className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" 
                    />
                </div>
            </div>
        </div>
    );
};

export default ResearcherHistoryToolbar;