'use client';

import React, { useState } from "react";
import Image from "next/image";

interface DashboardFilterProps {
  selectedFarm: string;
  handleFarmSelect: (farmId: string) => void;
  selectedYear: string;
  handleYearSelect: (year: string) => void;
  GroupIcon: any;
}

const DashboardFilter: React.FC<DashboardFilterProps> = ({
  selectedFarm,
  handleFarmSelect,
  selectedYear,
  handleYearSelect,
  GroupIcon,
}) => {
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

  const ACTIVE_FARM_BG = "bg-[#8FCAB5]";
  const ACTIVE_FARM_TEXT = "text-gray-800 font-semibold";
  const INACTIVE_FARM_BG = "bg-white";
  const INACTIVE_FARM_BORDER = "border border-gray-500";
  const YEAR_DROPDOWN_BG = "bg-[#179678]";
  const YEAR_DROPDOWN_HOVER = "hover:bg-[#128169]";

  const farmOptions = [
    { id: 'small', label: "ปลาตุ้ม" },
    { id: 'large', label: "ปลานิ้ว" },
    { id: 'market', label: "ปลาตลาด" },
  ];

  const yearOptions = ["2025", "2024", "2023", "2022"];

  return (
    <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {farmOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleFarmSelect(option.id)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap
              ${selectedFarm === option.id
                ? `${ACTIVE_FARM_BG} ${ACTIVE_FARM_TEXT} shadow-sm`
                : `${INACTIVE_FARM_BG} ${INACTIVE_FARM_BORDER} text-gray-700 hover:bg-gray-100`
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <button
          onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
          className={`flex items-center justify-between w-full px-6 py-2 rounded-full text-sm transition-all duration-150 text-white font-medium ${YEAR_DROPDOWN_BG} ${YEAR_DROPDOWN_HOVER}`}
        >
          <span className="flex-1 text-center">{selectedYear}</span>
          {GroupIcon && (
            <Image
              src={GroupIcon}
              alt="Dropdown Arrow"
              width={16}
              height={16}
              className={`ml-2 w-4 h-4 transition-transform duration-200 ${isYearDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
            />
          )}
        </button>

        {isYearDropdownOpen && (
          <div className="absolute right-0 mt-2 w-24 rounded-lg shadow-xl overflow-hidden bg-white z-30 border border-gray-200">
            {yearOptions.map((year) => (
              <button
                key={year}
                onClick={() => {
                  handleYearSelect(year);
                  setIsYearDropdownOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${year === selectedYear
                    ? "bg-gray-200 text-gray-900 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {year}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardFilter;