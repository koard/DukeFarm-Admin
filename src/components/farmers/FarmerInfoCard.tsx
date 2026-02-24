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
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#034A30] via-[#06644A] to-[#0A8865] p-[1px]">
            <div className="relative rounded-2xl bg-white/[0.97] backdrop-blur-xl p-6 lg:p-8">
                {/* Decorative circle */}
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#034A30]/5 rounded-full blur-2xl" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#179678]/5 rounded-full blur-2xl" />

                <div className="relative flex flex-col lg:flex-row gap-8">
                    {/* Profile section */}
                    <div className="flex items-start gap-5 lg:w-[55%]">
                        {/* Avatar - LINE profile picture or initial */}
                        {data.pictureUrl ? (
                            <img
                                src={data.pictureUrl}
                                alt={data.name || 'profile'}
                                className="flex-shrink-0 w-16 h-16 rounded-2xl object-cover shadow-lg border-2 border-[#179678]/20"
                                onError={(e) => {
                                    const target = e.currentTarget;
                                    target.style.display = 'none';
                                    target.nextElementSibling?.classList.remove('hidden');
                                }}
                            />
                        ) : null}
                        <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#034A30] to-[#179678] rounded-2xl flex items-center justify-center shadow-lg ${data.pictureUrl ? 'hidden' : ''}`}>
                            <span className="text-2xl font-black text-white">
                                {(data.name || (data as any).fullName || 'U').charAt(0).toUpperCase()}
                            </span>
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-[#179678] uppercase tracking-[0.15em] mb-1">เจ้าของบ่อ</p>
                            <h2 className="text-2xl lg:text-3xl font-extrabold text-[#0A1F1C] truncate leading-tight">
                                {data.name || (data as any).fullName}
                            </h2>
                            
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                                        </svg>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-800">{data.phone}</span>
                                </div>
                                <a
                                    href={`https://maps.google.com/?q=${data.location || ((data as any).latitude && (data as any).longitude ? `${(data as any).latitude},${(data as any).longitude}` : '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group flex items-center gap-2 hover:scale-[1.02] transition-transform"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-[#179678]/10 flex items-center justify-center group-hover:bg-[#179678]/20 transition-colors">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#179678" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                            <circle cx="12" cy="10" r="3"/>
                                        </svg>
                                    </div>
                                    <span className="text-sm font-semibold text-[#179678] group-hover:underline underline-offset-2">
                                        {data.location || ((data as any).latitude && (data as any).longitude ? `${(data as any).latitude}, ${(data as any).longitude}` : '-')}
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Stats section */}
                    <div className="lg:w-[45%] grid grid-cols-3 gap-3">
                        <div className="group relative bg-gradient-to-br from-[#F0F9F6] to-[#E2F5ED] rounded-xl p-4 border border-[#179678]/10 hover:border-[#179678]/30 hover:shadow-md transition-all duration-300 cursor-default">
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#179678]/10 flex items-center justify-center">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#179678" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>
                            </div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">พื้นที่</p>
                            <p className="text-2xl font-black text-[#034A30] leading-none">{farmAreaRai || '-'}</p>
                            <p className="text-xs text-gray-500 mt-1">ไร่</p>
                        </div>

                        <div className="group relative bg-gradient-to-br from-[#F0F9F6] to-[#E2F5ED] rounded-xl p-4 border border-[#179678]/10 hover:border-[#179678]/30 hover:shadow-md transition-all duration-300 cursor-default">
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#179678]/10 flex items-center justify-center">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#179678" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/></svg>
                            </div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">บ่อทั้งหมด</p>
                            <p className="text-2xl font-black text-[#034A30] leading-none">{data.pondCount || '-'}</p>
                            <p className="text-xs text-gray-500 mt-1">บ่อ</p>
                        </div>

                        <div className="group relative bg-gradient-to-br from-[#F0F9F6] to-[#E2F5ED] rounded-xl p-4 border border-[#179678]/10 hover:border-[#179678]/30 hover:shadow-md transition-all duration-300 cursor-default">
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#179678]/10 flex items-center justify-center">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#179678" strokeWidth="2.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                            </div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">ลงทะเบียน</p>
                            <p className="text-2xl font-black text-[#179678] leading-none">{registeredPondCount}</p>
                            <p className="text-xs text-gray-500 mt-1">บ่อ</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FarmerInfoCard;