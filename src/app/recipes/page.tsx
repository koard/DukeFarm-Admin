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

import { feedFormulasAPI, APIError, type FeedFormula } from '../../services/api'; 

// Recipe interface mapped from FeedFormula API
export interface Recipe {
    id: string;  // Changed from number to string (UUID from API)
    name: string;
    ageRange: string;  // Derived from targetStage
    targetStage: string;  // API field
    description: string;  // API field (was details)
    recommendations: string;
    author: string;  // Derived from createdBy or hardcoded
    createdAt: string;
    updatedAt: string;
}

interface ModalState {
    type: 'create' | 'edit' | 'view' | 'delete' | null;
    data: Recipe | null;
}

/**
 * Helper function to map API FeedFormula to Recipe
 */
const mapFeedFormulaToRecipe = (formula: FeedFormula): Recipe => {
    return {
        id: formula.id,
        name: formula.name,
        ageRange: formula.targetStage,
        targetStage: formula.targetStage,
        description: formula.description,
        recommendations: formula.recommendations,
        author: 'Admin', // API doesn't return author name, could be enhanced
        createdAt: new Date(formula.createdAt).toLocaleString('th-TH'),
        updatedAt: new Date(formula.updatedAt).toLocaleString('th-TH'),
    };
}; 


function RecipesPage() { 
    const [data, setData] = useState<Recipe[]>([]); 
    const [isLoading, setIsLoading] = useState<boolean>(true); 
    const [currentPage, setCurrentPage] = useState<number>(1); 
    const [searchTerm, setSearchTerm] = useState<string>(''); 
    const [itemsPerPage, setItemsPerPage] = useState<number>(10); 
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    
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

    /**
     * Fetch feed formulas from API
     */
    const fetchFeedFormulas = async () => {
        try {
            setIsLoading(true);
            const response = await feedFormulasAPI.list({
                page: currentPage,
                limit: itemsPerPage,
            });

            const recipes = response.data.map(mapFeedFormulaToRecipe);
            setData(recipes);
            setTotalItems(response.pagination.totalItems);
            setTotalPages(response.pagination.totalPages);
        } catch (error) {
            console.error('Failed to fetch feed formulas:', error);
            
            if (error instanceof APIError) {
                toast.error(error.message || 'ไม่สามารถโหลดข้อมูลได้', { duration: 3000 });
            } else {
                toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล', { duration: 3000 });
            }
            
            setData([]);
            setTotalItems(0);
            setTotalPages(0);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data on component mount and when pagination changes
    useEffect(() => {
        fetchFeedFormulas();
    }, [currentPage, itemsPerPage]);

    // Client-side filtering for search
    const filteredData = searchTerm
        ? data.filter((item: Recipe) => { 
            const lowerSearchTerm = searchTerm.toLowerCase();
            const nameMatch = item.name && item.name.toLowerCase().includes(lowerSearchTerm);
            const ageRangeMatch = item.ageRange && item.ageRange.toLowerCase().includes(lowerSearchTerm);
            const authorMatch = item.author && item.author.toLowerCase().includes(lowerSearchTerm);
            return nameMatch || ageRangeMatch || authorMatch;
        })
        : data;

    // Use filtered data for display
    const displayTotalItems = searchTerm ? filteredData.length : totalItems;
    const displayTotalPages = searchTerm ? Math.ceil(filteredData.length / itemsPerPage) : totalPages;
    const paginatedData = searchTerm
        ? filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        : filteredData;

    const handleItemsPerPageChange = (newSize: number) => { 
        setItemsPerPage(newSize);
        setCurrentPage(1);
    };

    const handleConfirmDelete = async () => {
        if (!modalState.data) return; 
        const itemToDelete = modalState.data;

        try {
            await feedFormulasAPI.delete(itemToDelete.id);

            toast.success(
                `ลบสูตรอาหาร "${itemToDelete.name}" สำเร็จ!`,
                { 
                    duration: 2000, 
                    position: "top-right", 
                }
            );

            // Refresh data after deletion
            await fetchFeedFormulas();
            setModalState({ type: null, data: null });
        } catch (error) {
            console.error('Delete error:', error);
            
            if (error instanceof APIError) {
                toast.error(error.message || 'ไม่สามารถลบข้อมูลได้', { duration: 3000 });
            } else {
                toast.error('เกิดข้อผิดพลาดในการลบข้อมูล', { duration: 3000 });
            }
        }
    };

    const handleDeleteClick = (itemId: string) => { 
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

    const handleCreateRecipe = async (formData: NewRecipeFormData) => { 
        let targetStage = '';
        if (formData.ageType === 'range') {
            const start = formData.ageStart || '...'; 
            const end = formData.ageEnd || '...'; 
            targetStage = `อายุ ${start}-${end} วัน`; 
        } else if (formData.ageType === 'specific') {
            targetStage = `อายุ ${formData.ageSpecific || '...'} วันขึ้นไป`;
        }

        try {
            await feedFormulasAPI.create({
                name: formData.recipeName,
                targetStage: targetStage,
                description: formData.details,
                recommendations: formData.recommendations,
            });

            toast.success("สร้างสูตรอาหารสำเร็จ!", { duration: 2000, position: "top-right" });
            
            // Refresh data and close modal
            await fetchFeedFormulas();
            setModalState({ type: null, data: null });
        } catch (error) {
            console.error('Create error:', error);
            
            if (error instanceof APIError) {
                if (error.status === 400 && error.errors) {
                    toast.error(error.errors.join(', '), { duration: 3000 });
                } else {
                    toast.error(error.message || 'ไม่สามารถสร้างข้อมูลได้', { duration: 3000 });
                }
            } else {
                toast.error('เกิดข้อผิดพลาดในการสร้างข้อมูล', { duration: 3000 });
            }
        }
    };

    const handleAddClick = () => {
        setModalState({ type: 'create', data: null });
    };

    const handleUpdateRecipe = async (updatedData: any) => { 
        console.log("Updated recipe data:", updatedData);
        
        let targetStage = '';
        if (updatedData.ageType === 'range') {
            const start = updatedData.ageStart || '...';
            const end = updatedData.ageEnd || '...';
            targetStage = `อายุ ${start}-${end} วัน`;
        } else if (updatedData.ageType === 'specific') {
            targetStage = `อายุ ${updatedData.ageSpecific || '...'} วันขึ้นไป`;
        }

        try {
            await feedFormulasAPI.update(updatedData.id, {
                name: updatedData.recipeName,
                targetStage: targetStage,
                description: updatedData.details,
                recommendations: updatedData.recommendations,
            });

            toast.success("แก้ไขสูตรอาหารสำเร็จ!", { duration: 2000, position: "top-right" });
            
            // Refresh data and close modal
            await fetchFeedFormulas();
            setModalState({ type: null, data: null });
        } catch (error) {
            console.error('Update error:', error);
            
            if (error instanceof APIError) {
                if (error.status === 400 && error.errors) {
                    toast.error(error.errors.join(', '), { duration: 3000 });
                } else {
                    toast.error(error.message || 'ไม่สามารถแก้ไขข้อมูลได้', { duration: 3000 });
                }
            } else {
                toast.error('เกิดข้อผิดพลาดในการแก้ไขข้อมูล', { duration: 3000 });
            }
        }
    };

    const handleEditClick = (itemId: string) => { 
        const itemToEdit = data.find(item => item.id === itemId); 
        if (!itemToEdit) {
            console.error("Item to edit not found:", itemId);
            toast.error("ไม่พบข้อมูลที่ต้องการแก้ไข", { duration: 2000 });
            return;
        }
        
        setModalState({ type: 'edit', data: itemToEdit });
    };

    const handleViewClick = (itemId: string) => { 
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
                    totalItems={displayTotalItems} 
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
                        totalPages={displayTotalPages} 
                        totalItems={displayTotalItems} 
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