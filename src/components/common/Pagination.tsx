'use client';

import Image from 'next/image';
import DownArrowIcon from '../../assets/fm-down.svg';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (newSize: number) => void;
}

const Pagination = ({ 
    currentPage = 1, 
    totalPages = 1, 
    totalItems = 0, 
    itemsPerPage = 10, 
    onPageChange,
    onItemsPerPageChange 
}: PaginationProps) => {
    
    const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;
        const halfPages = Math.floor(maxPagesToShow / 2);
        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
        } else {
            let startPage = currentPage - halfPages;
            let endPage = currentPage + halfPages;
            if (startPage < 1) {
                endPage += Math.abs(startPage) + 1;
                startPage = 1;
            }
            if (endPage > totalPages) {
                startPage -= (endPage - totalPages);
                endPage = totalPages;
            }
            if (startPage < 1) startPage = 1;
            for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
        }
        return pageNumbers;
    };

    const pageNumbers = getPageNumbers();
    
    const activePageClass = 'bg-[#009D64] text-white';
    const inactivePageClass = 'bg-white text-gray-700 hover:bg-gray-100';
    const arrowClass = 'px-2 py-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed';

    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-700 mt-6 mb-15">
            
            <div className="flex items-center gap-2">
                <div className="relative h-9">
                    <select 
                        className="appearance-none h-full border border-gray-400 rounded-md px-3 pr-8 focus:outline-none focus:border-[#034A30]"
                        value={itemsPerPage}
                        onChange={(e) => { 
                            const newSize = Number(e.target.value);
                            if (onItemsPerPageChange) onItemsPerPageChange(newSize);
                        }}
                    >
                        <option value={10}>10 / page</option>
                        <option value={20}>20 / page</option>
                        <option value={50}>50 / page</option>
                    </select>
                    <Image 
                        src={DownArrowIcon} 
                        alt="arrow" 
                        width={16} 
                        height={16} 
                        className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" 
                    />
                </div>
                <span>รายการต่อหน้า</span>
            </div>

            <div className="font-medium text-gray-700">
                {`${startItem}-${endItem} จาก ${totalItems} รายการ`}
            </div>

            <div className="flex items-center gap-1">
                <button 
                    className={arrowClass} 
                    disabled={currentPage === 1}
                    onClick={() => onPageChange && onPageChange(currentPage - 1)}
                >
                    {"<"}
                </button>
                {pageNumbers.map(number => (
                    <button 
                        key={number}
                        className={`px-3 py-1 rounded-md font-semibold transition-colors ${currentPage === number ? activePageClass : inactivePageClass}`}
                        onClick={() => onPageChange && onPageChange(number)}
                    >
                        {number}
                    </button>
                ))}
                <button 
                    className={arrowClass} 
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange && onPageChange(currentPage + 1)}
                 >
                    {">"}
                </button>
            </div>
        </div>
    );
};

export default Pagination;