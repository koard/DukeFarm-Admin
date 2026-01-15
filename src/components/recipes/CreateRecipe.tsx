'use client';

import React, { useState, useRef, ChangeEvent, useEffect } from 'react'; 
import DownArrowIcon from '../../assets/fm-down.svg';

const FARM_TYPE_OPTIONS = [
    { value: 'SMALL', label: 'ปลาตุ้ม' },
    { value: 'LARGE', label: 'ปลานิ้ว' },
    { value: 'MARKET', label: 'ปลาตลาด' },
];

const AGE_PRESETS: Record<string, { from: string; to: string; unit: string }> = {
    SMALL:  { from: '0', to: '30', unit: 'day' },  
    LARGE:  { from: '1', to: '2',  unit: 'month' }, 
    MARKET: { from: '3', to: '6',  unit: 'month' }, 
};

const UNIT_OPTIONS = [
    { value: 'day', label: 'วัน' },
    { value: 'month', label: 'เดือน' },
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
    options: { value: string; label: string }[];
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

    return (
        <div className="w-full">
            <label className={`block text-sm font-medium text-gray-700 mb-1 ${!label ? 'hidden' : ''}`}>
                {label}
            </label>
            
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

const FormSelect = ({ label, value, onChange, labelClassName, placeholder = "เลือก", options }: FormSelectProps) => ( 
    <div className="w-full">
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName || ''} ${!label ? 'hidden' : ''}`}>
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
                
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
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
    farmType: string;
    ageFrom: string;
    ageTo: string;
    ageUnit: string; 
    ingredients: string;
    instruction: string; 
    recommendations: string;
}

interface CreateRecipeProps {
    onClose: () => void;
    onCreate: (formData: NewRecipeFormData) => void;
}

const CreateRecipe = ({ onClose, onCreate }: CreateRecipeProps) => { 
    const [recipeName, setRecipeName] = useState<string>('');
    const [farmType, setFarmType] = useState<string>('');
    
    const [ageFrom, setAgeFrom] = useState<string>('');
    const [ageTo, setAgeTo] = useState<string>('');
    
    const [selectedUnit, setSelectedUnit] = useState<string>('');


    const [ingredients, setIngredients] = useState<string>(''); 
    const [instruction, setInstruction] = useState<string>(''); 
    const [recommendations, setRecommendations] = useState<string>('');

    useEffect(() => {
        if (!farmType) return;
        const preset = AGE_PRESETS[farmType];
        if (preset) {
            setSelectedUnit(preset.unit);
            setAgeFrom(preset.from); 
            setAgeTo(preset.to);     
        }
    }, [farmType]);


    const handleCreate = () => {
        const formData: NewRecipeFormData = { 
            recipeName,
            farmType,
            ageFrom,    
            ageTo,      
            ageUnit: selectedUnit, 
            ingredients,
            instruction, 
            recommendations,
        };
        
        if (onCreate) {
            onCreate(formData); 
        }
    };

    const currentUnitLabel = UNIT_OPTIONS.find(u => u.value === selectedUnit)?.label || 'ระบุ';

    return (
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 pointer-events-auto overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">สร้างสูตรอาหาร</h2>

            <form className="space-y-4 pb-2" onSubmit={(e) => e.preventDefault()}>
                <FormInput 
                    label="ชื่อสูตรอาหาร" 
                    placeholder="ระบุข้อมูล" 
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                />

                <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-white to-[#f3f7f5] p-4 shadow-sm space-y-3">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-gray-800">ประเภทกลุ่มการเลี้ยง</p>
                        </div>
                        <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-[#e7f5ef] text-[#0f5132] border border-[#c7e9d9]">อัตโนมัติ</span>
                    </div>

                    <FormSelect 
                        label=""
                        placeholder="เลือกประเภท" 
                        value={farmType}
                        onChange={(e) => setFarmType(e.target.value)}
                        options={FARM_TYPE_OPTIONS}
                    />

                    <FormSelect 
                        label="หน่วยของช่วงเวลา"
                        placeholder="เลือกหน่วย" 
                        value={selectedUnit}
                        onChange={(e) => setSelectedUnit(e.target.value)}
                        options={UNIT_OPTIONS}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormInput 
                            label={`ตั้งแต่ (${currentUnitLabel})`}
                            type="number"
                            placeholder="ระบุข้อมูล"
                            value={ageFrom}
                            onChange={(e) => setAgeFrom(e.target.value)}
                        />
                        <FormInput 
                            label={`จนถึง (${currentUnitLabel})`}
                            type="number"
                            placeholder="ระบุข้อมูล"
                            value={ageTo}
                            onChange={(e) => setAgeTo(e.target.value)}
                        />
                    </div>
                </div>

                <FormTextarea 
                    label="ส่วนผสม" 
                    placeholder="ระบุข้อมูล" 
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)} 
                    rows={4}
                />

                <FormTextarea 
                    label="วิธีการทำ" 
                    placeholder="ระบุข้อมูล" 
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)} 
                    rows={4}
                />

                <FormTextarea 
                    label="คำแนะนำ" 
                    placeholder="ระบุข้อมูล" 
                    value={recommendations}
                    onChange={(e) => setRecommendations(e.target.value)}
                    rows={4}
                />

                <div className="flex flex-col sm:flex-row gap-4 w-full pt-2">
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