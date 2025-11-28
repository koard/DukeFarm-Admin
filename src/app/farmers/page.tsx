'use client';

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { farmersAPI, Farmer as APIFarmer } from "@/services/api/farmers";

import FarmerToolbar from "../../components/farmers/FarmerToolbar";
import FarmerTable from "../../components/farmers/FarmerTable"; 

import Pagination from "../../components/common/Pagination";
import DeleteConfirm from "../../components/common/DeleteConfirm"; 

// Map API FarmType to Thai display text
const FARM_TYPE_MAP: Record<string, string> = {
    'NURSERY_SMALL': 'กลุ่มอนุบาลขนาดเล็ก',
    'NURSERY_LARGE': 'กลุ่มอนุบาลขนาดใหญ่',
    'GROWOUT': 'กลุ่มผู้เลี้ยงขนาดตลาด',
};

// Local Farmer type for UI (compatible with existing components)
export interface Farmer {
    id: number;
    name: string;
    phone: string;
    groupType: string;
    pondType: string;
    pondCount: number;
    location: string;
    registeredDate: string;
}

// Convert API farmer to local farmer format
const convertAPIFarmer = (apiFarmer: APIFarmer): Farmer => ({
    id: apiFarmer.no,
    name: apiFarmer.fullName,
    phone: apiFarmer.phone,
    groupType: FARM_TYPE_MAP[apiFarmer.farmType] || apiFarmer.farmType,
    pondType: 'บ่อดิน', // Default since API doesn't provide pond type
    pondCount: apiFarmer.pondCount,
    location: `${apiFarmer.latitude},${apiFarmer.longitude}`,
    registeredDate: new Date(apiFarmer.registeredAt).toLocaleString('th-TH', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).replace(/\//g, '/').replace(',', ' -'),
});

const parseDateString = (dateStr: string) => {
    if (!dateStr || !dateStr.includes('/')) return null;
    const parts = dateStr.split(' ')[0].split('/');
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    return null;
};

const Farmers = () => {
    const [farmers, setFarmers] = useState<Farmer[]>([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPondType, setSelectedPondType] = useState('');
    const [selectedDate, setSelectedDate] = useState(''); 
    const [selectedGroupType, setSelectedGroupType] = useState('');

    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [farmerToDelete, setFarmerToDelete] = useState<Farmer | null>(null);

    // Fetch farmers from API
    const fetchFarmers = async () => {
        setIsLoading(true);
        try {
            const response = await farmersAPI.list({
                page: currentPage,
                limit: itemsPerPage,
            });

            const convertedFarmers = response.data.map(convertAPIFarmer);
            setFarmers(convertedFarmers);
            setTotalPages(response.pagination.totalPages);
            setTotalItems(response.pagination.totalItems);
        } catch (error: any) {
            console.error('Failed to fetch farmers:', error);
            toast.error(error?.message || 'ไม่สามารถโหลดข้อมูลเกษตรกรได้', { duration: 3000 });
            setFarmers([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFarmers();
    }, [currentPage, itemsPerPage]);

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

    // Client-side filtering (API does server-side pagination)
    const filteredFarmers = farmers.filter(farmer => { 
        const nameMatch = farmer.name && farmer.name.toLowerCase().includes(searchTerm.toLowerCase());
        const phoneMatch = farmer.phone && farmer.phone.includes(searchTerm);
        const typeMatch = selectedPondType ? farmer.pondType === selectedPondType : true; 
        const farmerRegisteredDate = parseDateString(farmer.registeredDate);
        const dateMatch = selectedDate ? farmerRegisteredDate === selectedDate : true; 
        const groupMatch = selectedGroupType ? farmer.groupType === selectedGroupType : true;

        return (nameMatch || phoneMatch) && typeMatch && dateMatch && groupMatch; 
    });

    const displayedFarmers = filteredFarmers;

    const handleConfirmDelete = () => {
        if (!farmerToDelete) return;

        // TODO: Implement API delete endpoint
        toast.error('ฟังก์ชันลบยังไม่พร้อมใช้งาน', { duration: 2000 });
        
        setIsDeleteModalOpen(false);
        setFarmerToDelete(null);
    };

    const handleDeleteClick = (farmer: Farmer) => {
        setFarmerToDelete(farmer);
        setIsDeleteModalOpen(true);
    };

    const handleSearchChange = (term: string) => { setSearchTerm(term); };
    const handleDateChange = (date: string) => { setSelectedDate(date); };
    const handleTypeChange = (type: string) => { setSelectedPondType(type); };
    const handleGroupTypeChange = (group: string) => { setSelectedGroupType(group); };
    const handleItemsPerPageChange = (newSize: number) => { setItemsPerPage(newSize); setCurrentPage(1); };
    const handlePageChange = (page: number) => { setCurrentPage(page); };

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
                    count={filteredFarmers.length} 
                    onSearchChange={handleSearchChange} 
                    onDateChange={handleDateChange} 
                    onTypeChange={handleTypeChange}
                    onGroupTypeChange={handleGroupTypeChange}
                />
                
                <div className="mt-6 bg-white rounded-lg shadow-md">
                    {isLoading ? (
                        <div className="p-6 text-center">
                            <div className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-[#034A30]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="text-gray-600">กำลังโหลดข้อมูลเกษตรกร...</span>
                            </div>
                        </div>
                    ) : displayedFarmers.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            ไม่พบข้อมูลเกษตรกร
                        </div>
                    ) : (
                        <FarmerTable
                            farmersData={displayedFarmers} 
                            onDeleteClick={handleDeleteClick}
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
                        onPageChange={handlePageChange} 
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