'use client';

import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

import FarmerToolbar from "../../components/farmers/FarmerToolbar";
import FarmerTable, { type Farmer as FarmerTableRow } from "../../components/farmers/FarmerTable"; 

import Pagination from "../../components/common/Pagination";
import DeleteConfirm from "../../components/common/DeleteConfirm"; 
import { farmersAPI, type Farmer as FarmerApiResponse } from "@/services/api/farmers";
import { APIError, type PaginationMeta } from "@/services/api/types";

const FARM_TYPE_LABELS: Record<string, string> = {
    NURSERY_SMALL: "กลุ่มอนุบาลขนาดเล็ก",
    NURSERY_LARGE: "กลุ่มอนุบาลขนาดใหญ่",
    GROWOUT: "กลุ่มผู้เลี้ยงขนาดตลาด",
};

const formatRegisteredDate = (isoString: string | null | undefined) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "-";
    const datePart = date.toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
    const timePart = date.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
    });
    return `${datePart} - ${timePart}`;
};

const formatCoordinates = (latitude?: number | null, longitude?: number | null) => {
    if (typeof latitude !== "number" || typeof longitude !== "number") {
        return "-";
    }
    return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
};

const mapFarmerResponse = (farmer: FarmerApiResponse): Farmer => ({
    id: `farmer-${farmer.no}`,
    rowNumber: farmer.no,
    name: farmer.fullName || "-",
    phone: farmer.phone || "-",
    groupType: FARM_TYPE_LABELS[farmer.farmType] || farmer.farmType,
    pondType: "ไม่ระบุ",
    pondCount: typeof farmer.pondCount === "number" ? farmer.pondCount : null,
    location: formatCoordinates(farmer.latitude, farmer.longitude),
    registeredDate: formatRegisteredDate(farmer.registeredAt),
    farmTypeCode: farmer.farmType,
    registeredAtISO: farmer.registeredAt,
});

type Farmer = FarmerTableRow & {
    farmTypeCode?: 'NURSERY_SMALL' | 'NURSERY_LARGE' | 'GROWOUT';
    registeredAtISO?: string;
};

const Farmers = () => {
    const [farmers, setFarmers] = useState<Farmer[]>([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPondType, setSelectedPondType] = useState('');
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

    const fetchFarmers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await farmersAPI.list({ page: currentPage, limit: itemsPerPage });
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
        searchTerm.trim() || selectedPondType || selectedDate || selectedGroupType
    );

    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filteredFarmers = farmers.filter(farmer => { 
        const nameMatch = normalizedSearch ? farmer.name?.toLowerCase().includes(normalizedSearch) : true;
        const phoneMatch = normalizedSearch ? farmer.phone?.includes(searchTerm.trim()) : true;
        const typeMatch = selectedPondType ? farmer.pondType === selectedPondType : true; 
        const dateMatch = selectedDate ? farmer.registeredAtISO?.startsWith(selectedDate) : true; 
        const groupMatch = selectedGroupType ? farmer.groupType === selectedGroupType : true;

        return (nameMatch || phoneMatch) && typeMatch && dateMatch && groupMatch; 
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

    const handleConfirmDelete = () => {
        if (!farmerToDelete) return;

        setFarmers((prevFarmers) =>
            prevFarmers.filter((f) => f.id !== farmerToDelete.id)
        );

        toast.success(
            (t_success) => ( 
                <div className="flex items-center justify-center gap-2 w-full"> 
                    <span>{`ลบข้อมูล "${farmerToDelete.name}" สำเร็จ!`}</span>
                </div>
            ),
            { duration: 2000, position: "top-right" }
        );

        setIsDeleteModalOpen(false);
        setFarmerToDelete(null);
    };

    const handleDeleteClick = (farmer: Farmer) => {
        setFarmerToDelete(farmer);
        setIsDeleteModalOpen(true);
    };

    const handleSearchChange = (term: string) => { setSearchTerm(term); setCurrentPage(1); };
    const handleDateChange = (date: string) => { setSelectedDate(date); setCurrentPage(1); };
    const handleTypeChange = (type: string) => { setSelectedPondType(type); setCurrentPage(1); };
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
                    onTypeChange={handleTypeChange}
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
                onClose={() => { setIsDeleteModalOpen(false); setFarmerToDelete(null); }}
                onConfirm={handleConfirmDelete}
                title="ลบข้อมูลเกษตรกร"
                itemName={farmerToDelete?.name} 
            />
        </div>
    );
}

export default Farmers;