'use client';

import React, { useState, useRef, ChangeEvent } from 'react'; 
import DownArrowIcon from '../../assets/fm-down.svg';

const FARM_TYPE_OPTIONS = [
    { value: 'SMALL', label: 'ปลาตุ้ม' },
    { value: 'LARGE', label: 'ปลานิ้ว' },
    { value: 'MARKET', label: 'ปลาตลาด' },
];

const FOOD_TYPE_OPTIONS = [
    { value: 'FRESH', label: 'อาหารสด' },
    { value: 'PELLET', label: 'อาหารเม็ด' },
    { value: 'SUPPLEMENT', label: 'อาหารเสริม' },
];

const UNIT_OPTIONS = [
    { value: 'cm', label: 'ซม.' },
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
                    placeholder={placeholder} 
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#179678]/50 placeholder-gray-400"
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
                <option value="" disabled>{placeholder}</option> 
                
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
    foodType: string;
    targetSize: string;
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
    const [foodType, setFoodType] = useState<string>('');
    const [sizeInput, setSizeInput] = useState<string>('');
    
    const [selectedUnit, setSelectedUnit] = useState<string>('');

    const [ingredients, setIngredients] = useState<string>(''); 
    const [instruction, setInstruction] = useState<string>(''); 
    const [recommendations, setRecommendations] = useState<string>('');

    const handleCreate = () => {
        const formData: NewRecipeFormData = { 
            recipeName,
            farmType,
            foodType,
            targetSize: sizeInput, 
            ageUnit: selectedUnit, 
            ingredients,
            instruction, 
            recommendations,
        };
        
        if (onCreate) {
            onCreate(formData); 
        }
    };

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
                    
                    <FormSelect 
                        label="ประเภทอาหาร"
                        placeholder="เลือกประเภทอาหาร" 
                        value={foodType}
                        onChange={(e) => setFoodType(e.target.value)}
                        options={FOOD_TYPE_OPTIONS}
                    />

                    <FormSelect 
                        label="กลุ่มการเลี้ยง"
                        placeholder="เลือกกลุ่มการเลี้ยง" 
                        value={farmType}
                        onChange={(e) => setFarmType(e.target.value)}
                        options={FARM_TYPE_OPTIONS}
                    />

                    <div className="grid grid-cols-3 gap-3 items-end">
                        <div className="col-span-2">
                            <FormInput 
                                label={`ขนาดที่แนะนำ`}
                                type="text"
                                placeholder="เช่น 5-10 หรือ >10"
                                value={sizeInput}
                                onChange={(e) => setSizeInput(e.target.value)}
                            />
                        </div>

                        <div className="col-span-1">
                             <FormSelect 
                                label="หน่วย"
                                placeholder="เลือกหน่วย" 
                                value={selectedUnit}
                                onChange={(e) => setSelectedUnit(e.target.value)}
                                options={UNIT_OPTIONS}
                            />
                        </div>
                    </div>
                </div>

                <FormTextarea 
                    label="ข้อมูลโภชนาการ"
                    placeholder="ระบุโปรตีน, ไขมัน, วิตามิน..." 
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)} 
                    rows={4}
                />

                <FormTextarea 
                    label="วิธีการใช้"
                    placeholder="ระบุวิธีการให้อาหาร..." 
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)} 
                    rows={4}
                />

                <FormTextarea 
                    label="คำแนะนำ" 
                    placeholder="ข้อควรระวัง..." 
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