'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast'; 

import CalendarIcon from '../../assets/solar_calendar.svg';
import TimeIcon from '../../assets/formkit_time.svg';
import TempIcon from '../../assets/fluent_temperature-b.svg';
import RainIcon from '../../assets/fluent_weather-b.svg';
import HumidityIcon from '../../assets/mdi_dots-triangle.svg';

interface EditFarmerHistoryProps {
    initialData?: any;
    onClose: () => void;
    onSave: (data: any) => void;
}

const AGE_OPTIONS = [
    { value: '0-15', label: '0-15 วัน' },
    { value: '16-30', label: '16-30 วัน' },
    { value: '31-60', label: '31-60 วัน' },
    { value: '61-90', label: '61-90 วัน' },
    { value: '91-120', label: '91-120 วัน' },
    { value: '>120', label: '>120 วัน' },
];

const fieldLabels: { [key: string]: string } = {
    pondCount: 'จำนวนบ่อ',
    fishCount: 'จำนวนปลาที่เลี้ยง',
    foodAmountKg: 'ปริมาณอาหาร', 
    pondType: 'ประเภทบ่อ',
};

const EditFarmerHistory = ({ initialData, onClose, onSave }: EditFarmerHistoryProps) => {
    
    const cleanNumber = (val: any) => {
        if (!val) return '';
        const strVal = String(val);
        const cleaned = strVal.replace(/[^0-9.]/g, ''); 
        return cleaned; 
    };

    const [formData, setFormData] = useState({
        date: '',
        time: '',
        ageRange: '',
        pondType: 'บ่อปูน',
        pondCount: '',
        fishCount: '',
        foodAmountKg: '', 
        temp: 0,
        rain: 0,
        humidity: 0
    });

    useEffect(() => {
        if (initialData) {
            const dateParts = initialData.date ? initialData.date.split(' - ') : [];
            
            setFormData({
                date: dateParts[0] || '',
                time: dateParts[1] || '',
                ageRange: initialData.age || '31-60', 
                pondType: initialData.pondType || 'บ่อปูน',
                pondCount: initialData.pondCount || '',
                fishCount: initialData.fishCount || '',
                foodAmountKg: cleanNumber(initialData.foodAmountKg),
                
                temp: Number(cleanNumber(initialData.temp)) || 0,
                rain: Number(cleanNumber(initialData.rain)) || 0,
                humidity: Number(cleanNumber(initialData.humidity)) || 0
            });
        }
    }, [initialData]);

    const validateForm = (data: typeof formData) => {
        const allowedPattern = /^[0-9\s~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/]+$/;
        const fieldsToCheck = ['pondCount', 'fishCount', 'foodAmountKg'];

        for (const key of fieldsToCheck) {
            const value = data[key as keyof typeof data];
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (!validateForm(formData)) {
            return; 
        }

        const finalData = {
            ...initialData,
            ...formData,

            foodAmountKg: formData.foodAmountKg ? parseFloat(String(formData.foodAmountKg)) : null,
            weatherTemperatureC: parseFloat(String(formData.temp)),
            weatherRainMm: parseFloat(String(formData.rain)),
            weatherHumidityPct: parseFloat(String(formData.humidity)),
            
            pondCount: Number(formData.pondCount) || 0,
            fishCountText: String(formData.fishCount),
            temp: `${formData.temp} °C`,
            rain: formData.rain,
            humidity: formData.humidity,
            age: formData.ageRange, 
        };

        onSave(finalData);
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
            <h2 className="text-2xl font-bold mb-6">แก้ไขรายละเอียด</h2>

            <div className="flex gap-4 mb-6">
                <div className="flex-1 bg-[#E4F5E7] rounded-lg px-4 py-3 flex items-center gap-3">
                    <Image src={CalendarIcon} alt="date" width={24} height={24} />
                    <span className="text-[#093832] text-lg font-medium">{formData.date || '-'}</span>
                </div>
                <div className="flex-1 bg-[#E4F5E7] rounded-lg px-4 py-3 flex items-center gap-3">
                    <Image src={TimeIcon} alt="time" width={24} height={24} />
                    <span className="text-[#093832] text-lg font-medium">{formData.time || '-'}</span>
                </div>
            </div>

            <div className="mb-6">
                <label className="text-base text-gray-900 mb-2 block font-medium">สภาพอากาศ (แก้ไขได้)</label>
                <div className="grid grid-cols-3 gap-px bg-white overflow-hidden rounded-lg border border-gray-100">
                    <div className="bg-[#D8EFFF] p-3 flex flex-col items-center justify-center gap-1 rounded-l-lg mr-0.5 relative group">
                        <div className="flex items-center gap-1">
                            <Image src={TempIcon} alt="temp" width={16} height={16} />
                            <span className="text-sm text-gray-700">อุณหภูมิ</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <input 
                                type="number" 
                                name="temp"
                                value={formData.temp}
                                onChange={handleChange}
                                className="bg-transparent text-xl font-bold text-gray-900 text-center w-16 focus:outline-none border-b border-transparent focus:border-blue-500"
                            />
                            <span className="text-sm font-bold">°C</span>
                        </div>
                    </div>
                    <div className="bg-[#D8EFFF] p-3 flex flex-col items-center justify-center gap-1 mx-0.5">
                        <div className="flex items-center gap-1">
                            <Image src={RainIcon} alt="rain" width={16} height={16} />
                            <span className="text-sm text-gray-700">ฝน</span>
                        </div>
                        <input 
                            type="number" 
                            name="rain"
                            value={formData.rain}
                            onChange={handleChange}
                            className="bg-transparent text-xl font-bold text-gray-900 text-center w-16 focus:outline-none border-b border-transparent focus:border-blue-500"
                        />
                    </div>
                    <div className="bg-[#D8EFFF] p-3 flex flex-col items-center justify-center gap-1 rounded-r-lg ml-0.5">
                        <div className="flex items-center gap-1">
                            <Image src={HumidityIcon} alt="humidity" width={16} height={16} />
                            <span className="text-sm text-gray-700">ความชื้น</span>
                        </div>
                        <input 
                            type="number" 
                            name="humidity"
                            value={formData.humidity}
                            onChange={handleChange}
                            className="bg-transparent text-xl font-bold text-gray-900 text-center w-16 focus:outline-none border-b border-transparent focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4 mb-8">
                <div>
                    <label className="text-lg text-gray-900 mb-2 block">เลือกช่วงอายุปลา</label>
                    <div className="relative">
                        <select
                            name="ageRange"
                            value={formData.ageRange}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-3 text-lg text-gray-700 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#179678]"
                        >
                            {AGE_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="#093832" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1.5L6 6.5L11 1.5"/></svg>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="text-lg text-gray-900 mb-2 block">ประเภทบ่อ</label>
                    <div className="relative">
                        <select
                            name="pondType"
                            value={formData.pondType}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-3 text-lg text-gray-700 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#179678]"
                        >
                            <option value="">ระบุข้อมูล เช่น บ่อดิน, บ่อปูน</option>
                            <option value="บ่อดิน">บ่อดิน</option>
                            <option value="บ่อปูน">บ่อปูน</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="#093832" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1.5L6 6.5L11 1.5"/></svg>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="text-lg text-gray-900 mb-2 block">จำนวนบ่อ</label>
                    <input
                        type="text"
                        name="pondCount"
                        value={formData.pondCount}
                        onChange={handleChange}
                        placeholder="ระบุข้อจำนวน เช่น 10, 15, 20"
                        className="w-full border border-gray-300 rounded-lg p-3 text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#179678] placeholder-gray-300"
                    />
                </div>

                <div>
                    <label className="text-lg text-gray-900 mb-2 block">จำนวนปลาที่เลี้ยง (ตัว)</label>
                    <input
                        type="text"
                        name="fishCount"
                        value={formData.fishCount}
                        onChange={handleChange}
                        placeholder="ระบุข้อมูล เช่น 250, 250-350"
                        className="w-full border border-gray-300 rounded-lg p-3 text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#179678] placeholder-gray-300"
                    />
                </div>

                <div>
                    <label className="text-lg text-gray-900 mb-2 block">ปริมาณอาหาร (กิโลกรัม)</label>
                    <input
                        type="text"
                        name="foodAmountKg" 
                        value={formData.foodAmountKg}
                        onChange={handleChange}
                        placeholder="ระบุตัวเลข เช่น 10, 15.5"
                        className="w-full border border-gray-300 rounded-lg p-3 text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#179678] placeholder-gray-300"
                    />
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={onClose}
                    className="flex-1 py-3 px-4 rounded-lg border border-[#179678] text-[#179678] text-base font-medium hover:bg-green-50 transition-colors"
                >
                    ยกเลิก
                </button>
                <button
                    onClick={handleSubmit}
                    className="flex-1 py-3 px-4 rounded-lg bg-[#179678] text-white text-base font-medium hover:bg-[#138066] transition-colors"
                >
                    บันทึก
                </button>
            </div>
        </div>
    );
};

export default EditFarmerHistory;