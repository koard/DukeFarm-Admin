// app/farmers/[id]/page.tsx

'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 

// 1. Import Component
import FarmerInfoCard from "../../../components/farmers/FarmerInfoCard";
import FarmerDashboard from "../../../components/farmers/FarmerDashboard"; // <-- เพิ่มตรงนี้

// 2. Import ข้อมูล MOCK_FARMERS และ Type จากไฟล์หลัก (ถอยกลับไป 1 ชั้น ..)
import { MOCK_FARMERS, Farmer } from "../page"; 

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function FarmerDetailPage({ params }: PageProps) {
    const router = useRouter();
    const [farmerData, setFarmerData] = useState<Farmer | null>(null);

    useEffect(() => {
        params.then((resolvedParams) => {
            const id = Number(resolvedParams.id);
            
            // 3. ค้นหาข้อมูลจาก MOCK_FARMERS ที่ Import มา
            const foundFarmer = MOCK_FARMERS.find(f => f.id === id);
            
            if (foundFarmer) {
                setFarmerData(foundFarmer);
            }
        });
    }, [params]);

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            
            {/* Header */}
            <header className="h-16 flex items-center px-5 text-white mb-6 bg-[#034A30] sticky top-0 z-20 shadow-md pl-35 lg:pl-5">
                <button 
                    onClick={() => router.back()} 
                    className="flex items-center gap-2 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors -ml-23 lg:ml-0"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-xl font-medium">
                        {farmerData ? farmerData.name : "กำลังโหลด..."}
                    </span>
                </button>
                <div className="flex-1 flex justify-end items-center space-x-3 text-sm pr-5">
                    <span className="text-xl me-2">Admin</span>
                </div>
            </header>

            {/* Content */}
            <div className="px-6 space-y-6">
                
                {/* แสดงการ์ดข้อมูล */}
                <FarmerInfoCard data={farmerData} />

                {/* แสดง Dashboard กราฟ */}
                <FarmerDashboard />
                
            </div>

        </div>
    );
}