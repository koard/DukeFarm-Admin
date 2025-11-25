'use client';

import React, { useState, ChangeEvent } from 'react';

import SearchIcon from '../../assets/fm-search.svg'; 
import EditIcon from '../../assets/ac-edit.svg'; 
import DeleteIcon from '../../assets/ac-delete.svg'; 

import { Role } from "../../app/permissions/page"; 

interface RoleListItemProps {
    role: Role;
    isSelected: boolean;
    onSelect: (roleId: number) => void;
    onEdit: (role: Role) => void;
    onDelete: (role: Role) => void;
    isMenuOpen: boolean;
    onToggleMenu: (roleId: number | null) => void;
}

interface RoleListProps {
    roles: Role[];
    selectedRoleId: number | null;
    onSelectRole: (roleId: number) => void;
    onSearchChange: (searchTerm: string) => void;
    onEditRole: (role: Role) => void;
    onDeleteRole: (role: Role) => void;
}

const RoleListItem = ({ role, isSelected, onSelect, onEdit, onDelete, isMenuOpen, onToggleMenu }: RoleListItemProps) => {

    const ThreeDotMenu = () => (
        <div className="relative"> 
            <button 
                className="p-1 rounded-full hover:bg-gray-200 z-30" 
                onClick={(e) => { e.stopPropagation(); onToggleMenu(role.id); }}
                type="button"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                </svg>
            </button>
            
            {isMenuOpen && (
                <div 
                    className="absolute right-0 top-full mt-2 w-32 bg-white rounded-lg shadow-xl z-50 border border-gray-200" 
                    onMouseLeave={() => onToggleMenu(null)} 
                >
                    <button 
                        onClick={() => { onEdit(role); onToggleMenu(null); }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                        <img src={EditIcon.src || EditIcon} alt="edit" className="w-4 h-4" /> เเก้ไข
                    </button>
                    <button 
                        onClick={() => { onDelete(role); onToggleMenu(null); }} 
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                        <img src={DeleteIcon.src || DeleteIcon} alt="delete" className="w-4 h-4" /> ลบสิทธิ์
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div 
            className={`flex justify-between items-center px-4 py-3 cursor-pointer rounded-lg transition-colors duration-150 relative ${ 
                isSelected ? 'bg-[#C4EDDE] text-gray-900 font-semibold' : 'hover:bg-gray-50 text-gray-800'
            }`}
            onClick={() => onSelect(role.id)}
        >
            <span>{role.name}</span>
            {role.editable && isSelected && (
                <ThreeDotMenu />
            )}
        </div>
    );
};


const RoleList = ({ roles, selectedRoleId, onSelectRole, onSearchChange, onEditRole, onDeleteRole }: RoleListProps) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [openMenuId, setOpenMenuId] = useState<number | null>(null); 

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => { 
        setSearchTerm(e.target.value);
        onSearchChange(e.target.value);
    };
    
    const toggleMenu = (roleId: number | null) => { 
        setOpenMenuId(openMenuId === roleId ? null : roleId);
    };

    const filteredRoles = roles.filter(role => 
        role.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (role: Role) => { 
        setOpenMenuId(null); 
        onEditRole(role); 
    };
    const handleDelete = (role: Role) => { 
        setOpenMenuId(null); 
        onDeleteRole(role); 
    };


    return (
        <div className="bg-white p-4 rounded-lg shadow-md max-h-[70vh] overflow-y-auto z-10"> 
            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="ค้นหา ชื่อสิทธิ์การเข้าถึง" 
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus-within:border-[#034A30] focus:ring-1 focus:ring-[#034A30]"
                />
                <img src={SearchIcon.src || SearchIcon} alt="search" className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="space-y-1">
                {filteredRoles.map(role => (
                    <RoleListItem
                        key={role.id}
                        role={role}
                        isSelected={role.id === selectedRoleId}
                        onSelect={onSelectRole}
                        onEdit={handleEdit} 
                        onDelete={handleDelete} 
                        isMenuOpen={role.id === openMenuId} 
                        onToggleMenu={toggleMenu} 
                    />
                ))}
            </div>

            {filteredRoles.length === 0 && (
                <div className="text-center py-6 text-gray-500">ไม่พบสิทธิ์การเข้าถึง</div>
            )}
        </div>
    );
};

export default RoleList;