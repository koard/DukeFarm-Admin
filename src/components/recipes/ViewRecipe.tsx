'use client';

import { Recipe } from "../../app/recipes/page";

const FARM_TYPE_LABEL: Record<string, string> = {
    'SMALL': 'ปลาตุ้ม',
    'LARGE': 'ปลานิ้ว',
    'MARKET': 'ปลาตลาด'
};

const AGE_UNIT_LABEL: Record<string, string> = {
    DAY: 'วัน',
    DAYS: 'วัน',
    MONTH: 'เดือน',
    MONTHS: 'เดือน',

    day: 'วัน',
    days: 'วัน',
    month: 'เดือน',
    months: 'เดือน',
};

const normalizeFarmType = (value: string): string => {
    const upper = value?.toUpperCase?.() || '';
    if (upper === 'NURSERY_SMALL') return 'SMALL';
    if (upper === 'NURSERY_LARGE') return 'LARGE';
    if (upper === 'GROWOUT') return 'MARKET';
    return upper;
};

interface InfoDisplayProps {
    label: string;
    value: string | number | null | undefined;
}

const InfoDisplay = ({ label, value }: InfoDisplayProps) => (
    <div className="w-full mb-3">
        <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
        <p className="text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 p-2 rounded-md border border-gray-200 min-h-[40px]">
            {value || '-'}
        </p>
    </div>
);

interface ViewRecipeProps {
    onClose: () => void;
    initialData: Recipe;
}

const ViewRecipe = ({ onClose, initialData }: ViewRecipeProps) => {

    const rawFarmType = (initialData as any).farmType || (initialData as any).primaryFarmType || '';
    const normalizedType = normalizeFarmType(rawFarmType);
    const displayFarmType = FARM_TYPE_LABEL[normalizedType] || normalizedType || '-';

    const rawUnit = (initialData.ageUnit || '').toString();
    let displayUnit = AGE_UNIT_LABEL[rawUnit.toUpperCase()] || rawUnit || '';

    const rawAge = initialData?.ageRange || initialData?.targetStage || '-';

    if (rawAge.includes('วัน') || rawAge.includes('เดือน')) {
        displayUnit = '';
    }

    const ageDisplayWithUnit = rawAge !== '-'
        ? (displayUnit ? `${rawAge} ${displayUnit}` : rawAge)
        : '-';

    const displayData = {
        name: initialData?.name || '-',
        farmType: displayFarmType,
        ageDisplay: ageDisplayWithUnit,
        description: initialData?.description || '-',
        recommendations: initialData?.recommendations || '-',
    };

    return (
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 pointer-events-auto overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">รายละเอียดสูตรอาหาร</h2>

            <div className="space-y-4">
                <InfoDisplay
                    label="ชื่อสูตรอาหาร"
                    value={displayData.name}
                />

                <InfoDisplay
                    label="ประเภทกลุ่มการเลี้ยง"
                    value={displayData.farmType}
                />

                <InfoDisplay
                    label="ช่วงอายุการเลี้ยง"
                    value={displayData.ageDisplay}
                />

                <InfoDisplay
                    label="รายละเอียด"
                    value={displayData.description}
                />

                <InfoDisplay
                    label="คำแนะนำ"
                    value={displayData.recommendations}
                />

                <div className="flex justify-end mt-8 w-full pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 bg-[#179678] border border-transparent rounded-lg text-base font-semibold text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#179678]/50"
                    >
                        ปิด
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewRecipe;