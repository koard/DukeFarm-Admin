'use client';

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation"; 
import toast from "react-hot-toast";

import FarmerInfoCard from "../../../components/farmers/FarmerInfoCard";
import FarmerDashboard from "../../../components/farmers/FarmerDashboard"; 
import FarmerHistoryTable, { FarmerHistory } from "../../../components/farmers/FarmerHistoryTable";
import ViewFarmerHistory from "../../../components/farmers/ViewFarmerHistory";
import EditFarmerHistory from "../../../components/farmers/EditFarmerHistory";

import Pagination from "../../../components/common/Pagination";
import DeleteConfirm from "../../../components/common/DeleteConfirm";
import { farmersAPI } from "@/services/api/farmers";
import { APIError } from "@/services/api/types";
import type { FarmerListItem } from "@/types/farmer";
import { mapFarmerResponse } from "@/utils/farmerMapper";

const MOCK_HISTORY_DATA: FarmerHistory[] = [
    { id: 1, date: "20/12/2025 - 06:00", age: "91-120", foodAmount: "35 กก.", weight: 1.8, pondType: "บ่อปูน", pondCount: 8, fishCount: 130, temp: "32 °C", rain: 30, humidity: 27 },
    { id: 2, date: "10/12/2025 - 06:00", age: "61-90", foodAmount: "32 กก.", weight: 1.8, pondType: "บ่อปูน", pondCount: 5, fishCount: 80, temp: "32 °C", rain: 30, humidity: 27 },
    { id: 3, date: "30/11/2025 - 06:00", age: "61-90", foodAmount: "30 กก.", weight: 1.0, pondType: "บ่อปูน", pondCount: 5, fishCount: 250, temp: "32 °C", rain: 30, humidity: 27 },
    { id: 4, date: "20/11/2025 - 06:00", age: "61-90", foodAmount: "28 กก.", weight: 1.8, pondType: "บ่อปูน", pondCount: 7, fishCount: 250, temp: "32 °C", rain: 30, humidity: 27 },
    { id: 5, date: "10/11/2025 - 06:00", age: "31-60", foodAmount: "25 กก.", weight: 1.8, pondType: "บ่อปูน", pondCount: 4, fishCount: 250, temp: "32 °C", rain: 30, humidity: 27 },
    { id: 6, date: "01/11/2025 - 06:00", age: "31-60", foodAmount: "22 กก.", weight: 1.8, pondType: "บ่อปูน", pondCount: 4, fishCount: 320, temp: "32 °C", rain: 30, humidity: 27 },
    { id: 7, date: "30/10/2025 - 06:00", age: "31-60", foodAmount: "20 กก.", weight: 1.8, pondType: "บ่อปูน", pondCount: 4, fishCount: 170, temp: "32 °C", rain: 30, humidity: 27 },
    { id: 8, date: "20/10/2025 - 06:00", age: "16-30", foodAmount: "15 กก.", weight: 1.8, pondType: "บ่อปูน", pondCount: 4, fishCount: 250, temp: "32 °C", rain: 30, humidity: 27 },
    { id: 9, date: "10/10/2025 - 06:00", age: "16-30", foodAmount: "12 กก.", weight: 1.8, pondType: "บ่อปูน", pondCount: 4, fishCount: 250, temp: "32 °C", rain: 30, humidity: 27 },
    { id: 10, date: "01/10/2025 - 06:00", age: "0-15", foodAmount: "8 กก.", weight: 1.8, pondType: "บ่อปูน", pondCount: 4, fishCount: 250, temp: "32 °C", rain: 30, humidity: 27 },
    { id: 11, date: "20/09/2025 - 06:00", age: "0-15", foodAmount: "5 กก.", weight: 0.5, pondType: "บ่อปูน", pondCount: 4, fishCount: 250, temp: "32 °C", rain: 30, humidity: 27 },
];

