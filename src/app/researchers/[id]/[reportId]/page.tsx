'use client'; 

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import ReportCard from '../../../../components/researchers/ReportCard';
import ReportForm from '../../../../components/researchers/ReportForm';

const MOCK_RESEARCHERS_DB = [
    { id: "1", name: "ดนัย โคจร", phone: "0812232343" },
    { id: "5", name: "อรพันธ์ มาดี", phone: "0812232343" },
];

const MOCK_REPORTS_DB = [
    { id: "1", date: "20/12/2025 - 06:00", groupType: "กลุ่มอนุบาลขนาดใหญ่" },
    { id: "2", date: "10/12/2025 - 06:00", groupType: "กลุ่มอนุบาลขนาดใหญ่" },
    { id: "5", date: "10/11/2025 - 06:00", groupType: "กลุ่มผู้เลี้ยงขนาดตลาด" },
    { id: "6", date: "01/11/2025 - 06:00", groupType: "กลุ่มผู้เลี้ยงขนาดตลาด" },
];


interface PageProps {
  params: Promise<{
    id: string;     
    reportId: string; 
  }>;
}

export default function ReportDetailPage({ params }: PageProps) {
  const router = useRouter();
  
  const [ids, setIds] = useState<{ id: string; reportId: string } | null>(null);
  
  const [headerDate, setHeaderDate] = useState<string>("กำลังโหลด...");
  
  const [researcherData, setResearcherData] = useState({ name: "-", phone: "-" });
  const [reportData, setReportData] = useState({ groupType: "กลุ่มอนุบาลขนาดใหญ่" });

  useEffect(() => {
    params.then((resolvedParams) => {
      setIds(resolvedParams);

      const foundResearcher = MOCK_RESEARCHERS_DB.find(r => r.id === resolvedParams.id);
      if (foundResearcher) {
          setResearcherData({
              name: foundResearcher.name,
              phone: foundResearcher.phone
          });
      } else {
          setResearcherData({ name: "ไม่ระบุ", phone: "-" });
      }

      const foundReport = MOCK_REPORTS_DB.find(r => r.id === resolvedParams.reportId);
      if (foundReport) {
        setHeaderDate(`รายงานวันที่ ${foundReport.date}`);
        setReportData({
            groupType: foundReport.groupType
        });
      } else {
        setHeaderDate("ไม่พบข้อมูลรายงาน");
        setReportData({ groupType: "กลุ่มอนุบาลขนาดใหญ่" }); 
      }
    });
  }, [params]);

  if (!ids) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      
      <header className="h-16 flex items-center px-5 text-white mb-2 bg-[#034A30] sticky top-0 z-20 shadow-md pl-35 lg:pl-5">
          <button 
                onClick={() => router.push(`/researchers/${ids?.id}`)}
                className="flex items-center gap-2 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors -ml-23 lg:ml-0"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-xl font-medium">{headerDate}</span>
            </button>
          <div className="flex-1 flex justify-end items-center space-x-3 text-sm pr-5">
              <span className="text-xl me-2">Admin</span>
          </div>
      </header>

      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          <aside className="w-full lg:w-1/3 xl:w-[350px] flex-shrink-0">
            <ReportCard 
                researcherId={ids.id}
                
                farmName={researcherData.name} 
                ownerPhone={researcherData.phone}
                
                groupType={reportData.groupType}
            />
          </aside>

          <main className="w-full flex-1">
            <ReportForm reportId={ids.reportId} researcherId={ids.id} />
          </main>
          
        </div>
      </div>
    </div>
  );
}