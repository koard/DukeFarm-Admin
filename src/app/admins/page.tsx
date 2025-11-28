'use client';

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

import AdminToolbar from "../../components/admins/AdminToolbar";
import AdminTable from "../../components/admins/AdminTable";
import CreateAdmin from "../../components/admins/CreateAdmin";
import EditAdmin, { UpdatedAdminData } from "../../components/admins/EditAdmin"; 

import Pagination from "../../components/common/Pagination";
import DeleteConfirm from "../../components/common/DeleteConfirm"; 

export interface Admin {
    id: number;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    role: "Admin" | "Super Admin" | string;
    createDate: string;
    createBy: string;
}

interface ModalState {
    type: 'create' | 'edit' | 'delete' | null;
    data: Admin | null;
}

const MOCK_ADMINS: Admin[] = [
    { id: 1, name: "Sompong MeeDee", firstName: "Sompong", lastName: "Meedee", email: "mil@mail.com", role: "Admin", createDate: "01/06/2025 - 14:30:56", createBy: "Admin" },
    { id: 2, name: "Yanee Arkorn", firstName: "Yanee", lastName: "Arkorn", email: "el@mail.com", role: "Super Admin", createDate: "01/06/2025 - 14:30:56", createBy: "Admin" },
    { id: 3, name: "Admin 3", firstName: "Admin", lastName: "Three", email: "admin3@mail.com", role: "Admin", createDate: "02/06/2025 - 10:00:00", createBy: "Super Admin" },
    { id: 4, name: "Admin 4", firstName: "Admin", lastName: "Four", email: "admin4@mail.com", role: "Admin", createDate: "03/06/2025 - 11:00:00", createBy: "Super Admin" },
    { id: 5, name: "Admin 5", firstName: "Admin", lastName: "Five", email: "admin5@mail.com", role: "Admin", createDate: "04/06/2025 - 12:00:00", createBy: "Super Admin" },
    { id: 6, name: "Admin 6", firstName: "Admin", lastName: "Six", email: "admin6@mail.com", role: "Admin", createDate: "05/06/2025 - 13:00:00", createBy: "Super Admin" },
    { id: 7, name: "Admin 7", firstName: "Admin", lastName: "Seven", email: "admin7@mail.com", role: "Admin", createDate: "06/06/2025 - 14:00:00", createBy: "Super Admin" },
    { id: 8, name: "Admin 8", firstName: "Admin", lastName: "Eight", email: "admin8@mail.com", role: "Admin", createDate: "07/06/2025 - 15:00:00", createBy: "Super Admin" },
    { id: 9, name: "Admin 9", firstName: "Admin", lastName: "Nine", email: "admin9@mail.com", role: "Admin", createDate: "08/06/2025 - 16:00:00", createBy: "Super Admin" },
    { id: 10, name: "Admin 10", firstName: "Admin", lastName: "Ten", email: "admin10@mail.com", role: "Admin", createDate: "09/06/2025 - 17:00:00", createBy: "Super Admin" },
    { id: 11, name: "Admin 11", firstName: "Admin", lastName: "Eleven", email: "admin11@mail.com", role: "Admin", createDate: "10/06/2025 - 18:00:00", createBy: "Super Admin" },
];


