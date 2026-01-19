'use client';

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation"; 
import toast from "react-hot-toast";
import dayjs from 'dayjs'; 
import 'dayjs/locale/th'; 

import FarmerInfoCard from "../../../components/farmers/FarmerInfoCard";
import FarmerDashboard from "../../../components/farmers/FarmerDashboard"; 
import FarmerHistoryTable, { FarmerHistory } from "../../../components/farmers/FarmerHistoryTable";
import ViewFarmerHistory from "../../../components/farmers/ViewFarmerHistory";
import EditFarmerHistory from "../../../components/farmers/EditFarmerHistory";

import Pagination from "../../../components/common/Pagination";
import DeleteConfirm from "../../../components/common/DeleteConfirm";

import { farmersAPI } from "@/services/api/farmers";
import { recordsAPI } from "@/services/api/records"; 
import { APIError } from "@/services/api/types";
import type { FarmerListItem } from "@/types/farmer";
import { mapFarmerResponse } from "@/utils/farmerMapper";
import { mapRecordToHistory } from "@/utils/recordMapper";

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
    
    const [feedChartData, setFeedChartData] = useState<any[]>([]); 
    const [growthChartData, setGrowthChartData] = useState<any[]>([]); 
    
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

    const processChartData = (entries: any[]) => {
        const sortedForChart = [...entries].sort((a, b) => 
            new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
        );

        const recentEntries = sortedForChart.slice(-10);

        const feedData = recentEntries.map((entry: any) => ({
            name: dayjs(entry.recordedAt).format('DD/MM'), 
            food: entry.foodAmountKg ?? 0,                
            temp: entry.weatherTemperatureC               
        }));
        setFeedChartData(feedData);

        const growthData = recentEntries.map((entry: any) => ({
            name: dayjs(entry.recordedAt).format('DD/MM'),
            weight: (entry.fishAverageWeight ?? entry.averageFishWeightGr ?? 0)
        }));
        setGrowthChartData(growthData);
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsFarmerLoading(true);
            try {
                const farmerRes = await farmersAPI.getById(id);
                setFarmerData(mapFarmerResponse(farmerRes));

                const rawEntries = (farmerRes as any).entries; 

                if (rawEntries && Array.isArray(rawEntries) && rawEntries.length > 0) {
                    console.log("Found entries:", rawEntries);
                    
                    const mappedHistory = rawEntries.map(mapRecordToHistory);
                    mappedHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                    setHistoryData(mappedHistory);

                    processChartData(rawEntries);

                } else {
                    setHistoryData([]);
                    setFeedChartData([]);
                    setGrowthChartData([]);
                }

            } catch (error) {
                const message = error instanceof APIError ? error.message : 'ไม่พบข้อมูลเกษตรกร';
                toast.error(message, { duration: 2500, position: 'top-right' });
                setFarmerData(null);
            } finally {
                setIsFarmerLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
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

    const handleUpdateHistory = async (updatedData: any) => {
        const originalData = modalState.data; 
        if (!originalData) return;

        try {
            const toastId = toast.loading('กำลังบันทึกข้อมูล...');
            await recordsAPI.update(originalData.id, {
                foodAmountKg: updatedData.foodAmountKg, 
                pondCount: updatedData.pondCount,
                fishCountText: updatedData.fishCountText,
                
                weatherTemperatureC: updatedData.weatherTemperatureC,
                weatherRainMm: updatedData.weatherRainMm,
                weatherHumidityPct: updatedData.weatherHumidityPct,
                
                pondType: updatedData.pondType,
            });

            setHistoryData(prev => prev.map(item => 
                item.id === modalState.data?.id ? { 
                    ...item, 
                    ...updatedData,
                    foodAmount: updatedData.foodAmountKg ? `${updatedData.foodAmountKg} กก.` : '-',
                    temp: updatedData.temp,
                    rain: updatedData.rain,
                    humidity: updatedData.humidity,
                    pondType: updatedData.pondType
                } : item
            ));
        
            toast.dismiss(toastId);
            toast.success("บันทึกข้อมูลเรียบร้อย!");
            setModalState({ type: null, data: null });

        } catch (error) {
            console.error("Update failed:", error);
            toast.dismiss();
            toast.error("เกิดข้อผิดพลาด ไม่สามารถบันทึกได้");
        }
    };

    const handleConfirmDelete = async () => {
        if (!modalState.data) return;
        
        try {
            const toastId = toast.loading('กำลังลบข้อมูล...');
            
            await recordsAPI.delete(modalState.data.id); 
            
            setHistoryData((prev) => prev.filter((i) => i.id !== modalState.data?.id));
            
            toast.dismiss(toastId);
            toast.success("ลบรายการสำเร็จ!");
            setModalState({ type: null, data: null });
        } catch (error) {
            console.error("Delete failed:", error);
            toast.dismiss();
            toast.error("ไม่สามารถลบรายการได้");
        }
    };

    const closeModal = () => setModalState({ type: null, data: null });

    const farmTypesList = farmerData 
        ? ((farmerData as any).farmTypes?.length > 0 
            ? (farmerData as any).farmTypes 
            : (farmerData.groupType ? [farmerData.groupType] : []))
        : [];

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
                
                <FarmerDashboard 
                    farmTypes={farmTypesList} 
                    feedChartData={feedChartData} 
                    growthChartData={growthChartData}
                />

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

            {/* Modals */}
            {modalState.type === 'view' && modalState.data && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50">
                    <ViewFarmerHistory data={modalState.data} onClose={closeModal} />
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