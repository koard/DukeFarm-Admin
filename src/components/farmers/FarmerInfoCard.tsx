'use client';

import type { FarmerListItem } from '@/types/farmer';

interface FarmerInfoCardProps {
    data: FarmerListItem | null;
}

const getGroupTypeLabel = (type?: string) => {
    if (!type) return '';
    const upper = type.toUpperCase();
    if (upper === 'SMALL' || upper === 'NURSERY_SMALL') return 'ปลาตุ้ม';
    if (upper === 'LARGE' || upper === 'NURSERY_LARGE') return 'ปลานิ้ว';
    if (upper === 'MARKET' || upper === 'GROWOUT') return 'ปลาตลาด';
    return type;
};

const FarmerInfoCard = ({ data }: FarmerInfoCardProps) => {

    if (!data) return null;

    const rawFarmTypes: string[] = (data as any).farmTypes || [];
    const displayTypes = rawFarmTypes.length > 0
        ? rawFarmTypes
        : (data.groupType ? [data.groupType] : []);

    const farmAreaRai = (data as any).farmAreaRai;

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 p-5 lg:p-6">

                {/* ส่วนข้อมูลเจ้าของบ่อ */}
                <div className="flex flex-col justify-center gap-4">
                    <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">เจ้าของบ่อ</p>
                        <h2 className="text-2xl font-bold text-[#093832]">{data.name}</h2>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">เบอร์โทรศัพท์</p>
                            <p className="text-base font-semibold text-gray-900">{data.phone}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">พิกัดพื้นที่</p>
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${data.location}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-base font-semibold text-[#179678] underline decoration-2 underline-offset-4 hover:text-[#127a61]"
                            >
                                {data.location || '-'}
                            </a>
                        </div>
                    </div>
                </div>

                {/* ส่วนประเภทกลุ่มการเลี้ยง - จัดชิดซ้าย */}
                <div className="bg-[#F2F9F6] p-5 rounded-xl flex flex-col justify-center gap-5">

                    <div>
                        <p className="text-sm font-bold text-[#093832] mb-2">
                            ประเภทกลุ่มการเลี้ยง
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {displayTypes.length > 0 ? (
                                displayTypes.map((type, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1.5 rounded-lg text-sm font-bold bg-white text-[#179678] border border-[#179678]/30 shadow-sm"
                                    >
                                        {getGroupTypeLabel(type)}
                                    </span>
                                ))
                            ) : (
                                <span className="text-base text-gray-500">-</span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-xs font-medium text-gray-600 mb-0.5">จำนวนบ่อทั้งหมด</p>
                            <p className="text-xl font-bold text-[#093832]">
                                {data.pondCount} <span className="text-sm font-medium text-gray-500">บ่อ</span>
                            </p>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-xs font-medium text-gray-600 mb-0.5">พื้นที่ทั้งหมด</p>
                            <p className="text-xl font-bold text-[#093832]">
                                {farmAreaRai || '-'} <span className="text-sm font-medium text-gray-500">ไร่</span>
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default FarmerInfoCard;
