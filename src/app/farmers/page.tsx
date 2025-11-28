'use client';

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

import FarmerToolbar from "../../components/farmers/FarmerToolbar";
import FarmerTable from "../../components/farmers/FarmerTable"; 

import Pagination from "../../components/common/Pagination";
import DeleteConfirm from "../../components/common/DeleteConfirm"; 

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

export const MOCK_FARMERS: Farmer[] = [
    { id: 1, name: "อรพินธ์ นาดี", phone: "0812232343", groupType: "กลุ่มอนุบาลขนาดเล็ก", pondType: "บ่อดิน", pondCount: 6, location: "145690.903764", registeredDate: "12/12/2025 - 15:23:00" },
    { id: 2, name: "สมปอง มองการไกล", phone: "0812232343", groupType: "กลุ่มอนุบาลขนาดเล็ก", pondType: "บ่อดิน", pondCount: 7, location: "145690.903764", registeredDate: "12/12/2025 - 15:23:00" },
    { id: 3, name: "สมหมาย มีดี", phone: "0812232343", groupType: "กลุ่มอนุบาลขนาดใหญ่", pondType: "บ่อดิน", pondCount: 4, location: "145690.903764", registeredDate: "12/12/2025 - 15:23:00" },
    { id: 4, name: "มานี มีสุข", phone: "0812232343", groupType: "กลุ่มอนุบาลขนาดใหญ่", pondType: "บ่อปูน", pondCount: 12, location: "145690.903764", registeredDate: "12/12/2025 - 15:23:00" },
    { id: 5, name: "แก้วตา นาวา", phone: "0812232343", groupType: "กลุ่มผู้เลี้ยงขนาดตลาด", pondType: "บ่อดิน", pondCount: 10, location: "145690.903764", registeredDate: "12/12/2025 - 15:23:00" },
    { id: 6, name: "นภัทร ชื่นชม", phone: "0812232343", groupType: "กลุ่มผู้เลี้ยงขนาดตลาด", pondType: "บ่อปูน", pondCount: 8, location: "145690.903764", registeredDate: "12/12/2025 - 15:23:00" },
    { id: 7, name: "วิทยา สุดสวย", phone: "0812232343", groupType: "กลุ่มอนุบาลขนาดเล็ก", pondType: "บ่อปูน", pondCount: 9, location: "145690.903764", registeredDate: "12/12/2025 - 15:23:00" },
    { id: 8, name: "ปานเทพ รัศมี", phone: "0812232343", groupType: "กลุ่มอนุบาลขนาดใหญ่", pondType: "บ่อดิน", pondCount: 8, location: "145690.903764", registeredDate: "12/12/2025 - 15:23:00" },
    { id: 9, name: "ธนัช จิตใคร่", phone: "0812232343", groupType: "กลุ่มผู้เลี้ยงขนาดตลาด", pondType: "บ่อปูน", pondCount: 9, location: "145690.903764", registeredDate: "12/12/2025 - 15:23:00" },
    { id: 10, name: "ธีรศ ยาหมาย", phone: "0812232343", groupType: "กลุ่มอนุบาลขนาดเล็ก", pondType: "บ่อปูน", pondCount: 11, location: "145690.903764", registeredDate: "12/12/2025 - 15:23:00" },
    { id: 11, name: "เกษตรกร 11", phone: "0811111111", groupType: "กลุ่มผู้เลี้ยงขนาดตลาด", pondType: "บ่อดิน", pondCount: 5, location: "145690.903764", registeredDate: "13/12/2025 - 10:00:00" },
];

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
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPondType, setSelectedPondType] = useState('');
    const [selectedDate, setSelectedDate] = useState(''); 
    const [selectedGroupType, setSelectedGroupType] = useState('');

    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [farmerToDelete, setFarmerToDelete] = useState<Farmer | null>(null); 

    useEffect(() => {
        setTimeout(() => {
            setFarmers(MOCK_FARMERS); 
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

    const filteredFarmers = farmers.filter(farmer => { 
        const nameMatch = farmer.name && farmer.name.toLowerCase().includes(searchTerm.toLowerCase());
        const phoneMatch = farmer.phone && farmer.phone.includes(searchTerm);
        const typeMatch = selectedPondType ? farmer.pondType === selectedPondType : true; 
        const farmerRegisteredDate = parseDateString(farmer.registeredDate);
        const dateMatch = selectedDate ? farmerRegisteredDate === selectedDate : true; 
        const groupMatch = selectedGroupType ? farmer.groupType === selectedGroupType : true;

        return (nameMatch || phoneMatch) && typeMatch && dateMatch && groupMatch; 
    });

    const totalItems = filteredFarmers.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const paginatedFarmers = filteredFarmers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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