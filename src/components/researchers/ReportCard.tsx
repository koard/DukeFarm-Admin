'use client';

import Image from 'next/image';

import FishPurpleIcon from '../../assets/famicons_fish-p.svg';
import FishGreenIcon from '../../assets/famicons_fish-g.svg';

interface ReportCardProps {
    researcherId?: string;
    farmName?: string;
    ownerPhone?: string;
    location?: string;
    pondSize?: number;
    groupType?: string;
    pondCount?: number;
    pondType?: string; 
}

const InfoRow = ({ label, value }: { label: string, value: string | number }) => (
    <div className="flex items-start mb-3">
        <span className="text-base text-gray-800 w-32 flex-shrink-0">{label}</span>
        <span className="text-base text-gray-900 font-medium break-all">{value || '-'}</span>
    </div>
);

const ReportCard = ({ 
    researcherId,
    farmName = "-",    
    ownerPhone = "-",  
    location = "145690.903764",
    pondSize = 600,
    groupType = "กลุ่มอนุบาลขนาดใหญ่",
    pondCount = 6,
    pondType = "บ่อดิน"
}: ReportCardProps) => {
    
    const isMarketGroup = groupType === 'กลุ่มผู้เลี้ยงขนาดตลาด';

    const theme = isMarketGroup ? {
        bgColor: '#9DFFEB',
        textColor: '#007066',
        icon: FishGreenIcon
    } : {
        bgColor: '#DB9DFF',
        textColor: '#470070',
        icon: FishPurpleIcon
    };

    return (
        <div className="w-full bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-fit lg:mt-16">
            
            <div className="mb-6">
                 <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-sm transition-colors duration-300"
                       style={{ backgroundColor: theme.bgColor, color: theme.textColor }}>
                    
                    <Image 
                        src={theme.icon} 
                        alt="icon" 
                        width={20} 
                        height={20} 
                        className="w-5 h-5"
                    />
                    
                    {groupType}
                 </span>
            </div>

            <div className="space-y-1 mb-6">
                <InfoRow label="เจ้าของบ่อ" value={farmName} />  
                <InfoRow label="เบอร์โทร" value={ownerPhone} /> 
                <InfoRow label="พิกัดพื้นที่" value={location} />
                <InfoRow label="พื้นที่รวมของฟาร์ม (ตร.ม.)" value={pondSize} />
            </div>

            <div className="space-y-4">
                <div className="flex items-center">
                    <span className="text-base text-gray-800 w-24">ประเภท</span>
                    <span className="px-6 py-1.5 rounded-lg text-sm font-bold text-black"
                          style={{ backgroundColor: '#C5E6C6' }}>
                        {pondType}
                    </span>
                </div>

                <div className="flex items-center">
                    <span className="text-base text-gray-800 w-24">จำนวนบ่อ</span>
                    <span className="px-8 py-1.5 rounded-lg text-sm font-bold text-black"
                          style={{ backgroundColor: '#C5E6C6' }}>
                        {pondCount}
                    </span>
                </div>
            </div>

        </div>
    );
};

export default ReportCard;