interface ModalState {
    type: 'view' | 'edit' | 'delete' | null;
    data: FarmerHistory | null;
}

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function FarmerDetailPage(props: PageProps) {
    const params = use(props.params);
    const { id } = params;

    const router = useRouter();
    const [farmerData, setFarmerData] = useState<FarmerListItem | null>(null);
    const [isFarmerLoading, setIsFarmerLoading] = useState(true);
    const [historyData, setHistoryData] = useState<FarmerHistory[]>([]);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [modalState, setModalState] = useState<ModalState>({ type: null, data: null });

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

    useEffect(() => {
        const fetchFarmer = async () => {
            setIsFarmerLoading(true);
            try {
                const farmer = await farmersAPI.getById(id);
                setFarmerData(mapFarmerResponse(farmer));
                setHistoryData(MOCK_HISTORY_DATA);
            } catch (error) {
                const message = error instanceof APIError ? error.message : 'ไม่พบข้อมูลเกษตรกร';
                toast.error(message, { duration: 2500, position: 'top-right' });
                setFarmerData(null);
            } finally {
                setIsFarmerLoading(false);
            }
        };

        fetchFarmer();
    }, [id]);

    const totalItems = historyData.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage) || 1);
    const paginatedHistory = historyData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleItemsPerPageChange = (newSize: number) => {
        setItemsPerPage(newSize);
        setCurrentPage(1);
    };

    const handleViewClick = (item: FarmerHistory) => {
        setModalState({ type: 'view', data: item });
    };

    const handleEditClick = (item: FarmerHistory) => {
        setModalState({ type: 'edit', data: item });
    };

    const handleDeleteClick = (item: FarmerHistory) => {
        setModalState({ type: 'delete', data: item });
    };

    const handleUpdateHistory = (updatedData: Partial<FarmerHistory> & { ageRange?: string }) => {
        const originalData = modalState.data; 
        if (!originalData) return;

        const cleanVal = (val: string | number | undefined | null) => String(val || '').replace(/กก\.| kg\.|kg/gi, '').trim();

        const isUnchanged = 
            String(originalData.pondType || '') === String(updatedData.pondType || '') &&
            String(originalData.pondCount || '') === String(updatedData.pondCount || '') &&
            String(originalData.fishCount || '') === String(updatedData.fishCount || '') &&
            String(originalData.age || '') === String(updatedData.ageRange || updatedData.age || '') && 
            cleanVal(originalData.foodAmount) === cleanVal(updatedData.foodAmount);

        if (isUnchanged) {
            toast.error("ยังไม่ได้มีการแก้ไขข้อมูล", {
                duration: 2000,
                position: "top-right",
            });
            return; 
        }

        setHistoryData(prev => prev.map(item => 
            item.id === modalState.data?.id ? { 
                ...item, 
                ...updatedData,
                foodAmount: updatedData.foodAmount, 
                age: updatedData.ageRange || updatedData.age || item.age 
            } : item
        ));
        
        toast.success(
            (t) => (
                <div className="flex items-center gap-2">
                    <span>แก้ไขข้อมูลสำเร็จ!</span>
                </div>
            ),
            { duration: 2000, position: "top-right" }
        );
        
        setModalState({ type: null, data: null });
    };

    const handleConfirmDelete = () => {
        if (!modalState.data) return;
        
        const dateToDelete = modalState.data.date.split(' - ')[0]; 

        setHistoryData((prev) => prev.filter((i) => i.id !== modalState.data?.id));
        
        toast.success(
            (t) => (
                <div className="flex items-center justify-center gap-2 w-full font-medium">
                    <span>{`ลบรายการวันที่ ${dateToDelete} สำเร็จ!`}</span>
                </div>
            ),
            { 
                duration: 2000, 
                position: "top-right",
                style: {
                    borderRadius: '12px',
                    background: '#fff',
                    color: '#333',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }
            }
        );

        setModalState({ type: null, data: null });
    };

    const closeModal = () => setModalState({ type: null, data: null });

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            <header className="h-16 flex items-center px-5 text-white mb-6 bg-[#034A30] sticky top-0 z-20 shadow-md pl-16 lg:pl-5">
                <button onClick={() => router.back()} className="flex items-center gap-2 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors -ml-12 lg:ml-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-xl font-medium">{isFarmerLoading ? "กำลังโหลด..." : farmerData?.name || "ไม่พบข้อมูล"}</span>
                </button>
                <div className="flex-1 flex justify-end items-center space-x-3 text-sm pr-5">
                    <span className="text-xl me-2">Admin</span>
                </div>
            </header>

            <div className="px-6 space-y-6">
                <FarmerInfoCard data={farmerData} />
                <FarmerDashboard groupType={farmerData?.groupType} />

                <div className="mt-8">
                    <FarmerHistoryTable 
                        data={paginatedHistory}
                        startIndex={(currentPage - 1) * itemsPerPage}
                        onView={handleViewClick}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                    />
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

            {modalState.type === 'view' && modalState.data && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50">
                    <ViewFarmerHistory 
                        data={modalState.data} 
                        onClose={closeModal} 
                    />
                </div>
            )}

            {modalState.type === 'edit' && modalState.data && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50">
                    <EditFarmerHistory 
                        initialData={modalState.data} 
                        onClose={closeModal} 
                        onSave={handleUpdateHistory} 
                    />
                </div>
            )}

            <DeleteConfirm 
                isOpen={modalState.type === 'delete'}
                onClose={closeModal}
                onConfirm={handleConfirmDelete}
                title="ลบรายการเก็บข้อมูล"
                itemName={modalState.data ? `ข้อมูลวันที่ ${modalState.data.date.split(' - ')[0]}` : undefined}
            />
        </div>
    );
}