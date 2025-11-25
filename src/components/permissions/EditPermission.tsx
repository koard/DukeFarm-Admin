'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import toast from 'react-hot-toast';

import { Role } from "../../app/permissions/page"; 

interface FormInputProps {
    label: string;
    placeholder?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface UpdateRoleData {
    id: number;
    name: string;
}

interface EditAccessProps {
    onClose: () => void;
    onUpdate: (data: UpdateRoleData) => void;
    initialData: Role;
    roles: Role[];
}


const FormInput = ({ label, placeholder, value, onChange }: FormInputProps) => (
    <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#179678]/50 placeholder-gray-400"
        />
    </div>
);


const EditAccess = ({ onClose, onUpdate, initialData, roles }: EditAccessProps) => {

    const [roleName, setRoleName] = useState<string>(initialData?.name || '');

    useEffect(() => {
        setRoleName(initialData?.name || '');
    }, [initialData]);


    const handleUpdate = () => {
        const trimmedName = roleName.trim();

        if (!trimmedName) {
            toast.error(
                "กรุณาระบุชื่อสิทธิ์",
                { duration: 2000, position: "top-right" }
            );
            return;
        }

        const isDuplicate = roles.some(
            role => role.id !== initialData.id &&
                     role.name.toLowerCase() === trimmedName.toLowerCase()
        );

        if (isDuplicate) {
            toast.error(
                "มีชื่อสิทธิ์นี้อยู่แล้ว",
                { duration: 2000, position: "top-right" }
            );
            return; 
        }

        const formData: UpdateRoleData = { id: initialData.id, name: trimmedName };
        console.log("Updating Access Role:", formData);

        onUpdate(formData);
        
    };


    return (
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 pointer-events-auto overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">แก้ไขสิทธิ์การเข้าถึง</h2>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>

                <FormInput
                    label="ชื่อสิทธิ์"
                    placeholder="ระบุชื่อสิทธิ์"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
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

export default EditAccess;