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

export interface Recipe {
    id: string; 
    name: string;
    farmType?: string; 
    primaryFarmType?: string; 
    ageRange: string; 
    ageUnit?: string; 
    targetStage: string;
    ingredients: string; 
    instruction: string;
    description?: string;  
    recommendations: string;
    author: string; 
    createdAt: string;
    updatedAt: string;
}

interface ModalState {
    type: 'create' | 'edit' | 'view' | 'delete' | null;
    data: Recipe | null;
}

const normalizeFarmType = (value: any): string | undefined => {
    if (!value) return undefined;
    const upper = String(value).toUpperCase();
    if (upper === 'NURSERY_SMALL') return 'SMALL';
    if (upper === 'NURSERY_LARGE') return 'LARGE';
    if (upper === 'GROWOUT') return 'MARKET';
    return upper;
};

const mapFeedFormulaToRecipe = (formula: FeedFormula): Recipe => {
    const rawFarmType = (formula as any).primaryFarmType || (formula as any).farmType;
    const farmType = normalizeFarmType(rawFarmType);
    
    const targetStageStr = formula.targetStage || ''; 

    const pickNumericRange = (value?: string | null) => {
        if (!value) return '';
        const match = value.match(/(\d+)\s*[-–]\s*(\d+)/);
        if (match) return `${match[1]}-${match[2]}`;
        const single = value.match(/(\d+)/g);
        if (single && single.length === 2) return `${single[0]}-${single[1]}`;
        if (single && single.length === 1) return `${single[0]}-${single[0]}`;
        return value;
    };

    const ageRange = pickNumericRange(targetStageStr);

    let detectedUnit = '';
    if (targetStageStr.includes('วัน') || targetStageStr.toLowerCase().includes('day')) {
        detectedUnit = 'DAY';
    } else if (targetStageStr.includes('เดือน') || targetStageStr.toLowerCase().includes('month')) {
        detectedUnit = 'MONTH';
    } 

    if (!detectedUnit) {
        if (farmType === 'SMALL') {
            detectedUnit = 'DAY';
        } else if (farmType === 'LARGE' || farmType === 'MARKET') {
            detectedUnit = 'MONTH';
        }
    }

    return {
        id: formula.id,
        name: formula.name,
        farmType,
        primaryFarmType: (formula as any).primaryFarmType,
        ageRange,
        ageUnit: detectedUnit, 
        targetStage: targetStageStr, 
        ingredients: formula.ingredients || '',
        instruction: formula.instruction || '',
        description: (formula as any).description,
        
        recommendations: formula.recommendations,
        author: 'Admin', 
        createdAt: new Date(formula.createdAt).toLocaleString('th-TH'),
        updatedAt: new Date(formula.updatedAt).toLocaleString('th-TH'),
    };
}; 


