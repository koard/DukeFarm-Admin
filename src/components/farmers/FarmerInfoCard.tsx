'use client';

import type { FarmerListItem } from '@/types/farmer';

interface FarmerInfoCardProps {
    data: FarmerListItem | null;
}

const FarmerInfoCard = ({ data }: FarmerInfoCardProps) => {

    if (!data) return null;

    const farmAreaRai = (data as any).farmAreaRai;
    const registeredPondCount = (data as any).ponds && Array.isArray((data as any).ponds) 
        ? (data as any).ponds.length 
        : '-';

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 p-5 lg:p-6">

                {/* ส่วนข้อมูลเจ้าของบ่อ */}
                <div className="flex flex-col justify-center gap-4 lg:w-1/2">
                    <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">เจ้าของบ่อ</p>
                        <h2 className="text-2xl font-bold text-[#093832]">{data.name || (data as any).fullName}</h2>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">เบอร์โทรศัพท์</p>
                            <p className="text-base font-semibold text-gray-900">{data.phone}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">พิกัดพื้นที่</p>
                            <a
                                href={`https://maps.google.com/?q=${data.location || ((data as any).latitude && (data as any).longitude ? `${(data as any).latitude},${(data as any).longitude}` : '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-base font-semibold text-[#179678] underline decoration-2 underline-offset-4 hover:text-[#127a61]"
                            >
                                {data.location || ((data as any).latitude && (data as any).longitude ? `${(data as any).latitude}, ${(data as any).longitude}` : '-')}
                            </a>
                        </div>
                    </div>
                </div>

                <div className="bg-[#F2F9F6] p-5 rounded-xl flex flex-col justify-center gap-5 lg:w-1/2">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        
                        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-xs font-medium text-gray-600 mb-0.5">พื้นที่ทั้งหมด</p>
                            <p className="text-xl font-bold text-[#093832]">
                                {farmAreaRai || '-'} <span className="text-sm font-medium text-gray-500">ไร่</span>
                            </p>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-xs font-medium text-gray-600 mb-0.5">จำนวนบ่อทั้งหมด</p>
                            <p className="text-xl font-bold text-[#093832]">
                                {data.pondCount || '-'} <span className="text-sm font-medium text-gray-500">บ่อ</span>
                            </p>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm col-span-2 md:col-span-1">
                            <p className="text-xs font-medium text-gray-600 mb-0.5">บ่อที่ลงทะเบียน</p>
                            <p className="text-xl font-bold text-[#179678]">
                                {registeredPondCount} <span className="text-sm font-medium text-gray-500">บ่อ</span>
                            </p>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default FarmerInfoCard;