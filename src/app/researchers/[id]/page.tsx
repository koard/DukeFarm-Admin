'use client';

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation"; 
import toast from "react-hot-toast";

import ResearcherHistoryToolbar from "../../../components/researchers/ResearcherHistoryToolbar";
import ResearcherHistoryTable, { HistoryData } from "../../../components/researchers/ResearcherHistoryTable";

import Pagination from "../../../components/common/Pagination";
import DeleteConfirm from "../../../components/common/DeleteConfirm";

const MOCK_HISTORY_DATA_ALL: HistoryData[] = [
    { id: 1, date: "20/12/2025 - 06:00", farm: "ปทุม มาดี", groupType: "กลุ่มอนุบาลขนาดใหญ่" },
    { id: 2, date: "10/12/2025 - 06:00", farm: "ฟาร์มป้าแมว", groupType: "กลุ่มอนุบาลขนาดใหญ่" },
    { id: 3, date: "30/11/2025 - 06:00", farm: "ฟาร์มคุณจิน", groupType: "กลุ่มอนุบาลขนาดใหญ่" },
    { id: 4, date: "20/11/2025 - 06:00", farm: "ฟาร์มป้าแมว", groupType: "กลุ่มอนุบาลขนาดใหญ่" },
    { id: 5, date: "10/11/2025 - 06:00", farm: "ฟาร์มลุงพล", groupType: "กลุ่มผู้เลี้ยงขนาดตลาด" },
    { id: 6, date: "01/11/2025 - 06:00", farm: "ฟาร์มลุงพล", groupType: "กลุ่มผู้เลี้ยงขนาดตลาด" },
    { id: 7, date: "30/10/2025 - 06:00", farm: "ฟาร์มคุณจิน", groupType: "กลุ่มผู้เลี้ยงขนาดตลาด" },
    { id: 8, date: "20/10/2025 - 06:00", farm: "ฟาร์มคุณจิน", groupType: "กลุ่มผู้เลี้ยงขนาดตลาด" },
    { id: 9, date: "10/10/2025 - 06:00", farm: "ฟาร์มลุงพล", groupType: "กลุ่มผู้เลี้ยงขนาดตลาด" },
    { id: 10, date: "01/10/2025 - 06:00", farm: "ฟาร์มคุณจิน", groupType: "กลุ่มผู้เลี้ยงขนาดตลาด" },
];

const parseDateForFilter = (dateStr: string) => {
    if (!dateStr) return null;
    const datePart = dateStr.split(' - ')[0]; 
    const parts = datePart.split('/'); 
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    return null;
};


export default function ResearcherDetailPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const id = params.id as string;
    const researcherName = searchParams.get('name') || "รายละเอียดนักวิจัย"; 

    const [rawData, setRawData] = useState<HistoryData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedGroupType, setSelectedGroupType] = useState('');

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<HistoryData | null>(null);

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            if (id === '1') {
                setRawData(MOCK_HISTORY_DATA_ALL);
            } else {
                setRawData([]);
            }
            setIsLoading(false);
        }, 500);
    }, [id]);

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

    const filteredData = rawData.filter(item => {
        const lowerTerm = searchTerm.toLowerCase();

        const nameMatch = item.farm.toLowerCase().includes(lowerTerm);
        const groupMatch = selectedGroupType ? item.groupType === selectedGroupType : true;
        
        const itemDate = parseDateForFilter(item.date);
        const dateMatch = selectedDate ? itemDate === selectedDate : true;

        return nameMatch && groupMatch && dateMatch;
    });

    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage, 
        currentPage * itemsPerPage
    );

    const handleDeleteClick = (item: HistoryData) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!itemToDelete) return;
        
        setRawData(prev => prev.filter(i => i.id !== itemToDelete.id));
        
        toast.success(
            <span>{`ลบข้อมูลประวัติของ "${itemToDelete.farm}" สำเร็จ!`}</span>,
            { duration: 2000, position: "top-right" }
        );
        
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
    };

    const handleItemsPerPageChange = useCallback((newSize: number) => {
        setItemsPerPage(newSize);
        setCurrentPage(1);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="h-16 flex items-center px-5 text-white mb-2 bg-[#034A30] sticky top-0 z-20 shadow-md pl-35 lg:pl-5">
                
                <button 
                    onClick={() => router.push(`/researchers`)} 
                    className="flex items-center gap-2 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors -ml-23 lg:ml-0"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-xl font-medium">{researcherName}</span>
                </button>
                
                <div className="flex-1 flex justify-end items-center space-x-3 text-sm pr-5">
                    <span className="text-xl me-2">Admin</span>
                </div>
            </header>

            <div className="p-6">
                <ResearcherHistoryToolbar 
                    count={totalItems} 
                    onSearchChange={(term) => { setSearchTerm(term); setCurrentPage(1); }}
                    onDateChange={(date) => { setSelectedDate(date); setCurrentPage(1); }}
                    onGroupTypeChange={(group) => { setSelectedGroupType(group); setCurrentPage(1); }}
                />

                <div className="mt-4 bg-white rounded-lg shadow-md">
                    {isLoading ? (
                        <div className="p-10 text-center text-gray-500">กำลังโหลดข้อมูล...</div>
                    ) : (
                        <ResearcherHistoryTable 
                            data={paginatedData} 
                            startIndex={(currentPage - 1) * itemsPerPage}
                            onDeleteClick={handleDeleteClick} 
                        />
                    )}
                </div>

                {totalItems > 0 && (
                    <div className="mt-4">
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                            onItemsPerPageChange={handleItemsPerPageChange}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>

            <DeleteConfirm 
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setItemToDelete(null); }}
                onConfirm={handleConfirmDelete}
                title="ลบรายการ"
                itemName={itemToDelete?.farm}
            />
        </div>
    );
}