function Admins() {
    const [admins, setAdmins] = useState<Admin[]>([]); 
    const [isLoading, setIsLoading] = useState<boolean>(true); 
    const [currentPage, setCurrentPage] = useState<number>(1); 
    const [searchTerm, setSearchTerm] = useState<string>(''); 
    const [selectedRole, setSelectedRole] = useState<string>(''); 
    const [itemsPerPage, setItemsPerPage] = useState<number>(10); 
    
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

    useEffect(() => {
        setTimeout(() => {
            setAdmins(MOCK_ADMINS); 
            setIsLoading(false);
        }, 500);
    }, []);

    const filteredAdmins = admins.filter((admin: Admin) => { 
        const lowerSearchTerm = searchTerm.toLowerCase();
        const searchMatch = (admin.name && admin.name.toLowerCase().includes(lowerSearchTerm)) || 
                             (admin.email && admin.email.toLowerCase().includes(lowerSearchTerm));
        
        const roleMatch = selectedRole ? admin.role === selectedRole : true; 
        return searchMatch && roleMatch;
    });

    const totalItems = filteredAdmins.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const paginatedAdmins = filteredAdmins.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleConfirmDelete = () => {
        if (!modalState.data) return;
        const adminToDelete = modalState.data as Admin; 

        setAdmins((prevAdmins) =>
            prevAdmins.filter((a) => a.id !== adminToDelete.id)
        );
        
        toast.success(
            (t_success) => ( 
                <div className="flex items-center justify-center gap-2 w-full"> 
                    <span>{`ลบข้อมูล "${adminToDelete.name}" สำเร็จ!`}</span>
                </div>
            ),
            { 
                duration: 2000, 
                position: "top-right",
            }
        );

        setModalState({ type: null, data: null });
    };

    const handleDeleteClick = (admin: Admin) => { 
        setModalState({ type: 'delete', data: admin });
    };
    
    const handleSearchChange = (term: string) => { 
        setSearchTerm(term);
        setCurrentPage(1); 
    };
    const handleRoleChange = (role: string) => { 
        setSelectedRole(role);
        setCurrentPage(1); 
    };

    const handleItemsPerPageChange = (newSize: number) => { 
        setItemsPerPage(newSize);
        setCurrentPage(1);
    };

    const handleCreateAdmin = (formData: any) => { 
        const isValid = 
            formData.firstName?.trim() &&
            formData.lastName?.trim() &&
            formData.email?.trim() &&
            formData.role?.trim() &&
            formData.password?.trim();

        if (!isValid) {
            toast.error("กรุณากรอกข้อมูลให้ครบถ้วน", { 
                duration: 2000, 
                position: "top-right" 
            });
            return;
        }

        setAdmins((prevAdmins) => {
            const maxId = prevAdmins.length > 0 
                ? Math.max(...prevAdmins.map(item => item.id)) 
                : 0; 
            
            const now = new Date();
            const createDateTimestamp = `${now.toLocaleDateString('en-GB')} - ${now.toLocaleTimeString('th-TH', { hour12: false })}`;

            const newAdmin: Admin = { 
                id: maxId + 1,
                name: `${formData.firstName} ${formData.lastName}`,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                role: formData.role,
                createDate: createDateTimestamp,
                createBy: "Admin", 
            };
            
            return [newAdmin, ...prevAdmins]; 
        });
        
        setModalState({ type: null, data: null });
        toast.success("เพิ่มผู้ดูแลระบบสำเร็จ!", { duration: 2000, position: "top-right" });
    };

    const handleAddAdminClick = () => {
        setModalState({ type: 'create', data: null });
    };

    const handleUpdateAdmin = (updatedData: any) => { 
        const originalItem = admins.find(a => a.id === updatedData.id);
        if (!originalItem) return;

        const isInfoSame =
            originalItem.firstName === updatedData.firstName &&
            originalItem.lastName === updatedData.lastName &&
            originalItem.email === updatedData.email &&
            originalItem.role === updatedData.role;

        const isPasswordEmpty = !updatedData.password || updatedData.password.trim() === '';

        if (isInfoSame && isPasswordEmpty) {
            toast.error("ยังไม่ได้มีการแก้ไขข้อมูล", {
                duration: 2000,
                position: "top-right",
            });
            return; 
        }

        setAdmins((prevAdmins) => 
            prevAdmins.map((admin) => {
                if (admin.id !== updatedData.id) {
                    return admin;
                }
                const now = new Date();
                const updatedTimestamp = `${now.toLocaleDateString('en-GB')} - ${now.toLocaleTimeString('th-TH', { hour12: false })}`;

                return {
                    ...admin, 
                    ...updatedData, 
                    name: `${updatedData.firstName} ${updatedData.lastName}`,
                    createDate: updatedTimestamp, 
                } as Admin; 
            })
        );
        
        setModalState({ type: null, data: null });
        toast.success("แก้ไขผู้ดูแลระบบสำเร็จ!", { duration: 2000, position: "top-right" });
    };

    const handleEditAdminClick = (adminId: number) => { 
        const adminToEdit = admins.find(a => a.id === adminId);
        if (!adminToEdit) {
            toast.error(
                "ไม่พบข้อมูลผู้ดูแลระบบ",
                { duration: 2000, position: "top-right" } 
            );
            return;
        }
        
        setModalState({ type: 'edit', data: adminToEdit });
    };

    const renderModal = () => {
        const adminData = modalState.data as Admin; 
        let modalContent = null;

        switch (modalState.type) {
            case 'delete':
                return adminData && (
                    <DeleteConfirm 
                        isOpen={true}
                        onClose={() => setModalState({ type: null, data: null })}
                        onConfirm={handleConfirmDelete}
                        title="ลบข้อมูลผู้ดูแลระบบ"
                        itemName={adminData.name}
                    />
                );
            case 'create':
                modalContent = (
                    <CreateAdmin
                        onClose={() => setModalState({ type: null, data: null })}
                        onCreate={handleCreateAdmin}
                    />
                );
                break;
            case 'edit':
                modalContent = adminData && (
                    <EditAdmin
                        onClose={() => setModalState({ type: null, data: null })}
                        initialData={adminData}
                        onUpdate={handleUpdateAdmin}
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
                <h1 className="text-xl ms-2">ผู้ดูแลระบบ</h1> 
                <div className="flex items-center space-x-3 text-sm">
                    <span className="text-xl me-2">Admin</span>
                </div>
            </header>
            
            <div className="p-6">
                <AdminToolbar 
                    count={totalItems} 
                    onSearchChange={handleSearchChange}
                    onRoleChange={handleRoleChange} 
                    onAddAdminClick={handleAddAdminClick} 
                />
                
                <div className="mt-6 bg-white rounded-lg shadow-md">
                    {isLoading ? (
                        <div className="p-6 text-center">Loading...</div>
                    ) : (
                        <AdminTable
                            adminData={paginatedAdmins} 
                            onEdit={handleEditAdminClick} 
                            onDelete={handleDeleteClick} 
                            startIndex={(currentPage - 1) * itemsPerPage}
                        />
                    )}
                </div>
                
                <div className="mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages} 
                        totalItems={totalItems} 
                        itemsPerPage={itemsPerPage}
                        onItemsPerPageChange={handleItemsPerPageChange}
                        onPageChange={(page) => setCurrentPage(page)} 
                    />
                </div>
            </div>

            {modalState.type && renderModal()}

        </div>
    );
}

export default Admins;