'use client';

import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

import FarmerToolbar from "../../components/farmers/FarmerToolbar";
import FarmerTable from "../../components/farmers/FarmerTable"; 

import Pagination from "../../components/common/Pagination";
import DeleteConfirm from "../../components/common/DeleteConfirm"; 
import { farmersAPI } from "@/services/api/farmers";
import { APIError, type PaginationMeta } from "@/services/api/types";
import type { FarmerListItem } from "@/types/farmer";
import { mapFarmerResponse } from "@/utils/farmerMapper";

export type Farmer = FarmerListItem;

const Farmers = () => {
    const [farmers, setFarmers] = useState<Farmer[]>([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState(''); 
    const [selectedGroupType, setSelectedGroupType] = useState('');

    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
    });

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [farmerToDelete, setFarmerToDelete] = useState<Farmer | null>(null); 
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchFarmers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await farmersAPI.list({ page: currentPage, limit: itemsPerPage });

            if (
                response.pagination.totalPages > 0 &&
                currentPage > response.pagination.totalPages &&
                response.data.length === 0
            ) {
                setCurrentPage(response.pagination.totalPages);
                return;
            }

            if (response.pagination.totalPages === 0 && currentPage !== 1) {
                setCurrentPage(1);
                return;
            }

            setFarmers(response.data.map(mapFarmerResponse));
            setPaginationMeta(response.pagination);
        } catch (error) {
            const message = error instanceof APIError ? error.message : 'ไม่สามารถโหลดข้อมูลเกษตรกรได้';
            toast.error(message);
            setFarmers([]);
            setPaginationMeta((prev) => ({
                ...prev,
                totalItems: 0,
                totalPages: 1,
                currentPage: 1,
            }));
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, itemsPerPage]);

    useEffect(() => {
        fetchFarmers();
    }, [fetchFarmers]);

    useEffect(() => {
        if (isDeleteModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isDeleteModalOpen]); 

    const filtersActive = Boolean(
        searchTerm.trim() || selectedDate || selectedGroupType
    );

    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filteredFarmers = farmers.filter(farmer => { 
        const nameMatch = normalizedSearch ? farmer.name?.toLowerCase().includes(normalizedSearch) : true;
        const phoneMatch = normalizedSearch ? farmer.phone?.includes(searchTerm.trim()) : true;
        
        const dateMatch = selectedDate ? (() => {
            if (!farmer.registeredAtISO) return false;
            const d = new Date(farmer.registeredAtISO);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const localDateStr = `${year}-${month}-${day}`;
            return localDateStr === selectedDate;
        })() : true;
        
        let groupMatch = true;
        if (selectedGroupType) {
            if (Array.isArray((farmer as any).farmTypes)) {
                groupMatch = (farmer as any).farmTypes.includes(selectedGroupType);
            } 
            else if (farmer.groupType) {
                groupMatch = farmer.groupType === selectedGroupType;
            } else if ((farmer as any).farmType) {
                groupMatch = (farmer as any).farmType === selectedGroupType;
            } else {
                groupMatch = false; 
            }
        }

        return (nameMatch || phoneMatch) && dateMatch && groupMatch; 
    });

    const clientTotalItems = filteredFarmers.length;
    const clientTotalPages = Math.max(1, Math.ceil(clientTotalItems / itemsPerPage) || 1);

    const paginatedFarmers = filtersActive
        ? filteredFarmers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        : farmers;

    const totalItems = filtersActive ? clientTotalItems : paginationMeta.totalItems;
    const totalPages = filtersActive ? clientTotalPages : (paginationMeta.totalPages || 1);
    const tableStartIndex = filtersActive
        ? (currentPage - 1) * itemsPerPage
        : (paginationMeta.itemsPerPage || itemsPerPage) * ((paginationMeta.currentPage || 1) - 1);

    const handleConfirmDelete = async () => {
        if (!farmerToDelete) return;

        try {
            setIsDeleting(true);
            await farmersAPI.delete(farmerToDelete.id);

            toast.success(
                () => ( 
                    <div className="flex items-center justify-center gap-2 w-full"> 
                        <span>{`ลบข้อมูล "${farmerToDelete.name}" สำเร็จ!`}</span>
                    </div>
                ),
                { duration: 2000, position: "top-right" }
            );

            setIsDeleteModalOpen(false);
            setFarmerToDelete(null);
            await fetchFarmers();
        } catch (error) {
            const message = error instanceof APIError ? error.message : 'ไม่สามารถลบข้อมูลได้';
            toast.error(message);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteClick = (farmer: Farmer) => {
        setFarmerToDelete(farmer);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setFarmerToDelete(null);
        setIsDeleting(false);
    };

    const handleSearchChange = (term: string) => { setSearchTerm(term); setCurrentPage(1); };
    const handleDateChange = (date: string) => { setSelectedDate(date); setCurrentPage(1); };
    const handleGroupTypeChange = (group: string) => { setSelectedGroupType(group); setCurrentPage(1); };
    const handleItemsPerPageChange = (newSize: number) => { setItemsPerPage(newSize); setCurrentPage(1); };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className={`h-16 flex justify-between items-center px-5 text-white mb-2 bg-[#034A30] sticky top-0 z-20 shadow-md pl-16 lg:pl-5`}>
                <h1 className="text-xl ms-2">ข้อมูลเกษตรกร</h1>
                <div className="flex items-center space-x-3 text-sm">
                    <span className="text-xl me-2">Admin</span>
                </div>
            </header>
            
            <div className="p-6">
                <FarmerToolbar 
                    count={totalItems} 
                    onSearchChange={handleSearchChange} 
                    onDateChange={handleDateChange} 
                    onGroupTypeChange={handleGroupTypeChange}
                />
                
                <div className="mt-6 bg-white rounded-lg shadow-md">
                    {isLoading ? (
                        <div className="p-6 text-center">Loading...</div>
                    ) : (
                        <FarmerTable
                            farmersData={paginatedFarmers} 
                            onDeleteClick={handleDeleteClick}
                            startIndex={tableStartIndex}
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

            <DeleteConfirm 
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                title="ลบข้อมูลเกษตรกร"
                itemName={farmerToDelete?.name}
                isConfirming={isDeleting}
            />
        </div>
    );
}

export default Farmers;