'use client';

import { Recipe } from "../../app/recipes/page"; 

const FARM_TYPE_LABEL: Record<string, string> = {
    'SMALL': 'ปลาตุ้ม',
    'LARGE': 'ปลานิ้ว',
    'MARKET': 'ปลาตลาด'
};

const FOOD_TYPE_LABEL: Record<string, string> = {
    'FRESH': 'อาหารสด',
    'PELLET': 'อาหารเม็ด',
    'SUPPLEMENT': 'อาหารเสริม',
};

interface InfoDisplayItemProps {
    label: string;
    value: string | number | null | undefined;
}

const InfoDisplay = ({ label, value }: InfoDisplayItemProps) => (
    <div className="w-full mb-3">
        <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
        <div className="text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 p-3 rounded-md border border-gray-200 min-h-[42px] flex items-center">
            {value || '-'} 
        </div>
    </div>
);

interface ViewRecipeProps {
    onClose: () => void;
    initialData: Recipe; 
}

const ViewRecipe = ({ onClose, initialData }: ViewRecipeProps) => { 

    const rawFarmType = (initialData as any).farmType || (initialData as any).primaryFarmType || '';
    const displayFarmType = FARM_TYPE_LABEL[rawFarmType?.toUpperCase()] || rawFarmType || '-';

    const rawFoodType = initialData.foodType || '';
    const displayFoodType = FOOD_TYPE_LABEL[rawFoodType?.toUpperCase()] || rawFoodType || '-';

    const rawStage = initialData.targetStage || initialData.ageRange || '-';
    
    const displayData = {
        name: initialData?.name || '-',
        farmType: displayFarmType,
        foodType: displayFoodType,
        targetStage: rawStage, 
        nutrients: initialData?.ingredients || '-', 
        usage: initialData?.instruction || '-',     
        recommendations: initialData?.recommendations || '-',
    };

    return (
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 pointer-events-auto overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">รายละเอียดสูตรอาหาร</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="space-y-4">
                <InfoDisplay 
                    label="ชื่อสูตรอาหาร" 
                    value={displayData.name}
                />

                <div className="grid grid-cols-2 gap-4">
                    <InfoDisplay 
                        label="ประเภทอาหาร" 
                        value={displayData.foodType}
                    />
                    <InfoDisplay 
                        label="กลุ่มการเลี้ยง" 
                        value={displayData.farmType}
                    />
                </div>

                <InfoDisplay 
                    label="ขนาด/ช่วงวัยที่แนะนำ" 
                    value={displayData.targetStage} 
                />

                <InfoDisplay 
                    label="ข้อมูลโภชนาการ" 
                    value={displayData.nutrients}
                />
                
                <InfoDisplay 
                    label="วิธีการใช้" 
                    value={displayData.usage}
                />
                
                <InfoDisplay 
                    label="คำแนะนำ" 
                    value={displayData.recommendations}
                />

                <div className="flex justify-end mt-8 w-full pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 bg-[#179678] border border-transparent rounded-lg text-base font-semibold text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#179678]/50 transition-all"
                    >
                        ปิด
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewRecipe; 