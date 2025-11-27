'use client';

import React, { useState } from 'react';
import toast from "react-hot-toast";

interface ReportFormProps {
    reportId?: string;
    researcherId?: string;
}

interface InfoDisplayProps {
    value: string | number | null | undefined;
}

const InfoDisplay = ({ value }: InfoDisplayProps) => {
    const hasValue = value !== null && value !== undefined && value !== '';
    return (
        <div className={`w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg min-h-[42px] flex items-center text-sm shadow-sm
            ${hasValue ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
             {hasValue ? value : '-'}
        </div>
    );
};

const ReportForm = ({ reportId, researcherId }: ReportFormProps) => {
    
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState<any>({
        fish_month: "31-60",
        fish_type: "บ่อดิน",
        pond_count: "10, 15",
        fish_amount: "250-300",
        feed_type: "อาหารเม็ด",
        feed_amount: "15",
        water_do: "5.5",
        water_t: "28",
        water_ph: "7.5",
        water_alk: "120",
        water_nh: "0.5",
        notes: "-"
    });

    const [tempData, setTempData] = useState<any>({});

    const handleStartEdit = () => {
        setTempData({ ...formData }); 
        setIsEditing(true);
    };

    const handleCancel = () => {
        setTempData({}); 
        setIsEditing(false);
    };

    const fieldLabels: { [key: string]: string } = {
        pond_count: 'จำนวนบ่อ',
        fish_amount: 'จำนวนปลาที่เลี้ยง',
        feed_amount: 'ปริมาณอาหาร',
        water_do: 'ค่า DO',
        water_t: 'ค่า T',
        water_ph: 'ค่า pH',
        water_alk: 'ค่า Alk',
        water_nh: 'ค่า NH',
    };

    const validateForm = (data: any) => {
        const allowedPattern = /^[0-9\s~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/]+$/;

        const skipValidation = ['notes', 'fish_month', 'fish_type', 'feed_type'];

        for (const [key, value] of Object.entries(data)) {
            if (skipValidation.includes(key)) continue;

            const strValue = String(value || '');

            if (strValue.trim() !== '' && !allowedPattern.test(strValue)) {
                const labelName = fieldLabels[key] || key;
                
                toast.error(
                    <span>
                        <b>{labelName}</b> ระบุไม่ถูกต้อง <br/> 
                        (กรอกได้เฉพาะตัวเลข และสัญลักษณ์เท่านั้น ห้ามกรอกตัวอักษร)
                    </span>,
                    { duration: 4000, position: "top-right" }
                );
                return false; 
            }
        }
        return true; 
    };

    const handleSave = () => {
        const isDataChanged = JSON.stringify(formData) !== JSON.stringify(tempData);

        if (!isDataChanged) {
            toast.error(
                <span>ยังไม่ได้แก้ไขข้อมูล</span>,
                { duration: 2000, position: "top-right" }
            );
            return; 
        }

        if (!validateForm(tempData)) {
            return; 
        }

        setFormData({ ...tempData }); 
        
        toast.success(
            <span>บันทึกข้อมูลสำเร็จ!</span>,
            { duration: 2000, position: "top-right" }
        );

        console.log('Saved Data:', tempData);
        setIsEditing(false);
    };

    const handleInputChange = (field: string, value: any) => {
        setTempData((prev: any) => ({
            ...prev,
            [field]: value
        }));
    };

    const fishAgeOptions = [
        { value: '0-15', label: '0-15 วัน' },
        { value: '16-30', label: '16-30 วัน' },
        { value: '31-60', label: '31-60 วัน' },
        { value: '61-90', label: '61-90 วัน' },
        { value: '91-120', label: '91-120 วัน' },
        { value: '>120', label: '>120 วัน' },
    ];

    const SectionHeader = ({ title }: { title: string }) => (
        <div className="w-full bg-[#093832] px-4 py-3 rounded-t-lg flex items-center gap-2">
            <div className="w-3 h-0.5 bg-white opacity-50"></div>
            <span className="text-white font-medium text-base">{title}</span>
        </div>
    );

    const renderField = (
        label: string, 
        fieldKey: string, 
        type: 'text' | 'select' | 'textarea' = 'text',
        options: { value: string, label: string }[] | string[] = [], 
        placeholder: string = "ระบุข้อมูล"
    ) => {
        const currentValue = isEditing ? tempData[fieldKey] : formData[fieldKey];

        const getDisplayValue = () => {
            if (!currentValue) return null;
            if (type === 'select' && options.length > 0 && typeof options[0] !== 'string') {
                const matchedOption = (options as {value:string, label:string}[]).find(opt => opt.value === currentValue);
                return matchedOption ? matchedOption.label : currentValue;
            }
            return currentValue;
        };

        return (
            <div className="col-span-1 w-full">
                <label className="block text-sm text-gray-800 mb-1.5 ml-1">{label}</label>
                
                {isEditing ? (
                    type === 'select' ? (
                        <div className="relative">
                            <select
                                value={currentValue || ''}
                                onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#179678] appearance-none cursor-pointer"
                            >
                                <option value="" disabled>{placeholder}</option>
                                {options.map((opt: any) => {
                                    const val = typeof opt === 'string' ? opt : opt.value;
                                    const lab = typeof opt === 'string' ? opt : opt.label;
                                    return <option key={val} value={val}>{lab}</option>;
                                })}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    ) : type === 'textarea' ? (
                        <textarea 
                            rows={4}
                            value={currentValue || ''}
                            onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                            placeholder={placeholder}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#179678]"
                        />
                    ) : (
                        <input 
                            type="text"
                            value={currentValue || ''}
                            onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                            placeholder={placeholder}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#179678]"
                        />
                    )
                ) : (
                    <InfoDisplay value={getDisplayValue()} />
                )}
            </div>
        );
    };
    
    return (
        <div className="w-full space-y-6 pb-10">
            
            <div className="flex justify-end gap-3 mb-6">
                {!isEditing ? (
                    <button 
                        onClick={handleStartEdit}
                        className="px-8 py-2 bg-[#179678] text-white rounded-lg hover:bg-[#137d64] transition-colors shadow-sm font-medium"
                    >
                        Edit
                    </button>
                ) : (
                    <>
                        <button 
                            onClick={handleCancel}
                            className="px-8 py-2 bg-[#454545] text-white rounded-lg hover:bg-[#333] transition-colors shadow-sm font-medium"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            className="px-8 py-2 bg-[#179678] text-white rounded-lg hover:bg-[#137d64] transition-colors shadow-sm font-medium"
                        >
                            Save
                        </button>
                    </>
                )}
            </div>
            
            <div className="rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <SectionHeader title="ข้อมูลฟาร์ม" />
                <div className="bg-[#F4F6F8] p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {renderField("เลือกช่วงอายุปลา", "fish_month", "select", fishAgeOptions)}
                    {renderField("ประเภทบ่อ", "fish_type", "select", ["บ่อดิน", "บ่อปูน"], "ระบุข้อมูล เช่น บ่อดิน, บ่อปูน")}
                    
                    {renderField("จำนวนบ่อ", "pond_count", "text", [], "ระบุจำนวน เช่น 10, 15, 20")}
                    {renderField("จำนวนปลาที่เลี้ยง (ตัว)", "fish_amount", "text", [], "ระบุข้อมูล เช่น 250, 250-350")}
                </div>
            </div>
            
            <div className="rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                 <SectionHeader title="ข้อมูลการให้อาหาร" />
                <div className="bg-[#F4F6F8] p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderField("ประเภทอาหาร", "feed_type", "select", ["อาหารเม็ด", "อาหารสด", "รำละเอียด"], "กรุณาเลือกประเภท")}
                    {renderField("ปริมาณอาหาร (กิโลกรัม)", "feed_amount", "text", [], "ระบุจำนวน เช่น 10, 15, 20")}
                </div>
            </div>

            <div className="rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                 <SectionHeader title="ข้อมูลคุณภาพน้ำ" />
                <div className="bg-[#F4F6F8] p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {renderField("Do (mg/L)", "water_do")}
                    {renderField("T (°C)", "water_t")}
                    {renderField("pH", "water_ph")}
                    {renderField("Alk (mg/L)", "water_alk")}
                    {renderField("NH (mg/L)", "water_nh")}
                </div>
            </div>
            
            <div className="rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                 <SectionHeader title="บันทึกเพิ่มเติม" />
                 <div className="bg-[#F4F6F8] p-6">
                    {renderField("หมายเหตุ", "notes", "textarea")}
                 </div>
            </div>

        </div>
    );
};

export default ReportForm;