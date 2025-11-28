'use client';

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

import AccessToolbar from "../../components/permissions/PermissionToolbar";
import RoleList from "../../components/permissions/RoleList";
import PermissionGrid from "../../components/permissions/PermissionGrid";
import CreateAccess from '../../components/permissions/CreatePermission';
import EditAccess from '../../components/permissions/EditPermission';

import DeleteIcon from "../../assets/fm-delete.svg";


export interface Role {
    id: number;
    name: string;
    editable: boolean;
}

export interface PermissionActions {
    read: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
}

export interface Permission {
    module: string;
    subModule: string;
    actions: PermissionActions;
}

export interface PermissionsByRole {
    [roleId: number]: Permission[];
}

interface DeleteRoleModalProps {
    role: Role;
    onConfirm: () => void;
    onCancel: () => void;
}

interface ModalState {
    type: 'create' | 'edit' | 'delete' | null;
    data: Role | null;
}


const MOCK_ROLES: Role[] = [
    { id: 1, name: "Super Admin", editable: true },
    { id: 2, name: "Admin", editable: true },
    { id: 3, name: "Staff", editable: true },
];

const MOCK_PERMISSIONS_BY_ROLE: PermissionsByRole = {
    1: [
        { module: "Dashboard", subModule: "Dashboard", actions: { read: true, create: true, edit: true, delete: true } },
        { module: "ข้อมูลเกษตรกร", subModule: "ข้อมูลเกษตรกร", actions: { read: true, create: true, edit: true, delete: true } },
        { module: "ข้อมูลนักวิจัย", subModule: "ข้อมูลนักวิจัย", actions: { read: true, create: true, edit: true, delete: true } },
        { module: "สูตรอาหาร", subModule: "สูตรอาหาร", actions: { read: true, create: true, edit: true, delete: true } },
        { module: "ผู้ดูแลระบบ", subModule: "ผู้ดูแลระบบ", actions: { read: true, create: true, edit: true, delete: true } },
        { module: "สิทธิ์การเข้าถึง", subModule: "สิทธิ์การเข้าถึง", actions: { read: true, create: true, edit: true, delete: true } },
    ],
    2: [
        { module: "Dashboard", subModule: "Dashboard", actions: { read: true, create: false, edit: false, delete: false } },
        { module: "ข้อมูลเกษตรกร", subModule: "ข้อมูลเกษตรกร", actions: { read: true, create: true, edit: true, delete: true } },
        { module: "ข้อมูลนักวิจัย", subModule: "ข้อมูลนักวิจัย", actions: { read: true, create: true, edit: true, delete: true } },
        { module: "สูตรอาหาร", subModule: "สูตรอาหาร", actions: { read: true, create: true, edit: true, delete: true } },
        { module: "ผู้ดูแลระบบ", subModule: "ผู้ดูแลระบบ", actions: { read: true, create: false, edit: false, delete: false } },
        { module: "สิทธิ์การเข้าถึง", subModule: "สิทธิ์การเข้าถึง", actions: { read: true, create: false, edit: false, delete: false } },
    ],
    3: [
        { module: "Dashboard", subModule: "Dashboard", actions: { read: true, create: false, edit: false, delete: false } },
        { module: "ข้อมูลเกษตรกร", subModule: "ข้อมูลเกษตรกร", actions: { read: true, create: false, edit: false, delete: false } },
        { module: "ข้อมูลนักวิจัย", subModule: "ข้อมูลนักวิจัย", actions: { read: true, create: false, edit: false, delete: false } },
        { module: "สูตรอาหาร", subModule: "สูตรอาหาร", actions: { read: true, create: false, edit: false, delete: false } },
        { module: "ผู้ดูแลระบบ", subModule: "ผู้ดูแลระบบ", actions: { read: false, create: false, edit: false, delete: false } },
        { module: "สิทธิ์การเข้าถึง", subModule: "สิทธิ์การเข้าถึง", actions: { read: false, create: false, edit: false, delete: false } },
    ],
};
const getDefaultPermissions = (): Permission[] => [
    { module: "Dashboard", subModule: "Dashboard", actions: { read: false, create: false, edit: false, delete: false } },
    { module: "ข้อมูลเกษตรกร", subModule: "ข้อมูลเกษตรกร", actions: { read: false, create: false, edit: false, delete: false } },
    { module: "ข้อมูลนักวิจัย", subModule: "ข้อมูลนักวิจัย", actions: { read: false, create: false, edit: false, delete: false } },
    { module: "สูตรอาหาร", subModule: "สูตรอาหาร", actions: { read: false, create: false, edit: false, delete: false } },
    { module: "ผู้ดูแลระบบ", subModule: "ผู้ดูแลระบบ", actions: { read: false, create: false, edit: false, delete: false } },
    { module: "สิทธิ์การเข้าถึง", subModule: "สิทธิ์การเข้าถึง", actions: { read: false, create: false, edit: false, delete: false } },
];


