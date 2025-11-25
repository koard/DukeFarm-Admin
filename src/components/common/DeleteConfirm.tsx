'use client';

import Image from 'next/image';
import DeleteIcon from '../../assets/fm-delete.svg';

interface DeleteConfirmProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    itemName: string | null | undefined;
}

const DeleteConfirm = ({
    isOpen,      
    onClose,     
    onConfirm,   
    title,       
    itemName    
}: DeleteConfirmProps) => {

    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-[rgba(0,0,0,0.5)] p-4" 
        >
            <div 
                className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 pointer-events-auto" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col items-center text-center">
                    
                    <div className="flex items-center gap-3">
                        <Image 
                            src={DeleteIcon} 
                            alt="delete" 
                            width={24} 
                            height={24} 
                            className="w-6 h-6" 
                        />
                        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                    </div>

                    <p className="mt-4 text-base text-gray-600">
                        ต้องการลบข้อมูล “{itemName}” หรือไม่ ?
                    </p>

                    <div className="flex gap-4 mt-8 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-base font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-4 py-3 bg-red-600 border border-transparent rounded-lg text-base font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            ลบ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirm;