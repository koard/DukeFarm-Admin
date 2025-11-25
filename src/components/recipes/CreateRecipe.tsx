'use client';

import React, { useState, useRef, ChangeEvent } from 'react'; 
import DownArrowIcon from '../../assets/fm-down.svg';

const DAY_OPTIONS = [1, 10, 15, 20, 25, 30, 40, 45, 50, 60, 75, 90, 120, 150];

const AGE_RANGE_OPTIONS = [
    { value: '0-15', label: '0-15 วัน' },
    { value: '16-30', label: '16-30 วัน' },
    { value: '31-60', label: '31-60 วัน' },
    { value: '61-90', label: '61-90 วัน' },
    { value: '91-120', label: '91-120 วัน' },
    { value: '>120', label: '>120 วัน' },
];

interface FormInputProps {
    label: string;
    placeholder?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

interface FormSelectProps {
    label: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    labelClassName?: string;
    placeholder?: string;
    isSpecificAgeRange?: boolean;
}

interface FormTextareaProps {
    label: string;
    placeholder?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    rows?: number;
}

const FormInput = ({ label, placeholder, value, onChange, type = "text" }: FormInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null); 
    const [isFocused, setIsFocused] = useState<boolean>(false); 

    const handleIconClick = () => { 
        if (inputRef.current && type === 'date') { 
            try { 
                (inputRef.current as any).showPicker(); 
            } catch (error) { 
                console.error("Browser doesn't support showPicker():", error); 
            } 
        } 
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            
            <div className="relative">
                <input
                    ref={inputRef}
                    type={type} 
                    placeholder={placeholder || (type === 'date' ? 'เลือกวัน' : '')} 
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#179678]/50 placeholder-gray-400 ${
                        type === 'date' ? 'pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0' : '' 
                    }`} 
                    style={type === 'date' && !value && !isFocused ? { color: 'transparent' } : {}}
                />
            </div>
        </div>
    )
};

const FormSelect = ({ label, value, onChange, labelClassName, placeholder = "เลือกวัน", isSpecificAgeRange = false }: FormSelectProps) => ( 
    <div className="flex-1">
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName || ''} ${!label ? 'h-[20px]' : ''}`}>
            {label}
        </label>
        
        <div className="relative">
            <select 
                value={value} 
                onChange={onChange}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#179678]/50 bg-white pr-8 ${
                    value === "" ? 'text-gray-400' : 'text-gray-900'
                }`}
            >
                <option value="">{placeholder}</option> 
                
                {isSpecificAgeRange
                    ? AGE_RANGE_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))
                    : DAY_OPTIONS.map(day => (
                        <option key={day} value={day.toString()}>{`${day} วัน`}</option>
                    ))
                }
            </select>
            
            <img
                src={DownArrowIcon.src || DownArrowIcon} 
                alt="arrow"
                className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            /> 
        </div>
    </div>
);

const FormTextarea = ({ label, placeholder, value, onChange, rows = 4 }: FormTextareaProps) => (
    <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <textarea
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            rows={rows}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#179678]/50 placeholder-gray-400"
        />
    </div>
);


export interface NewRecipeFormData {
    recipeName: string;
    ageType: 'range' | 'specific';
    ageStart: string | null;
    ageEnd: string | null;
    ageSpecific: string | null;
    details: string;
    recommendations: string;
}

interface CreateRecipeProps {
    onClose: () => void;
    onCreate: (formData: NewRecipeFormData) => void;
}


const CreateRecipe = ({ onClose, onCreate }: CreateRecipeProps) => { 
    const [recipeName, setRecipeName] = useState<string>('');
    const [ageType, setAgeType] = useState<'range' | 'specific'>('range'); 
    const [ageStart, setAgeStart] = useState<string>(''); 
    const [ageEnd, setAgeEnd] = useState<string>(''); 
    const [ageSpecific, setAgeSpecific] = useState<string>('');
    const [details, setDetails] = useState<string>('');
    const [recommendations, setRecommendations] = useState<string>('');


    const handleCreate = () => {
        const formData: NewRecipeFormData = { 
            recipeName,
            ageType,
            ageStart: ageType === 'range' ? ageStart : null,
            ageEnd: ageType === 'range' ? ageEnd : null,
            ageSpecific: ageType === 'specific' ? ageSpecific : null,
            details,
            recommendations,
        };
        
        if (onCreate) {
            onCreate(formData); 
        }
    };


    return (
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 pointer-events-auto overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">สร้างสูตรอาหาร</h2>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <FormInput 
                    label="ชื่อสูตรอาหาร" 
                    placeholder="ระบุข้อมูล" 
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">อายุปลาที่แนะนำ (วัน)</label>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="ageType"
                                value="range"
                                checked={ageType === 'range'}
                                onChange={() => setAgeType('range')}
                                className="w-5 h-5 accent-[#093832] focus:ring-[#093832]/50 border-gray-300" 
                            />
                            <span className="text-sm text-gray-700">ระบุช่วงอายุ (วัน)</span> 
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="ageType"
                                value="specific"
                                checked={ageType === 'specific'}
                                onChange={() => setAgeType('specific')}
                                className="w-5 h-5 accent-[#093832] focus:ring-[#093832]/50 border-gray-300" 
                            />
                            <span className="text-sm text-gray-700">ระบุอายุ (วัน)</span>
                        </label>
                    </div>
                </div>

                {ageType === 'range' ? (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
                        
                        <FormSelect 
                            label="ตั้งแต่" 
                            value={ageStart}
                            onChange={(e) => setAgeStart(e.target.value)}
                            placeholder="เลือกวัน" 
                        />

                        <span className="text-gray-500 pb-3 hidden sm:block">ถึง</span>
                        
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1 sm:hidden">ถึง</label>
                            
                            <FormSelect 
                                label="" 
                                value={ageEnd}
                                onChange={(e) => setAgeEnd(e.target.value)}
                                placeholder="เลือกวัน" 
                            />
                        </div>

                    </div>
                ) : (

                    <div className="flex items-end gap-4">
                        <FormSelect 
                            label="อายุ (วัน)" 
                            value={ageSpecific}
                            onChange={(e) => setAgeSpecific(e.target.value)}
                            placeholder="เลือกช่วงอายุ" 
                            isSpecificAgeRange={true}
                        />
                    </div>
                )}

                <FormTextarea 
                    label="รายละเอียด" 
                    placeholder="ระบุข้อมูล" 
                    value={details}
                    onChange={(e) => setDetails(e.target.value)} 
                    rows={6}
                />
                <FormTextarea 
                    label="คำแนะนำเพิ่มเติม" 
                    placeholder="ระบุข้อมูล" 
                    value={recommendations}
                    onChange={(e) => setRecommendations(e.target.value)}
                    rows={5}
                />

                <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full pt-4">
                    <button
                        type="button"
                        onClick={onClose} 
                        className="flex-1 px-4 py-3 bg-white border border-[#179678] rounded-lg text-base font-semibold text-[#179678] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#179678]/50"
                    >
                        ยกเลิก
                    </button>
                    <button
                        type="submit" 
                        onClick={handleCreate}
                        className="flex-1 px-4 py-3 bg-[#179678] border border-transparent rounded-lg text-base font-semibold text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#179678]/50"
                    >
                        สร้าง
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateRecipe;