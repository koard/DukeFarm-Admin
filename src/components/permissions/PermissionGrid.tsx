'use client';

import React, { useEffect } from 'react';

import { Permission, PermissionActions } from "../../app/permissions/page"; 


interface GreenDotProps {
    isChecked: boolean;
}

const GreenDot = ({ isChecked }: GreenDotProps) => (
    <div
        className={`w-4 h-4 rounded-full transition-colors duration-100 ${
            isChecked ? 'bg-[#009D64]' : 'bg-gray-200'
        }`}
    >
    </div>
);

type ActionKey = keyof PermissionActions; 

interface PermissionCheckboxProps {
    isChecked: boolean;
    onChange: (module: string, action: ActionKey, value: boolean) => void;
    module: string;
    action: ActionKey;
    disabled?: boolean;
}

const PermissionCheckbox = ({ isChecked, onChange, module, action, disabled = false }: PermissionCheckboxProps) => {
    return (
        <div
            className={`flex justify-center items-center cursor-pointer p-1 rounded-full transition-colors duration-150 ${
                disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-[#009D64]/10'
            }`}
            onClick={() => !disabled && onChange(module, action, !isChecked)}
        >
            <div className="w-6 h-6 flex items-center justify-center">
                <GreenDot isChecked={isChecked} />
            </div>
        </div>
    );
};


interface GroupedPermission {
    group: string;
    items: Permission[];
}

interface PermissionGridProps {
    permissions: Permission[];
    onPermissionChange: (module: string, action: ActionKey, value: boolean) => void;
}

const PermissionGrid = ({ permissions, onPermissionChange }: PermissionGridProps) => {

    useEffect(() => {
        console.log("PermissionGrid received new permissions prop:", permissions);
    }, [permissions]);

    const actions: ActionKey[] = ['read', 'create', 'edit', 'delete'];
    const actionLabels: { [key in ActionKey]: string } = {
        read: 'อ่าน',
        create: 'สร้าง',
        edit: 'แก้ไข',
        delete: 'ลบ',
    };

    const groupedPermissions = permissions.reduce((acc: { [key: string]: GroupedPermission }, perm) => {
        const groupKey = perm.module;
        if (!acc[groupKey]) {
            acc[groupKey] = { group: groupKey, items: [] };
        }
        acc[groupKey].items.push(perm);
        return acc;
    }, {});
    
    const groupedPermissionsArray: GroupedPermission[] = Object.values(groupedPermissions);


    return (
        <div className="bg-white rounded-xl shadow-md p-4 mb-15">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr className="text-sm font-bold text-gray-800 bg-white">
                            <th className="px-4 py-3 text-left w-1/3">เมนู ทั้งหมด</th>
                            {actions.map(action => (
                                <th key={action} className="px-4 py-3 text-center w-1/6">
                                    {action === 'read' ? 'เข้าถึง' : actionLabels[action]} 
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {groupedPermissionsArray.length === 0 ? (
                            <tr>
                                <td colSpan={actions.length + 1} className="px-4 py-4 text-center text-gray-500">
                                    ไม่มีข้อมูลสิทธิ์สำหรับ Role นี้
                                </td>
                            </tr>
                        ) : (
                            groupedPermissionsArray.map((group, groupIndex) => (
                                <React.Fragment key={groupIndex}>
                                    <tr className="bg-gray-100 h-10">
                                        <td className="px-4 py-2 font-bold text-gray-800" colSpan={actions.length + 1}> 
                                            {group.group}
                                        </td>
                                    </tr>
                                    {group.items.map((perm, index) => (
                                        <tr key={`${perm.module}-${perm.subModule}-${index}`} className="bg-white hover:bg-gray-50 h-10">
                                            <td className="px-4 py-2 text-sm text-gray-700">
                                                {perm.subModule}
                                            </td>
                                            {actions.map(action => (
                                                <td key={action} className="px-4 py-2 text-center">
                                                    <PermissionCheckbox
                                                        isChecked={perm.actions[action as keyof PermissionActions]} 
                                                        onChange={onPermissionChange}
                                                        module={perm.module}
                                                        action={action}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PermissionGrid;