const DeleteRoleModal = ({ role, onConfirm, onCancel }: DeleteRoleModalProps) => {
    return (
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 pointer-events-auto">
            <div className="text-center">
                <div className="flex items-center justify-center gap-3">
                    <img src={DeleteIcon.src || DeleteIcon} alt="delete" className="w-6 h-6" />
                    <h2 className="text-2xl font-bold text-gray-800">
                        ลบข้อมูลสิทธิ์การเข้าถึง
                    </h2>
                </div>
                <p className="mt-4 text-base text-gray-800">
                    ต้องการลบ “{role.name}” สิทธิ์การเข้าถึงหรือไม่?
                </p>
                <div className="flex gap-4 mt-8 w-full">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-base font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-3 bg-[#F30000] border border-transparent rounded-lg text-base font-semibold text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#F30000]/50"
                    >
                        ลบ
                    </button>
                </div>
            </div>
        </div>
    );
};


function Access() {
    const [roles, setRoles] = useState<Role[]>(MOCK_ROLES);
    const [permissionsByRole, setPermissionsByRole] = useState<PermissionsByRole>(MOCK_PERMISSIONS_BY_ROLE);
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(MOCK_ROLES[0].id);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const [modalState, setModalState] = useState<ModalState>({ 
        type: null, 
        data: null  
    });

    useEffect(() => {
        if (modalState.type) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [modalState.type]);


    const handleRoleSelect = (roleId: number) => { 
        setSelectedRoleId(roleId);
        console.log("Selected Role ID:", roleId);
    };

    const handlePermissionChange = (moduleName: string, actionName: keyof PermissionActions, value: boolean) => { 
        if (selectedRoleId === null || !permissionsByRole[selectedRoleId]) {
            console.error("No role selected or permissions not found for selected role.");
            return;
        }
        setPermissionsByRole(prevPermissionsByRole => {
            const currentRolePermissions = prevPermissionsByRole[selectedRoleId];
            const updatedPermissions = currentRolePermissions.map(perm => {
                if (perm.module === moduleName) {
                    return { ...perm, actions: { ...perm.actions, [actionName]: value } };
                }
                return perm;
            });
            return { ...prevPermissionsByRole, [selectedRoleId]: updatedPermissions };
        });
        console.log(`Role ${selectedRoleId}: Permission updated: ${moduleName} ${actionName} to ${value}`);
    };

    interface RoleForm { name: string; id?: number; }

    const handleCreateRole = (newRoleData: RoleForm) => {
        if (!newRoleData.name || newRoleData.name.trim() === '') {
            toast.error("กรุณากรอกชื่อสิทธิ์การเข้าถึง", { 
                duration: 2000, 
                position: "top-right" 
            });
            return;
        }

        console.log("New Role Data:", newRoleData);
        let newRoleId: number;
        setRoles(prevRoles => {
            const maxId = prevRoles.length > 0 ? Math.max(...prevRoles.map(r => r.id)) : 0;
            newRoleId = maxId + 1;
            const newRoleObject: Role = { id: newRoleId, name: newRoleData.name, editable: true };
            setSelectedRoleId(newRoleId);
            return [newRoleObject, ...prevRoles];
        });
        setPermissionsByRole(prevPermissions => ({
            ...prevPermissions,
            [newRoleId]: getDefaultPermissions()
        }));
        
        setModalState({ type: null, data: null }); 
        toast.success("สร้างสิทธิ์การเข้าถึงสำเร็จ!", { duration: 2000, position: "top-right" });
    };
    
    const handleAddRoleClick = () => {
        setModalState({ type: 'create', data: null });
    };

    const handleConfirmDelete = () => {
        if (!modalState.data) return;
        const roleToDelete = modalState.data;

        let nextSelectedRoleId: number | null = null;
        setRoles(prevRoles => {
            const remainingRoles = prevRoles.filter(r => r.id !== roleToDelete.id);
            if (selectedRoleId === roleToDelete.id) {
                nextSelectedRoleId = remainingRoles.length > 0 ? remainingRoles[0].id : null;
            } else {
                nextSelectedRoleId = selectedRoleId;
            }
            return remainingRoles;
        });
        setSelectedRoleId(nextSelectedRoleId);

        setPermissionsByRole(prevPermissions => {
            const newPermissions = { ...prevPermissions };
            delete newPermissions[roleToDelete.id];
            return newPermissions;
        });

        setModalState({ type: null, data: null });
        toast.success(`ลบสิทธิ์ ${roleToDelete.name} สำเร็จ!`, { duration: 2000, position: "top-right" }); 
    };

    const handleDeleteRole = (roleToDelete: Role) => { 
        setModalState({ type: 'delete', data: roleToDelete });
    };

    const handleUpdateRole = (updatedRole: RoleForm) => { 
        const originalRole = roles.find(r => r.id === updatedRole.id);
        
        if (!originalRole) return;

        const isUnchanged = originalRole.name === updatedRole.name;

        if (isUnchanged) {
            toast.error("ยังไม่ได้มีการแก้ไขข้อมูล", {
                duration: 2000,
                position: "top-right",
            });
            return;
        }

        console.log("Updated Role Data:", updatedRole);
        setRoles(prevRoles => prevRoles.map(r =>
            r.id === updatedRole.id ? { ...r, name: updatedRole.name } : r
        ));
        
        setModalState({ type: null, data: null }); 
        toast.success("แก้ไขสิทธิ์การเข้าถึงสำเร็จ!", { duration: 2000, position: "top-right" }); 
    };

    const handleEditRole = (roleToEdit: Role) => { 
        setModalState({ type: 'edit', data: roleToEdit });
    };

    const currentPermissions: Permission[] = (selectedRoleId !== null && permissionsByRole[selectedRoleId])
                                            ? permissionsByRole[selectedRoleId]
                                            : [];

    const renderModal = () => {
        const roleData = modalState.data as Role; 
        let modalContent = null;

        switch (modalState.type) {
            case 'delete':
                modalContent = roleData && (
                    <DeleteRoleModal
                        role={roleData}
                        onConfirm={handleConfirmDelete}
                        onCancel={() => setModalState({ type: null, data: null })}
                    />
                );
                break;
            case 'create':
                modalContent = (
                    <CreateAccess
                        roles={roles}
                        onCreate={handleCreateRole}
                        onClose={() => setModalState({ type: null, data: null })}
                    />
                );
                break;
            case 'edit':
                modalContent = roleData && (
                    <EditAccess
                        initialData={roleData}
                        roles={roles} 
                        onUpdate={handleUpdateRole}
                        onClose={() => setModalState({ type: null, data: null })}
                    />
                );
                break;
            default:
                return null;
        }

        if (modalContent) {
            return (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-[rgba(0,0,0,0.5)]"
                >
                    {modalContent}
                </div>
            );
        }
        
        return null;
    };


    return (
        <div className="min-h-screen bg-gray-50"> 
            <header
                className={`h-16 flex justify-between items-center px-5 text-white mb-2 bg-[#034A30] sticky top-0 z-20 shadow-md pl-16 lg:pl-5`}
            >
                <h1 className="text-xl ms-2">สิทธิ์การเข้าถึง</h1>
                <div className="flex items-center space-x-3 text-sm">
                    <span className="text-xl me-2">Admin</span>
                </div>
            </header>

            <div className="p-6">
                <AccessToolbar onAddRoleClick={handleAddRoleClick} />
                <div className="mt-6 flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-1/3 xl:w-1/4">
                        <RoleList
                            roles={roles.filter(role => role.name.toLowerCase().includes(searchTerm.toLowerCase()))}
                            selectedRoleId={selectedRoleId}
                            onSelectRole={handleRoleSelect}
                            onSearchChange={setSearchTerm}
                            onEditRole={handleEditRole}    
                            onDeleteRole={handleDeleteRole} 
                        />
                    </div>
                    <div className="lg:w-2/3 xl:w-3/4">
                        <PermissionGrid
                            permissions={currentPermissions}
                            onPermissionChange={handlePermissionChange}
                        />
                    </div>
                </div>
            </div>

            {modalState.type && renderModal()}
        </div>
    );
}

export default Access;