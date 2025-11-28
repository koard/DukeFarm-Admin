'use client';

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

import RecipesToolbar from "../../components/recipes/RecipesToolbar";
import RecipesTable from "../../components/recipes/RecipesTable"; 
import CreateRecipe, { NewRecipeFormData } from '../../components/recipes/CreateRecipe'; 
import EditRecipe from '../../components/recipes/EditRecipe';
import ViewRecipe from '../../components/recipes/ViewRecipe';

import Pagination from "../../components/common/Pagination";
import DeleteConfirm from "../../components/common/DeleteConfirm"; 


export interface Recipe {
    id: number;
    name: string;
    ageRange: string;
    ageType: 'range' | 'specific';
    ageStart: string | null;
    ageEnd: string | null;
    ageSpecific: string | null;
    details: string;
    recommendations: string;
    author: string;
    createdAt: string;
    updatedAt: string;
}

interface ModalState {
    type: 'create' | 'edit' | 'view' | 'delete' | null;
    data: Recipe | null;
}

const MOCK_RECIPES_DATA: Recipe[] = [
    { id: 1, name: 'สูตรลูกปลา อายุ 15-40 วัน', ageRange: 'อายุ 15-40 วัน', ageType: 'range', ageStart: '15', ageEnd: '40', ageSpecific: null, details: 'รายละเอียดสูตร 1...', recommendations: 'คำแนะนำ 1...', author: 'Admin 1', createdAt: '12/12/2025 - 15:23:00', updatedAt: '20/12/2025 - 16:23:00' },
    { id: 2, name: 'สูตรปลา อายุ 40-60 วัน', ageRange: 'อายุ 40-60 วัน', ageType: 'range', ageStart: '40', ageEnd: '60', ageSpecific: null, details: 'รายละเอียดสูตร 2...', recommendations: 'คำแนะนำ 2...', author: 'Admin 1', createdAt: '12/12/2025 - 15:23:00', updatedAt: '20/12/2025 - 09:23:00' },
    { id: 3, name: 'สูตรปลา อายุ 60 วันขึ้นไป', ageRange: 'อายุ 60 วันขึ้นไป', ageType: 'specific', ageStart: null, ageEnd: null, ageSpecific: '60', details: `ปลาป่น 25%\nกากถั่วเหลือง 25%\nข้าวโพดป่น 30%\nรำละเอียด 15%\nน้ำมันพืช 3%\nวิตามินรวม 2%`, recommendations: `• ให้ 2 มื้อใหญ่ต่อวัน (เช้า-เย็น)\n• เพิ่มสัดส่วนพลังงาน (ข้าวโพด, รำ) ลดโปรตีนลงเล็กน้อย\n• อัตราโปรตีน 28-32% เพียงพอ\n• ติดตาม FCR เพื่อควบคุมต้นทุนอาหาร`, author: 'Admin 1', createdAt: '12/12/2025 - 15:23:00', updatedAt: '20/12/2025 - 12:23:00' },
    { id: 4, name: 'สูตร 4', ageRange: 'อายุ 1-10 วัน', ageType: 'range', ageStart: '1', ageEnd: '10', ageSpecific: null, details: 'รายละเอียดสูตร 4', recommendations: 'คำแนะนำ 4', author: 'Admin 2', createdAt: '13/12/2025 - 10:00:00', updatedAt: '13/12/2025 - 10:00:00' },
    { id: 5, name: 'สูตร 5', ageRange: 'อายุ 10-20 วัน', ageType: 'range', ageStart: '10', ageEnd: '20', ageSpecific: null, details: 'รายละเอียดสูตร 5', recommendations: 'คำแนะนำ 5', author: 'Admin 1', createdAt: '14/12/2025 - 11:00:00', updatedAt: '14/12/2025 - 11:00:00' },
    { id: 6, name: 'สูตร 6', ageRange: 'อายุ 20-30 วัน', ageType: 'range', ageStart: '20', ageEnd: '30', ageSpecific: null, details: 'รายละเอียดสูตร 6', recommendations: 'คำแนะนำ 6', author: 'Admin 2', createdAt: '15/12/2025 - 12:00:00', updatedAt: '15/12/2025 - 12:00:00' },
    { id: 7, name: 'สูตร 7', ageRange: 'อายุ 30-40 วัน', ageType: 'range', ageStart: '30', ageEnd: '40', ageSpecific: null, details: 'รายละเอียดสูตร 7', recommendations: 'คำแนะนำ 7', author: 'Admin 1', createdAt: '16/12/2025 - 13:00:00', updatedAt: '16/12/2025 - 13:00:00' },
    { id: 8, name: 'สูตร 8', ageRange: 'อายุ 40-50 วัน', ageType: 'range', ageStart: '40', ageEnd: '50', ageSpecific: null, details: 'รายละเอียดสูตร 8', recommendations: 'คำแนะนำ 8', author: 'Admin 2', createdAt: '17/12/2025 - 14:00:00', updatedAt: '17/12/2025 - 14:00:00' },
    { id: 9, name: 'สูตร 9', ageRange: 'อายุ 50-60 วัน', ageType: 'range', ageStart: '50', ageEnd: '60', ageSpecific: null, details: 'รายละเอียดสูตร 9', recommendations: 'คำแนะนำ 9', author: 'Admin 1', createdAt: '18/12/2025 - 15:00:00', updatedAt: '18/12/2025 - 15:00:00' },
    { id: 10, name: 'สูตร 10', ageRange: 'อายุ 60-70 วัน', ageType: 'range', ageStart: '60', ageEnd: '70', ageSpecific: null, details: 'รายละเอียดสูตร 10', recommendations: 'คำแนะนำ 10', author: 'Admin 2', createdAt: '19/12/2025 - 16:00:00', updatedAt: '19/12/2025 - 16:00:00' },
    { id: 11, name: 'สูตร 11', ageRange: 'อายุ 70 วันขึ้นไป', ageType: 'specific', ageStart: null, ageEnd: null, ageSpecific: '70', details: 'รายละเอียดสูตร 11', recommendations: 'คำแนะนำ 11', author: 'Admin 1', createdAt: '20/12/2025 - 17:00:00', updatedAt: '20/12/2025 - 17:00:00' }
]; 


