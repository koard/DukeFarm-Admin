import React, { useState, useRef, ChangeEvent } from 'react';

import CalendarIcon from '../../assets/fm-calendar.svg';
import SearchIcon from '../../assets/fm-search.svg';

interface ResearcherToolbarProps {
    count?: number;
    onSearchChange?: (value: string) => void;
    onDateChange?: (date: string) => void;
}

const ResearcherToolbar = ({ 
    count = 0, 
    onSearchChange, 
    onDateChange
}: ResearcherToolbarProps) => {
    
    const [selectedDate, setSelectedDate] = useState<string>('');
    
    const dateInputRef = useRef<HTMLInputElement>(null);

    const handleDateSelect = (e: ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value);
        if (onDateChange) onDateChange(e.target.value);
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
            <div>
                <h2 className="text-xl font-semibold">ทั้งหมด ({count})</h2>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-auto h-10 focus-within:border-[#034A30] focus-within:ring-1 focus-within:ring-[#034A30] border border-gray-300 rounded-md">
                    <div className="flex items-center justify-between w-full h-full pl-4 pr-10">
                        <span className={`text-sm ${selectedDate ? 'text-gray-900' : 'text-gray-600'} pointer-events-none`}>
                            {selectedDate ? new Date(selectedDate).toLocaleDateString('th-TH') : 'วันที่ลงทะเบียน'}
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

                <div className="relative w-full sm:w-80 h-10 focus-within:border-[#034A30] focus-within:ring-1 focus-within:ring-[#034A30] border border-gray-300 rounded-md">
                    <input 
                        type="text" 
                        placeholder="ค้นหา ชื่อ, เบอร์โทร, ตำแหน่ง หรือ สังกัด"
                        className="w-full h-full pl-10 pr-4 text-sm rounded-md focus:outline-none text-ellipsis" 
                        onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchChange && onSearchChange(e.target.value)}
                    />
                    <img 
                        src={SearchIcon.src || SearchIcon} 
                        alt="search" 
                        className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2 pointer-events-none" 
                    /> 
                </div>
            </div>
        </div>
    );
};

export default ResearcherToolbar;