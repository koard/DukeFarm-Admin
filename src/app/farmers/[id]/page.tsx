'use client';

import React, { useState, useEffect, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import dayjs from 'dayjs';
import 'dayjs/locale/th';

import FarmerInfoCard from "../../../components/farmers/FarmerInfoCard";
import FarmerDashboard from "../../../components/farmers/FarmerDashboard"; 
import FarmerHistoryTable, { FarmerHistory } from "../../../components/farmers/FarmerHistoryTable";
import ViewFarmerHistory from "../../../components/farmers/ViewFarmerHistory";
import EditFarmerHistory from "../../../components/farmers/EditFarmerHistory";
import FarmerToolbar from "../../../components/farmers/FarmerToolbar";

import Pagination from "../../../components/common/Pagination";
import DeleteConfirm from "../../../components/common/DeleteConfirm";

import { farmersAPI } from "@/services/api/farmers";
import { recordsAPI, ListRecordsParams } from "@/services/api/records";
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
    const [historyData, setHistoryData] = useState<FarmerHistory[]>([]);
    const [allRawEntries, setAllRawEntries] = useState<any[]>([]); 

    const [isFarmerLoading, setIsFarmerLoading] = useState(true);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);

    const [activePond, setActivePond] = useState('pond_1'); 
    const [filterPeriod, setFilterPeriod] = useState('1M');

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
        const fetchFarmerProfile = async () => {
            setIsFarmerLoading(true);
            try {
                const farmerRes = await farmersAPI.getById(id);
                setFarmerData(mapFarmerResponse(farmerRes));

                const rawEntries = (farmerRes as any).entries || [];
                setAllRawEntries(rawEntries);

                if (Array.isArray(rawEntries) && rawEntries.length > 0) {
                    const mappedHistory = rawEntries.map(mapRecordToHistory);
                    mappedHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                    setHistoryData(mappedHistory);
                } else {
                    setHistoryData([]);
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
            fetchFarmerProfile();
        }
    }, [id]);

    const fetchRecords = useCallback(async () => {
        if (!id || !farmerData) return;

        if (activePond === 'ALL' && filterPeriod === 'ALL') { 
            const mappedHistory = allRawEntries.map(mapRecordToHistory);
            mappedHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setHistoryData(mappedHistory);
            return;
        }

        setIsHistoryLoading(true);
        try {
            const params: ListRecordsParams & { startDate?: string, endDate?: string, pondId?: string } = {
                userId: farmerData.id,
                pondId: activePond !== 'ALL' ? activePond : undefined, 
            };

            if (filterPeriod !== 'ALL') {
                const now = dayjs();

                if (filterPeriod === '1M') {
                    params.startDate = now.subtract(1, 'month').toISOString();
                    params.endDate = now.toISOString();
                } else if (filterPeriod === '3M') {
                    params.startDate = now.subtract(3, 'month').toISOString();
                    params.endDate = now.toISOString();
                } else if (filterPeriod === '6M') {
                    params.startDate = now.subtract(6, 'month').toISOString();
                    params.endDate = now.toISOString();
                }
            }

            const res = await recordsAPI.list(params);

            const rawEntries = res.data;
            if (Array.isArray(rawEntries)) {
                const mappedHistory = rawEntries.map(mapRecordToHistory);
                mappedHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setHistoryData(mappedHistory);
            } else {
                setHistoryData([]);
            }

        } catch (error) {
            console.warn("API Filtering failed, falling back to client-side:", error);

            let filtered = [...allRawEntries];

            if (activePond !== 'ALL') {
                filtered = filtered.filter(item => item.pondId === activePond || item.pondName === activePond); 
            }

            if (filterPeriod !== 'ALL') {
                const now = dayjs();
                filtered = filtered.filter(item => {
                    const recordDate = dayjs(item.recordedAt);

                    if (filterPeriod === '1M') {
                        return recordDate.isAfter(now.subtract(1, 'month'));
                    } else if (filterPeriod === '3M') {
                        return recordDate.isAfter(now.subtract(3, 'month'));
                    } else if (filterPeriod === '6M') {
                        return recordDate.isAfter(now.subtract(6, 'month'));
                    }
                    return true;
                });
            }

            const mappedHistory = filtered.map(mapRecordToHistory);
            mappedHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setHistoryData(mappedHistory);

        } finally {
            setIsHistoryLoading(false);
        }
    }, [id, farmerData, activePond, filterPeriod, allRawEntries]);

    useEffect(() => {
        if (farmerData) {
            fetchRecords();
        }
    }, [fetchRecords, farmerData]);

    // --- Pagination Logic ---
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

    // --- Handlers ---
    const handleViewClick = (item: FarmerHistory) => setModalState({ type: 'view', data: item });
    const handleEditClick = (item: FarmerHistory) => setModalState({ type: 'edit', data: item });
    const handleDeleteClick = (item: FarmerHistory) => setModalState({ type: 'delete', data: item });
    const closeModal = () => setModalState({ type: null, data: null });

    const handleUpdateHistory = async (updatedData: any) => {
        const originalData = modalState.data;
        if (!originalData) return;

        try {
            const toastId = toast.loading('กำลังบันทึกข้อมูล...');

            const pondTypeMapping: { [key: string]: string } = {
                'บ่อดิน': 'EARTHEN',
                'บ่อปูน': 'CONCRETE',
            };
            const apiPondType = pondTypeMapping[updatedData.pondType] || updatedData.pondType;

            await recordsAPI.update(originalData.id, {
                recordedAt: updatedData.recordedAt,
                foodAmountKg: updatedData.foodAmountKg,
                pondCount: updatedData.pondCount,
                fishCountText: updatedData.fishCountText,
                weatherTemperatureC: updatedData.weatherTemperatureC,
                weatherRainMm: updatedData.weatherRainMm,
                weatherHumidityPct: updatedData.weatherHumidityPct,
                pondType: apiPondType,
                fishAgeLabel: updatedData.fishAgeLabel,
            });

            setHistoryData(prev => prev.map(item =>
                item.id === modalState.data?.id ? {
                    ...item,
                    ...updatedData,
                    date: updatedData.displayDate,
                    foodAmountKg: updatedData.foodAmountKg,
                    temp: updatedData.temp,
                    rain: updatedData.rain,
                    humidity: updatedData.humidity,
                    pondType: updatedData.pondType,
                    fishAgeDays: updatedData.fishAgeDays,
                    age: updatedData.fishAgeLabel,
                } : item
            ));

            setAllRawEntries(prev => prev.map(item =>
                item.id === modalState.data?.id ? {
                    ...item,
                    recordedAt: updatedData.recordedAt,
                    foodAmountKg: updatedData.foodAmountKg,
                    pondCount: updatedData.pondCount,
                    fishCountText: updatedData.fishCountText,
                    weatherTemperatureC: updatedData.weatherTemperatureC,
                    weatherRainMm: updatedData.weatherRainMm,
                    weatherHumidityPct: updatedData.weatherHumidityPct,
                    pondType: apiPondType,
                    fishAgeDays: updatedData.fishAgeDays,
                    fishAgeLabel: updatedData.fishAgeLabel,
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
            setAllRawEntries((prev) => prev.filter((i) => i.id !== modalState.data?.id));

            toast.dismiss(toastId);
            toast.success("ลบรายการสำเร็จ!");
            setModalState({ type: null, data: null });
        } catch (error) {
            console.error("Delete failed:", error);
            toast.dismiss();
            toast.error("ไม่สามารถลบรายการได้");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            <header className="h-16 flex items-center px-5 text-white mb-6 bg-[#034A30] sticky top-0 z-20 shadow-md pl-16 lg:pl-5">
                <button onClick={() => router.back()} className="flex items-center gap-2 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors -ml-12 lg:ml-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-xl font-medium">{isFarmerLoading ? "กำลังโหลด..." : farmerData?.name || "ไม่พบข้อมูล"}</span>
                </button>
                <div className="flex-1 flex justify-end items-center space-x-3 text-sm pr-5">
                    <span className="text-xl me-2">Admin</span>
                </div>
            </header>

            <div className="px-6 space-y-6">
                <FarmerInfoCard data={farmerData} />

                <div className="mt-8">
                    
                    <FarmerToolbar 
                        isHistoryLoading={isHistoryLoading}
                        activePond={activePond}
                        setActivePond={setActivePond}
                        filterPeriod={filterPeriod}
                        setFilterPeriod={setFilterPeriod}
                        setCurrentPage={setCurrentPage}
                    />

                    <div className="mb-6">
                        <FarmerDashboard loading={isHistoryLoading} />
                    </div>

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