function RecipesPage() { 
    const [data, setData] = useState<Recipe[]>([]); 
    const [isLoading, setIsLoading] = useState<boolean>(true); 
    const [currentPage, setCurrentPage] = useState<number>(1); 
    
    const [searchTerm, setSearchTerm] = useState<string>(''); 
    const [filterType, setFilterType] = useState<string>(''); 

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


    const fetchFeedFormulas = async () => {
        try {
            setIsLoading(true);
            const response = await feedFormulasAPI.list({
                page: 1,
                limit: 100, 
            });

            const recipes = response.data.map(mapFeedFormulaToRecipe);
            setData(recipes);
        } catch (error) {
            console.error('Failed to fetch feed formulas:', error);
            if (error instanceof APIError) {
                toast.error(error.message || 'ไม่สามารถโหลดข้อมูลได้', { duration: 3000 });
            } else {
                toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล', { duration: 3000 });
            }
            setData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedFormulas();
    }, []); 

    const filteredData = data.filter((item: Recipe) => { 
        const lowerSearchTerm = searchTerm.toLowerCase();
        const nameMatch = item.name && item.name.toLowerCase().includes(lowerSearchTerm);
        const ageRangeMatch = item.ageRange && item.ageRange.toLowerCase().includes(lowerSearchTerm);
        const authorMatch = item.author && item.author.toLowerCase().includes(lowerSearchTerm);
        const isSearchMatch = !searchTerm || nameMatch || ageRangeMatch || authorMatch;

        const itemType = item.farmType || ''; 
        const isTypeMatch = !filterType || itemType === filterType;

        return isSearchMatch && isTypeMatch;
    });

    const displayTotalItems = filteredData.length;
    const displayTotalPages = Math.ceil(displayTotalItems / itemsPerPage) || 1;

    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleItemsPerPageChange = (newSize: number) => { 
        setItemsPerPage(newSize);
        setCurrentPage(1);
    };

    const handleConfirmDelete = async () => {
        if (!modalState.data) return; 
        const itemToDelete = modalState.data;

        try {
            await feedFormulasAPI.delete(itemToDelete.id);
            toast.success(`ลบสูตรอาหาร "${itemToDelete.name}" สำเร็จ!`, { duration: 2000, position: "top-right" });
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
            toast.error("ไม่พบข้อมูลที่ต้องการลบ", { duration: 2000 });
            return; 
        }
        setModalState({ type: 'delete', data: item });
    };

    const handleSearch = (term: string) => { 
        setSearchTerm(term);
        setCurrentPage(1); 
    };

    const handleFilterChange = (type: string) => {
        setFilterType(type);
        setCurrentPage(1);
    };

    const handleCreateRecipe = async (formData: NewRecipeFormData) => { 
        const isCommonDataValid =
            formData.recipeName?.trim() &&
            formData.farmType &&
            formData.ingredients?.trim() && 
            formData.instruction?.trim() && 
            formData.recommendations?.trim();

        const hasAgeFrom = formData.ageFrom !== undefined && formData.ageFrom !== '';
        const hasAgeTo = formData.ageTo !== undefined && formData.ageTo !== '';
        const isAgeDataValid = hasAgeFrom && hasAgeTo;

        if (!isCommonDataValid || !isAgeDataValid) {
            toast.error("กรุณากรอกข้อมูลให้ครบถ้วน", { 
                duration: 2000, 
                position: "top-right" 
            });
            return;
        }

        const unitLabel = formData.ageUnit === 'month' ? 'เดือน' : 'วัน'; 
        
        const targetStage = `${formData.ageFrom}-${formData.ageTo} ${unitLabel}`;

        const apiFarmType = formData.farmType;

        try {
            await feedFormulasAPI.create({
                name: formData.recipeName,
                targetStage: targetStage, 
                ingredients: formData.ingredients,
                instruction: formData.instruction,
                recommendations: formData.recommendations,
                farmType: apiFarmType,
            }); 

            toast.success("สร้างสูตรอาหารสำเร็จ!", { duration: 2000, position: "top-right" });
            
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
        const originalItem = data.find(item => item.id === updatedData.id);
        if (!originalItem) return;

        const isCommonDataValid =
            updatedData.recipeName?.trim() &&
            updatedData.farmType &&
            updatedData.ingredients?.trim() &&
            updatedData.instruction?.trim() && 
            updatedData.recommendations?.trim();

        const hasAgeFrom = updatedData.ageFrom !== undefined && updatedData.ageFrom !== '';
        const hasAgeTo = updatedData.ageTo !== undefined && updatedData.ageTo !== '';
        const isAgeDataValid = hasAgeFrom && hasAgeTo;

        if (!isCommonDataValid || !isAgeDataValid) {
            toast.error("กรุณากรอกข้อมูลให้ครบถ้วน", { 
                duration: 2000, 
                position: "top-right" 
            });
            return;
        }

        const unitLabel = updatedData.ageUnit === 'month' ? 'เดือน' : 'วัน';
        const targetStage = `${updatedData.ageFrom}-${updatedData.ageTo} ${unitLabel}`;

        const apiFarmType = updatedData.farmType;
        const currentMappedFarmType = normalizeFarmType(originalItem.primaryFarmType || originalItem.farmType);

        const isUnchanged = 
            originalItem.name === updatedData.recipeName &&
            (currentMappedFarmType === updatedData.farmType || originalItem.farmType === updatedData.farmType) &&
            originalItem.ingredients === updatedData.ingredients && 
            originalItem.instruction === updatedData.instruction &&
            originalItem.recommendations === updatedData.recommendations &&
            originalItem.targetStage === targetStage; 

        if (isUnchanged) {
            toast.error("ยังไม่ได้มีการแก้ไขข้อมูล", {
                duration: 2000,
                position: "top-right",
            });
            return; 
        }

        try {
            await feedFormulasAPI.update(updatedData.id, {
                name: updatedData.recipeName,
                targetStage: targetStage, 
                ingredients: updatedData.ingredients,
                instruction: updatedData.instruction,
                recommendations: updatedData.recommendations,
                farmType: apiFarmType,
            });

            toast.success("แก้ไขสูตรอาหารสำเร็จ!", { duration: 2000, position: "top-right" });
            
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
            toast.error("ไม่พบข้อมูลที่ต้องการแก้ไข", { duration: 2000 });
            return;
        }
        setModalState({ type: 'edit', data: itemToEdit });
    };

    const handleViewClick = (itemId: string) => { 
        const itemToView = data.find(item => item.id === itemId); 
        if (!itemToView) {
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
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-[rgba(0,0,0,0.5)]">
                    {modalContent}
                </div>
            );
        }
        return null;
    };


    return (
        <div className="min-h-screen bg-gray-50"> 
            <header className={`h-16 flex justify-between items-center px-5 text-white mb-2 bg-[#034A30] sticky top-0 z-20 shadow-md pl-16 lg:pl-5`}>
                <h1 className="text-xl ms-2">สูตรอาหาร</h1>
                <div className="flex items-center space-x-3 text-sm">
                    <span className="text-xl me-2">Admin</span>
                </div>
            </header>
            
            <div className="p-6">
                <RecipesToolbar 
                    totalItems={displayTotalItems} 
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
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