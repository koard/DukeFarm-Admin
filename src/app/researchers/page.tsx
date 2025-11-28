'use client';

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { researchersAPI, Researcher as APIResearcher } from "@/services/api/researchers";

import ResearcherToolbar from "../../components/researchers/ResearcherToolbar";
import ResearcherTable, { Researcher } from "../../components/researchers/ResearcherTable"; 

import Pagination from "../../components/common/Pagination";
import DeleteConfirm from "../../components/common/DeleteConfirm";

// Convert API researcher to local researcher format
const convertAPIResearcher = (apiResearcher: APIResearcher): Researcher => ({
    id: apiResearcher.no,
    name: apiResearcher.fullName,
    phone: apiResearcher.phone,
    position: apiResearcher.department || 'นักวิจัย',
    affiliation: apiResearcher.organization,
    registeredDate: new Date(apiResearcher.registeredAt).toLocaleString('th-TH', {
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

const Researchers = () => {
    const [researchers, setResearchers] = useState<Researcher[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Researcher | null>(null);

    // Fetch researchers from API
    const fetchResearchers = async () => {
        setIsLoading(true);
        try {
            const response = await researchersAPI.list({
                page: currentPage,
                limit: itemsPerPage,
            });

            const convertedResearchers = response.data.map(convertAPIResearcher);
            setResearchers(convertedResearchers);
            setTotalPages(response.pagination.totalPages);
            setTotalItems(response.pagination.totalItems);
        } catch (error: any) {
            console.error('Failed to fetch researchers:', error);
            toast.error(error?.message || 'ไม่สามารถโหลดข้อมูลนักวิจัยได้', { duration: 3000 });
            setResearchers([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchResearchers();
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
    const filteredData = researchers.filter(item => {
        const lowerTerm = searchTerm.toLowerCase();

        const searchMatch = 
            (item.name && item.name.toLowerCase().includes(lowerTerm)) ||
            (item.phone && item.phone.includes(lowerTerm)) ||
            (item.position && item.position.toLowerCase().includes(lowerTerm)) ||
            (item.affiliation && item.affiliation.toLowerCase().includes(lowerTerm));
        
        const registeredDate = parseDateString(item.registeredDate);
        const dateMatch = selectedDate ? registeredDate === selectedDate : true;

        return searchMatch && dateMatch;
    });

    const displayedData = filteredData;

    const handleConfirmDelete = () => {
        if (!itemToDelete) return;
        
        // TODO: Implement API delete endpoint
        toast.error('ฟังก์ชันลบยังไม่พร้อมใช้งาน', { duration: 2000 });
        
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
    };

    const handleDeleteClick = (item: Researcher) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const handleSearchChange = (term: string) => { setSearchTerm(term); };
    const handleDateChange = (date: string) => { setSelectedDate(date); };
    const handleItemsPerPageChange = (newSize: number) => { setItemsPerPage(newSize); setCurrentPage(1); };
    const handlePageChange = (page: number) => { setCurrentPage(page); };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="h-16 flex justify-between items-center px-5 text-white mb-2 bg-[#034A30] sticky top-0 z-20 shadow-md pl-16 lg:pl-5">
                <h1 className="text-xl ms-2">ข้อมูลนักวิจัย</h1>
                <div className="flex items-center space-x-3 text-sm">
                    <span className="text-xl me-2">Admin</span>
                </div>
            </header>

            <div className="p-6">
                <ResearcherToolbar
                    count={filteredData.length}
                    onSearchChange={handleSearchChange}
                    onDateChange={handleDateChange}
                />

                <div className="mt-6 bg-white rounded-lg shadow-md">
                    {isLoading ? (
                        <div className="p-6 text-center">
                            <div className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-[#034A30]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="text-gray-600">กำลังโหลดข้อมูลนักวิจัย...</span>
                            </div>
                        </div>
                    ) : displayedData.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            ไม่พบข้อมูลนักวิจัย
                        </div>
                    ) : (
                        <ResearcherTable
                            data={displayedData}
                            startIndex={(currentPage - 1) * itemsPerPage}
                            onDeleteClick={handleDeleteClick}
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
                onClose={() => { setIsDeleteModalOpen(false); setItemToDelete(null); }}
                onConfirm={handleConfirmDelete}
                title="ลบข้อมูลนักวิจัย"
                itemName={itemToDelete?.name}
            />
        </div>
    );
}

export default Researchers;