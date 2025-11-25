'use client';

import React, { useState } from "react";
import Image from "next/image";
import WeatherIcon from "../../assets/table-weather.svg";

interface GrowthTableRowData {
  rank: number;
  farm: string;
  pondCount: number;
  fishCount: number;
  survivalRate: number;
  deathRate: number;
  lastUpdate: string;
}

interface GrowthTableProps {
  data: GrowthTableRowData[];
}

const TableRow: React.FC<GrowthTableRowData> = ({
  rank,
  farm,
  pondCount,
  fishCount,
  survivalRate,
  deathRate,
  lastUpdate,
}) => (
  <tr className="text-sm text-gray-800">
    <td className="py-3 pr-4 whitespace-nowrap text-center text-[#0F614E]">
      {rank}
    </td>
    <td className="py-3 pr-4 whitespace-nowrap">{farm}</td>
    <td className="py-3 pr-4 whitespace-nowrap text-center">{pondCount}</td>
    <td className="py-3 pr-4 whitespace-nowrap text-center">{fishCount}</td>
    <td className="py-3 pr-4 whitespace-nowrap text-center text-[#008466]">
      {survivalRate}
    </td>
    <td className="py-3 pr-4 whitespace-nowrap text-center text-[#EB4D4D]">
      {deathRate}
    </td>
    <td className="py-3 pr-4 whitespace-nowrap text-center">{lastUpdate}</td>
  </tr>
);

function GrowthTable({ data }: GrowthTableProps) {
  if (!data) return null;

  const [isExpanded, setIsExpanded] = useState(false);

  const displayedData = isExpanded ? data : data.slice(0, 5);

  return (
    <div>
      <div className="flex items-center mb-4">
        <Image
          src={WeatherIcon}
          alt="Table Icon"
          width={24}
          height={24}
          className="w-6 h-6 mr-2"
        />
        <h2 className="text-lg font-semibold text-[#093832]">
          5 อันดับอัตราการรอดชีวิต
        </h2>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md mb-15">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse">
            <thead>
              <tr className="text-left text-sm font-medium border-b border-gray-200">
                <th className="pb-3 pr-4 whitespace-nowrap text-center">
                  อันดับ
                </th>
                <th className="pb-3 pr-4 whitespace-nowrap">ฟาร์ม</th>
                <th className="pb-3 pr-4 whitespace-nowrap text-center">
                  จำนวนบ่อ
                </th>
                <th className="pb-3 pr-4 whitespace-nowrap text-center">
                  จำนวนปลา(ตัว)
                </th>
                <th className="pb-3 pr-4 whitespace-nowrap text-center">
                  อัตราการรอดชีวิต (ตัว)
                </th>
                <th className="pb-3 pr-4 whitespace-nowrap text-center">
                  อัตราเสียชีวิต (ตัว)
                </th>
                <th className="pb-3 pr-4 whitespace-nowrap text-center">
                  วันที่อัปเดตข้อมูลล่าสุด
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedData.map((row) => (
                <TableRow key={row.rank} {...row} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center mt-4">
          {data.length > 5 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#0F614E] text-sm underline bg-transparent border-none cursor-pointer hover:text-[#093832]"
            >
              {isExpanded ? "ย่อกลับ" : "ดูทั้งหมด"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default GrowthTable;