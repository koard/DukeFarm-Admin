'use client';

import React, { useState } from "react";
import Image from "next/image";
import WeatherIcon from "../../assets/table-weather.svg";

interface WaterQualityData {
  rank: number;
  farm: string;
  totalPonds: number;
  goodPonds: number;
  avgPh: number;
  lastUpdate: string;
}

interface WaterQualityTableProps {
  data: WaterQualityData[];
}

const TableRow = ({
  rank,
  farm,
  totalPonds,
  goodPonds,
  avgPh,
  lastUpdate,
}: WaterQualityData) => (
  <tr className="text-sm text-gray-800">
    <td className="py-3 pr-4 whitespace-nowrap text-[#0F614E] text-center">
      {rank}
    </td>
    <td className="py-3 pr-4 whitespace-nowrap text-[#0F614E] font-medium">
      {farm}
    </td>
    <td className="py-3 pr-4 whitespace-nowrap text-[#0F614E] text-center">
      {totalPonds}
    </td>
    <td className="py-3 pr-4 whitespace-nowrap text-[#0F614E] text-center">
      {goodPonds}
    </td>
    <td className="py-3 pr-4 whitespace-nowrap text-[#0F614E] text-center">
      {avgPh}
    </td>
    <td className="py-3 pr-4 whitespace-nowrap text-[#0F614E] text-center">
      {lastUpdate}
    </td>
  </tr>
);

function WaterQualityTable({ data }: WaterQualityTableProps) {
  if (!data) return null;

  const [isExpanded, setIsExpanded] = useState(false);

  const displayedData = isExpanded ? data : data.slice(0, 5);

  return (
    <div>
      <div className="flex items-center mb-4">
        <Image
          src={WeatherIcon}
          alt="Weather Icon"
          width={24}
          height={24}
          className="w-6 h-6 mr-2"
        />
        <h2 className="text-lg font-semibold text-[#093832]">
          5 อันดับฟาร์มคุณภาพน้ำดี
        </h2>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md mb-15">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] border-collapse">
            <thead>
              <tr className="text-left text-sm font-medium border-b border-gray-200">
                <th className="pb-3 pr-4 whitespace-nowrap text-center">
                  อันดับ
                </th>
                <th className="pb-3 pr-4 whitespace-nowrap">ฟาร์ม</th>
                <th className="pb-3 pr-4 whitespace-nowrap text-center">
                  จำนวนบ่อทั้งหมด
                </th>
                <th className="pb-3 pr-4 whitespace-nowrap text-center">
                  จำนวนบ่อคุณภาพดี
                </th>
                <th className="pb-3 pr-4 whitespace-nowrap text-center">
                  คุณภาพน้ำเฉลี่ย (pH.)
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

export default WaterQualityTable;