function RecipesPage() { 
    const [data, setData] = useState<Recipe[]>([]); 
    const [isLoading, setIsLoading] = useState<boolean>(true); 
    const [currentPage, setCurrentPage] = useState<number>(1); 
    const [searchTerm, setSearchTerm] = useState<string>(''); 

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

    
    const filteredData = data.filter((item: Recipe) => { 
        const lowerSearchTerm = searchTerm.toLowerCase();
        const nameMatch = item.name && item.name.toLowerCase().includes(lowerSearchTerm);
        const ageRangeMatch = item.ageRange && item.ageRange.toLowerCase().includes(lowerSearchTerm);
        const authorMatch = item.author && item.author.toLowerCase().includes(lowerSearchTerm);
        return nameMatch || ageRangeMatch || authorMatch;
    });

    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        setTimeout(() => {
            setData(MOCK_RECIPES_DATA); 
            setIsLoading(false);
        }, 500);
    }, []);

    const handleItemsPerPageChange = (newSize: number) => { 
        setItemsPerPage(newSize);
        setCurrentPage(1);
    };

    const handleConfirmDelete = () => {
        if (!modalState.data) return; 
        const itemToDelete = modalState.data;

        setData((prevData) =>
            prevData.filter((f) => f.id !== itemToDelete.id)
        );

        toast.success(
            (t_success) => ( 
                <div className="flex items-center justify-center gap-2 w-full"> 
                    <span>{`ลบข้อมูล "${itemToDelete.name}" สำเร็จ!`}</span>
                </div>
            ),
            { 
                duration: 2000, 
                position: "top-right", 
            }
        );

        setModalState({ type: null, data: null });
    };

    const handleDeleteClick = (itemId: number) => { 
        const item = data.find(d => d.id === itemId); 
        if (!item) { 
            console.error("Item to delete not found:", itemId); 
            toast.error("ไม่พบข้อมูลที่ต้องการลบ", { duration: 2000 });
            return; 
        }
        setModalState({ type: 'delete', data: item });
    };

    const handleSearch = (term: string) => { 
        setSearchTerm(term);
        setCurrentPage(1); 
    };

    const handleCreateRecipe = (formData: NewRecipeFormData) => { 
        const isCommonDataValid = 
            formData.recipeName?.trim() && 
            formData.details?.trim() && 
            formData.recommendations?.trim();

        let isAgeDataValid = false;
        if (formData.ageType === 'range') {
            isAgeDataValid = !!(formData.ageStart && formData.ageEnd);
        } else if (formData.ageType === 'specific') {
            isAgeDataValid = !!formData.ageSpecific;
        }

        if (!isCommonDataValid || !isAgeDataValid) {
            toast.error("กรุณากรอกข้อมูลให้ครบถ้วน", { 
                duration: 2000, 
                position: "top-right" 
            });
            return;
        }

        let displayAgeRange = '';
        if (formData.ageType === 'range') {
            const start = formData.ageStart || '...'; 
            const end = formData.ageEnd || '...'; 
            displayAgeRange = `อายุ ${start}-${end} วัน`; 
        } else if (formData.ageType === 'specific') {
            displayAgeRange = `อายุ ${formData.ageSpecific || '...'} วันขึ้นไป`;
        }
        const now = new Date();
        const createdAtTimestamp = `${now.toLocaleDateString('en-GB')} - ${now.toLocaleTimeString('th-TH', { hour12: false })}`;
        
        setData((prevData) => {
            const maxId = prevData.length > 0 
                ? Math.max(...prevData.map(item => item.id))
                : 0; 
            const newRecipe: Recipe = { 
                id: maxId + 1, 
                name: formData.recipeName,
                ageRange: displayAgeRange, 
                ageType: formData.ageType,
                ageStart: formData.ageStart,
                ageEnd: formData.ageEnd,
                ageSpecific: formData.ageSpecific,
                details: formData.details,
                recommendations: formData.recommendations,
                author: 'Admin', 
                createdAt: createdAtTimestamp,
                updatedAt: createdAtTimestamp, 
            };
            return [newRecipe, ...prevData];
        });

        setModalState({ type: null, data: null });
        toast.success("สร้างสูตรอาหารสำเร็จ!", { duration: 2000, position: "top-right" });
    };

    const handleAddClick = () => {
        setModalState({ type: 'create', data: null });
    };

    const handleUpdateRecipe = (updatedData: any) => { 
        const originalItem = data.find(item => item.id === updatedData.id);

        if (!originalItem) return;

        const isUnchanged = 
            originalItem.name === updatedData.name &&
            originalItem.details === updatedData.details &&
            originalItem.recommendations === updatedData.recommendations &&
            originalItem.ageType === updatedData.ageType &&
            (originalItem.ageStart || null) === (updatedData.ageStart || null) &&
            (originalItem.ageEnd || null) === (updatedData.ageEnd || null) &&
            (originalItem.ageSpecific || null) === (updatedData.ageSpecific || null);

        if (isUnchanged) {
            toast.error("ยังไม่ได้มีการแก้ไขข้อมูล", {
                duration: 2000,
                position: "top-right",
            });
            return; 
        }

        console.log("Updated recipe data:", updatedData);
        
        let displayAgeRange = '';
        if (updatedData.ageType === 'range') {
            const start = updatedData.ageStart || '...';
            const end = updatedData.ageEnd || '...';
            displayAgeRange = `อายุ ${start}-${end} วัน`;
        } else if (updatedData.ageType === 'specific') {
            displayAgeRange = `อายุ ${updatedData.ageSpecific || '...'} วันขึ้นไป`;
        }

        const now = new Date();
        const updatedAtTimestamp = `${now.toLocaleDateString('en-GB')} - ${now.toLocaleTimeString('th-TH', { hour12: false })}`;

        setData((prevData) =>
            prevData.map((item) => {
                if (item.id !== updatedData.id) {
                    return item;
                }
                return {
                    ...item, 
                    ...updatedData, 
                    ageRange: displayAgeRange, 
                    updatedAt: updatedAtTimestamp, 
                } as Recipe; 
            })
        );

        setModalState({ type: null, data: null });
        toast.success("แก้ไขสูตรอาหารสำเร็จ!", { duration: 2000, position: "top-right" });
    };

    const handleEditClick = (itemId: number) => { 
        const itemToEdit = data.find(item => item.id === itemId); 
        if (!itemToEdit) {
            console.error("Item to edit not found:", itemId);
            toast.error("ไม่พบข้อมูลที่ต้องการแก้ไข", { duration: 2000 });
            return;
        }
        
        setModalState({ type: 'edit', data: itemToEdit });
    };

    const handleViewClick = (itemId: number) => { 
        const itemToView = data.find(item => item.id === itemId); 
        if (!itemToView) {
            console.error("Item to view not found:", itemId);
            toast.error("ไม่พบข้อมูลที่ต้องการดู", { duration: 2000 });
            return;
        }
        
        setModalState({ type: 'view', data: itemToView });
    };


    const renderModal = () => {
        const itemData = modalState.data as Recipe; 
        
        const isContentModal = modalState.type && modalState.type !== 'delete';

        let modalContent = null;
        
        switch (modalState.type) {
            case 'delete':
                return itemData && (
                    <DeleteConfirm 
                        isOpen={true}
                        onClose={() => setModalState({ type: null, data: null })}
                        onConfirm={handleConfirmDelete}
                        title="ลบข้อมูลสูตรอาหาร"
                        itemName={itemData.name}
                    />
                );
            case 'create':
                modalContent = (
                    <CreateRecipe 
                        onClose={() => setModalState({ type: null, data: null })}
                        onCreate={handleCreateRecipe}
                    />
                );
                break;
            case 'edit':
                modalContent = itemData && (
                    <EditRecipe
                        onClose={() => setModalState({ type: null, data: null })}
                        initialData={itemData} 
                        onUpdate={handleUpdateRecipe}
                    />
                );
                break;
            case 'view':
                modalContent = itemData && (
                    <ViewRecipe
                        onClose={() => setModalState({ type: null, data: null })}
                        initialData={itemData} 
                    />
                );
                break;
            default:
                return null;
        }

        if (isContentModal && modalContent) {
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
                <h1 className="text-xl ms-2">สูตรอาหาร</h1>
                <div className="flex items-center space-x-3 text-sm">
                    <span className="text-xl me-2">Admin</span>
                </div>
            </header>
            
            <div className="p-6">
                
                <RecipesToolbar 
                    totalItems={totalItems} 
                    onSearch={handleSearch}
                    onAddClick={handleAddClick}
                />
                
                <div className="mt-6 bg-white rounded-lg shadow-md">
                    {isLoading ? (
                        <div className="p-6 text-center">Loading...</div>
                    ) : (
                        <RecipesTable
                            data={paginatedData} 
                            onView={handleViewClick} 
                            onEdit={handleEditClick}    
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

export default RecipesPage;