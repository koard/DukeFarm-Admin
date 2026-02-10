'use client';

import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import DownArrowIcon from '../../assets/fm-down.svg';
import { Recipe } from "../../app/recipes/page";

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
    { value: 'GRAM', label: 'กรัม' },
    { value: 'KG', label: 'กิโลกรัม' },
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
                <option value="" disabled>{placeholder}</option>
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

export interface UpdateRecipeData {
    id: string;
    recipeName: string;
    farmType: string;
    foodType: string;
    targetSize: string;
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

    const [name, setName] = useState('');
    const [farmType, setFarmType] = useState('');
    const [foodType, setFoodType] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('');
    const [targetSize, setTargetSize] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instruction, setInstruction] = useState('');
    const [recommendations, setRecommendations] = useState('');

    useEffect(() => {
        if (initialData) {
            const initialRawFarmType = (initialData as any).farmType || (initialData as any).primaryFarmType || '';
            
            const rawStage = initialData.targetStage || initialData.ageRange || '';
            
            const initialSize = rawStage.replace(/กิโลกรัม|กก\.|kg|KG|กรัม|gram|g|GRAM|ซม\.|cm|ซม/gi, '').trim();

            setName(initialData.name || '');
            setFarmType(normalizeFarmType(initialRawFarmType));
            setFoodType(initialData.foodType || '');
            
            if (rawStage.match(/กิโล|kg|KG/i)) {
                setSelectedUnit('KG');
            } else if (rawStage.match(/กรัม|gram|g|GRAM/i)) {
                setSelectedUnit('GRAM');
            } else {
 
                setSelectedUnit(''); 
            }

            setTargetSize(initialSize);
            setIngredients((initialData as any).ingredients || ''); 
            setInstruction((initialData as any).instruction || ''); 
            setRecommendations(initialData.recommendations || '');
        }
    }, [initialData]);

    const handleUpdate = () => {
        const formData: UpdateRecipeData = {
            id: initialData.id,
            recipeName: name,
            farmType,
            foodType,
            targetSize,
            ageUnit: selectedUnit, 
            ingredients,  
            instruction,  
            recommendations,
        };

        if (onUpdate) onUpdate(formData);
    };

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
                                label="ขนาดที่แนะนำ"
                                placeholder="เช่น 5-10 หรือ >10"
                                value={targetSize}
                                onChange={(e) => setTargetSize(e.target.value)}
                                type="text"
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