'use client';

import React, { useState, ChangeEvent } from 'react';
import toast from 'react-hot-toast';

import EyeSlashIcon from '../../assets/eye_slash.svg';
import EyeVisibleIcon from '../../assets/eye_visible.svg';


interface FormInputProps {
    label: string;
    placeholder?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    passwordToggle?: boolean;
}

interface FormSelectOption {
    value: string;
    label: string;
}

interface FormSelectProps {
    label: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    options: FormSelectOption[];
}


const FormInput = ({ label, placeholder, value, onChange, type = "text", passwordToggle = false }: FormInputProps) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const inputType = passwordToggle ? (showPassword ? "text" : "password") : type;
    
    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="relative">
                <input
                    type={inputType}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#179678]/50 placeholder-gray-400 ${passwordToggle ? 'pr-10' : ''}`}
                />
                {passwordToggle && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            <img src={EyeSlashIcon.src || EyeSlashIcon} alt="Hide password" className="w-5 h-5" />
                        ) : (
                            <img src={EyeVisibleIcon.src || EyeVisibleIcon} alt="Show password" className="w-5 h-5" />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

const FormSelect = ({ label, value, onChange, options }: FormSelectProps) => (
    <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <select
                value={value}
                onChange={onChange}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#179678]/50 bg-white pr-8 ${
                    value === "" ? 'text-gray-400' : 'text-gray-900'
                }`}
            >
                <option value="" disabled>เลือกสิทธิ์</option>
                {options.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
        </div>
        
    </div>
);


export interface NewAdminFormData {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    password?: string; 
}

interface CreateAdminProps {
    onClose: () => void;
    onCreate: (formData: NewAdminFormData) => void;
}


const CreateAdmin = ({ onClose, onCreate }: CreateAdminProps) => {
    const [firstName, setFirstName] = useState<string>(''); 
    const [lastName, setLastName] = useState<string>(''); 
    const [email, setEmail] = useState<string>(''); 
    const [role, setRole] = useState<string>('');
    const [password, setPassword] = useState<string>(''); 
    const [confirmPassword, setConfirmPassword] = useState<string>(''); 
    
    const roleOptions: FormSelectOption[] = [
        { value: 'Admin', label: 'Admin' },
        { value: 'Super Admin', label: 'Super Admin' },
    ];

    const handleCreate = () => {
        if (!firstName || !lastName || !email || !role || !password || !confirmPassword) {
            toast.error(
                "กรุณากรอกข้อมูลให้ครบทุกช่อง",
                { duration: 2000, position: "top-right" } 
            );
            return;
        }
        if (password !== confirmPassword) {
            toast.error(
                "รหัสผ่านไม่ตรงกัน",
                { duration: 2000, position: "top-right" } 
            );
            return;
        }
        
        const formData: NewAdminFormData = { firstName, lastName, email, role, password };
        console.log("Creating Admin:", formData);
        
        onCreate(formData);
        
    };


    return (
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 pointer-events-auto overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">สร้างผู้ดูแลระบบ</h2>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col sm:flex-row gap-4">
                    <FormInput 
                        label="ชื่อ" 
                        placeholder="ชื่อ" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <FormInput 
                        label="นามสกุล" 
                        placeholder="นามสกุล" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <FormInput 
                    label="Email" 
                    placeholder="Email" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <FormSelect 
                    label="สิทธิ์การเข้าถึง"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    options={roleOptions}
                />
                <FormInput 
                    label="Password" 
                    placeholder="Password" 
                    passwordToggle={true}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <FormInput 
                    label="Confirm Password" 
                    placeholder="Confirm Password" 
                    passwordToggle={true}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full pt-4">
                    <button type="button" onClick={onClose}
                        className="flex-1 px-4 py-3 bg-white border border-[#179678] rounded-lg text-base font-semibold text-[#179678] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#179678]/50">
                        ยกเลิก
                    </button>
                    <button type="button" onClick={handleCreate}
                        className="flex-1 px-4 py-3 bg-[#179678] border border-transparent rounded-lg text-base font-semibold text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#179678]/50">
                        สร้าง
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateAdmin;