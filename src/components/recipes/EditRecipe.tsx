'use client';

import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import DownArrowIcon from '../../assets/fm-down.svg';
import { Recipe } from "../../app/recipes/page";

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

const normalizeFarmType = (value: string): string => {
    const upper = value?.toUpperCase?.() || '';
    if (upper === 'NURSERY_SMALL') return 'SMALL';
    if (upper === 'NURSERY_LARGE') return 'LARGE';
    if (upper === 'GROWOUT') return 'MARKET';
    return upper;
};

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
    options?: { value: string; label: string }[];
    placeholder?: string;
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
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="w-full">
            <label className={`block text-sm font-medium text-gray-700 mb-1 ${!label ? 'hidden' : ''}`}>
                {label}
            </label>
            <div className="relative">
                <input
                    ref={inputRef}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#179678]/50 placeholder-gray-400 h-[42px]"
                />
            </div>
        </div>
    )
};

const FormSelect = ({ label, value, onChange, labelClassName, options, placeholder = "เลือก" }: FormSelectProps) => (
    <div className="w-full">
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName || ''} ${!label ? 'hidden' : ''}`}>
            {label}
        </label>
        <div className="relative">
            <select
                value={value}
                onChange={onChange}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#179678]/50 bg-white pr-8 h-[42px] ${
                    value === "" ? 'text-gray-400' : 'text-gray-900'
                }`}
            >
                <option value="">{placeholder}</option>
                {options?.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
            <img src={DownArrowIcon.src || DownArrowIcon} alt="arrow" className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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

interface UpdateRecipeData {
    id: string;
    recipeName: string;
    farmType: string;
    ageFrom: string;
    ageTo: string;
    ageUnit: string; 
    ingredients: string;
    instruction: string;
    recommendations: string;
}

interface EditRecipeProps {
    onClose: () => void;
    onUpdate: (data: UpdateRecipeData) => void;
    initialData: Recipe;
}

const EditRecipe = ({ onClose, onUpdate, initialData }: EditRecipeProps) => {

    const parseTargetStage = (targetStage: string) => {
        if (!targetStage) return { ageFrom: '', ageTo: '' };
        const rangeMatch = targetStage.match(/(\d+)\s*[-–]\s*(\d+)/); 
        if (rangeMatch) return { ageFrom: rangeMatch[1], ageTo: rangeMatch[2] };
        const singleMatch = targetStage.match(/(\d+)/);
        if (singleMatch) return { ageFrom: singleMatch[1], ageTo: singleMatch[1] };
        return { ageFrom: '', ageTo: '' };
    };

    const getInitialUnit = (data: Recipe) => {
        const str = (data.targetStage || data.ageRange || '').toString();
        
        if (str.includes('เดือน') || str.toLowerCase().includes('month')) return 'month';
        if (str.includes('วัน') || str.toLowerCase().includes('day')) return 'day';
        
        if (data.ageUnit) {
            return data.ageUnit.toLowerCase();
        }
        
        return 'day';
    };

    const [name, setName] = useState('');
    const [farmType, setFarmType] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('day');
    const [ageFrom, setAgeFrom] = useState('');
    const [ageTo, setAgeTo] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instruction, setInstruction] = useState('');
    const [recommendations, setRecommendations] = useState('');

    useEffect(() => {
        if (initialData) {
            const parsed = parseTargetStage(initialData?.targetStage || initialData?.ageRange || '');
            const initialRawFarmType = (initialData as any).farmType || (initialData as any).primaryFarmType || '';
            
            setName(initialData.name || '');
            setFarmType(normalizeFarmType(initialRawFarmType));
            setSelectedUnit(getInitialUnit(initialData));
            setAgeFrom(parsed.ageFrom);
            setAgeTo(parsed.ageTo);
            setIngredients((initialData as any).ingredients || '');
            setInstruction((initialData as any).instruction || '');
            setRecommendations(initialData.recommendations || '');
        }
    }, [initialData]);

    const handleFarmTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value;
        setFarmType(newType);

        const preset = AGE_PRESETS[newType];
        if (preset) {
            setSelectedUnit(preset.unit);
            setAgeFrom(preset.from);
            setAgeTo(preset.to);
        }
    };

    const handleUnitChange = (unit: string) => {
        setSelectedUnit(unit);
    };

    const handleUpdate = () => {
        const formData: UpdateRecipeData = {
            id: initialData.id,
            recipeName: name,
            farmType,
            ageFrom,    
            ageTo,      
            ageUnit: selectedUnit, 
            ingredients,  
            instruction,  
            recommendations,
        };

        if (onUpdate) onUpdate(formData);
    };

    const currentUnitLabel = UNIT_OPTIONS.find(u => u.value === selectedUnit)?.label || 'ระบุข้อมูล';

    return (
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 pointer-events-auto overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">แก้ไขสูตรอาหาร</h2>

            <form className="space-y-4 pb-2" onSubmit={(e) => e.preventDefault()}>
                <FormInput
                    label="ชื่อสูตรอาหาร"
                    placeholder="ระบุข้อมูล"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
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
                        onChange={handleFarmTypeChange} 
                        options={FARM_TYPE_OPTIONS}
                    />

                    <FormSelect 
                        label="หน่วยของช่วงเวลา"
                        placeholder="เลือกหน่วย" 
                        value={selectedUnit}
                        onChange={(e) => handleUnitChange(e.target.value)}
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
                    rows={6}
                />

                <FormTextarea
                    label="วิธีการทำ"
                    placeholder="ระบุข้อมูล"
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    rows={6}
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
                        type="button"
                        onClick={handleUpdate}
                        className="flex-1 px-4 py-3 bg-[#179678] border border-transparent rounded-lg text-base font-semibold text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#179678]/50"
                    >
                        บันทึก
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditRecipe;