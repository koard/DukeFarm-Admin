'use client';

import PlusIcon from '../../assets/rc-plus.svg';

interface AccessToolbarProps {
    onAddRoleClick: () => void;
}

const AccessToolbar = ({ onAddRoleClick }: AccessToolbarProps) => {
    return (
        <div className="flex justify-end w-full">
            <button
                onClick={onAddRoleClick}
                className="flex items-center justify-center gap-2 h-10 px-4 py-2 bg-[#0048FF] text-white rounded-md shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#179678]/50"
            >
                <img src={PlusIcon.src || PlusIcon} alt="add" className="w-5 h-5" />
                <span className="text-sm">เพิ่มสิทธิ์การเข้าถึง</span>
            </button>
        </div>
    );
};

export default AccessToolbar;