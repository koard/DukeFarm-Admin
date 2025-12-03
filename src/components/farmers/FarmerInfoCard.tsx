'use client';

import type { FarmerListItem } from '@/types/farmer';

interface FarmerInfoCardProps {
    data: FarmerListItem | null;
}

const InfoRow = ({ label, value, isUnderline = false }: { label: string, value: string | number, isUnderline?: boolean }) => (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
        <span className="text-base sm:w-36 flex-shrink-0">{label}</span>
        <span className={`font-medium text-base break-all ${isUnderline ? 'underline underline-offset-2' : ''}`}>
            {value || '-'}
        </span>
    </div>
);

const FarmerInfoCard = ({ data }: FarmerInfoCardProps) => {
    
    if (!data) return null;

    return (
        <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
            
            <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                
                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                    <InfoRow label="เจ้าของบ่อ" value={data.name} />
                    <InfoRow label="เบอร์โทร" value={data.phone} />
                    <InfoRow label="พิกัดพื้นที่" value={data.location} isUnderline />
                    <InfoRow label="พื้นที่รวมของฟาร์ม (ตร.ม.)" value="600" />
                </div>

                <div className="flex flex-col gap-4 w-full lg:w-auto items-start lg:items-end flex-shrink-0">
                    
                    <div className="flex items-center gap-4">
                        <span className="text-base">ประเภท</span>
                        <span className="px-6 py-1.5 rounded-lg text-base font-bold bg-[#C5E6C6] min-w-[100px] text-center shadow-sm">
                            {data.pondType}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-base">จำนวนบ่อ</span>
                        <span className="px-6 py-1.5 rounded-lg text-base font-bold bg-[#C5E6C6] min-w-[100px] text-center shadow-sm">
                            {data.pondCount}
                        </span>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default FarmerInfoCard;