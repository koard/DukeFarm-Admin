'use client';

import Image from 'next/image';

import CalendarIcon from '../../assets/solar_calendar.svg';
import TimeIcon from '../../assets/formkit_time.svg';
import TempIcon from '../../assets/fluent_temperature-b.svg';
import RainIcon from '../../assets/fluent_weather-b.svg';
import HumidityIcon from '../../assets/mdi_dots-triangle.svg';
import type { FarmerHistory } from './FarmerHistoryTable';

interface ViewFarmerHistoryProps {
    data: FarmerHistory;
    onClose: () => void;
}

const FARM_TYPE_MAP: Record<string, string> = {
    'SMALL': 'ปลาตุ้ม',
    'LARGE': 'ปลานิ้ว',
    'MARKET': 'ปลาตลาด',
    'small': 'ปลาตุ้ม',
    'large': 'ปลานิ้ว',
    'market': 'ปลาตลาด',
    'ALL': 'ทั้งหมด'
};

const ViewFarmerHistory = ({ data, onClose }: ViewFarmerHistoryProps) => {
    const dateStr = data?.date?.split(' - ')[0] || '-';
    const timeStr = data?.date?.split(' - ')[1] || '-';

    const formatNumber = (num?: number | string | null) => {
        if (num === null || num === undefined || num === '-') return '-';
        if (typeof num === 'string') return num;
        return num.toLocaleString();
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
            
            <h2 className="text-2xl font-bold mb-6 text-gray-900">รายละเอียด</h2>

            <div className="flex gap-4 mb-6">
                <div className="flex-1 bg-[#E4F5E7] rounded-lg px-4 py-3 flex items-center gap-3">
                    <Image src={CalendarIcon} alt="date" width={24} height={24} />
                    <span className="text-[#093832] text-lg font-medium">{dateStr}</span>
                </div>
                <div className="flex-1 bg-[#E4F5E7] rounded-lg px-4 py-3 flex items-center gap-3">
                    <Image src={TimeIcon} alt="time" width={24} height={24} />
                    <span className="text-[#093832] text-lg font-medium">{timeStr} น.</span>
                </div>
            </div>

            <div className="mb-6">
                <label className="text-base text-gray-900 mb-2 block font-medium">สภาพอากาศ Auto</label>
                <div className="grid grid-cols-3 gap-px bg-white overflow-hidden rounded-lg border border-gray-100">
                    <div className="bg-[#D8EFFF] p-3 flex flex-col items-center justify-center gap-1 rounded-l-lg mr-0.5">
                        <div className="flex items-center gap-1">
                            <Image src={TempIcon} alt="temp" width={16} height={16} />
                            <span className="text-sm text-gray-700">อุณหภูมิ</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">{data?.temp || '-'}</span>
                    </div>
                    <div className="bg-[#D8EFFF] p-3 flex flex-col items-center justify-center gap-1 mx-0.5">
                        <div className="flex items-center gap-1">
                            <Image src={RainIcon} alt="rain" width={16} height={16} />
                            <span className="text-sm text-gray-700">ปริมาณน้ำฝน</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">{data?.rain || '0'}</span>
                    </div>
                    <div className="bg-[#D8EFFF] p-3 flex flex-col items-center justify-center gap-1 rounded-r-lg ml-0.5">
                        <div className="flex items-center gap-1">
                            <Image src={HumidityIcon} alt="humidity" width={16} height={16} />
                            <span className="text-sm text-gray-700">ความชื้นสัมพัทธ์</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">{data?.humidity || '-'}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4 mb-8">
                
                <div>
                    <label className="text-lg text-gray-900 mb-2 block">ประเภทฟาร์ม</label>
                    <div className="w-full border border-gray-300 rounded-lg p-3 text-lg text-gray-700 bg-gray-50">
                        {data?.farmType ? (FARM_TYPE_MAP[data.farmType] || data.farmType) : '-'}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-lg text-gray-900 mb-2 block">จำนวนปลาที่ปล่อย (ตัว)</label>
                        <div className="w-full border border-gray-300 rounded-lg p-3 text-lg text-gray-700 bg-gray-50">
                            {formatNumber(data?.initialFishCount || data?.fishCount)}
                        </div>
                    </div>
                    <div>
                        <label className="text-lg text-gray-900 mb-2 block">จำนวนปลาที่เหลือ (ตัว)</label>
                        <div className="w-full border border-gray-300 rounded-lg p-3 text-lg text-gray-700 bg-gray-50">
                            {formatNumber(data?.remainingFishCount)}
                        </div>
                    </div>
                </div>

                <div>
                    <label className="text-lg text-gray-900 mb-2 block">ประเภทอาหาร</label>
                    <div className="w-full border border-gray-300 rounded-lg p-3 text-lg text-gray-700 bg-gray-50">
                        {data?.foodType || '-'}
                    </div>
                </div>

                <div>
                    <label className="text-lg text-gray-900 mb-2 block">ปริมาณอาหาร (กก.)</label>
                    <div className="w-full border border-gray-300 rounded-lg p-3 text-lg text-gray-700 bg-gray-50">
                        {(data?.foodAmountKg !== null && data?.foodAmountKg !== undefined) ? data.foodAmountKg : '-'}
                    </div>
                </div>

                <div>
                    <label className="text-lg text-gray-900 mb-2 block">การให้ยา</label>
                    <div className="w-full border border-gray-300 rounded-lg p-3 text-lg text-gray-700 bg-gray-50">
                        {data?.medicineGiven || '-'}
                    </div>
                </div>

            </div>

            <div>
                <button
                    onClick={onClose}
                    className="w-full py-3 px-4 rounded-lg border border-[#179678] text-[#179678] text-base font-medium hover:bg-green-50 transition-colors"
                >
                    ปิด
                </button>
            </div>
        </div>
    );
};

export default ViewFarmerHistory;