'use client';

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

import ResearcherToolbar from "../../components/researchers/ResearcherToolbar";
import ResearcherTable, { Researcher } from "../../components/researchers/ResearcherTable"; 

import Pagination from "../../components/common/Pagination";
import DeleteConfirm from "../../components/common/DeleteConfirm";

const MOCK_RESEARCHERS: Researcher[] = [
    { id: 1, name: "ดนัย โคจร", phone: "0812232343", position: "นักวิจัย", affiliation: "มหาวิทยาลัยเกษตรศาสตร์", registeredDate: "12/12/2025 - 15:23:00" },
    { id: 2, name: "มีนา มากมาย", phone: "0812232343", position: "นักวิจัย", affiliation: "มหาวิทยาลัยเกษตรศาสตร์", registeredDate: "12/12/2025 - 15:23:00" },
    { id: 3, name: "มานี นิลยา", phone: "0812232343", position: "นักวิจัยคุณภาพน้ำ", affiliation: "มหาวิทยาลัยเกษตรศาสตร์", registeredDate: "12/12/2025 - 15:23:00" },
    { id: 4, name: "วิทยา สุขสบาย", phone: "0812232343", position: "นักวิจัยคุณภาพน้ำ", affiliation: "มหาวิทยาลัยจุฬาลงกรณ์", registeredDate: "12/12/2025 - 15:23:00" },
    { id: 5, name: "อรพันธ์ มาดี", phone: "0812232343", position: "นักวิจัยคุณภาพน้ำ", affiliation: "มหาวิทยาลัยจุฬาลงกรณ์", registeredDate: "12/12/2025 - 15:23:00" },
    { id: 6, name: "สมปอง มองการไกล", phone: "0812232343", position: "นักวิจัย", affiliation: "จุฬาฯ", registeredDate: "12/12/2025 - 15:23:00" },
    { id: 7, name: "สมหมาย มีดี", phone: "0812232343", position: "นักวิทยาศาสตร์", affiliation: "จุฬาฯ", registeredDate: "12/12/2025 - 15:23:00" },
    { id: 8, name: "แก้วตา นาวา", phone: "0812232343", position: "นักวิจัย", affiliation: "จุฬาฯ", registeredDate: "12/12/2025 - 15:23:00" },
    { id: 9, name: "นภัทร อิ่มเอม", phone: "0812232343", position: "นักวิทยาศาสตร์", affiliation: "เบทาโกร", registeredDate: "12/12/2025 - 15:23:00" },
    { id: 10, name: "ปานจันทร์ รัศมี", phone: "0812232343", position: "นักวิทยาศาสตร์", affiliation: "เบทาโกร", registeredDate: "12/12/2025 - 15:23:00" },
    { id: 11, name: "ปานจันทร์ กากา", phone: "0812232343", position: "นักวิทยาศาสตร์", affiliation: "เบทาโกร", registeredDate: "12/12/2025 - 15:23:00" },
];

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
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Researcher | null>(null);

    useEffect(() => {
        setTimeout(() => {
            setResearchers(MOCK_RESEARCHERS as Researcher[]); 
            setIsLoading(false);
        }, 500);
    }, []);

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

    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage, 
        currentPage * itemsPerPage
    );

    const handleConfirmDelete = () => {
        if (!itemToDelete) return;
        setResearchers(prev => prev.filter(f => f.id !== itemToDelete.id)); 
        
        toast.success(
            <span>{`ลบข้อมูล "${itemToDelete.name}" สำเร็จ!`}</span>,
            { duration: 2000, position: "top-right" }
        );
        
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
    };

    const handleDeleteClick = (item: Researcher) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const handleSearchChange = (term: string) => { setSearchTerm(term); setCurrentPage(1); };
    const handleDateChange = (date: string) => { setSelectedDate(date); setCurrentPage(1); };
    const handleItemsPerPageChange = (newSize: number) => { setItemsPerPage(newSize); setCurrentPage(1); };

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
                    count={totalItems}
                    onSearchChange={handleSearchChange}
                    onDateChange={handleDateChange}
                />

                <div className="mt-6 bg-white rounded-lg shadow-md">
                    {isLoading ? (
                        <div className="p-6 text-center">Loading...</div>
                    ) : (
                        <ResearcherTable
                            data={paginatedData}
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
                        onPageChange={(page) => setCurrentPage(page)}
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