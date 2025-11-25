'use client';

import React, { useState } from "react";

import DashboardFilter from "../../components/dashboard/DashboardFilter";
import StatCards from "../../components/dashboard/StatCards";
import GrowthChart from "../../components/dashboard/GrowthChart";
import FeedingChart from "../../components/dashboard/FeedingChart";
import WaterQualityTable from "../../components/dashboard/WaterQualityTable";
import GrowthTable from "../../components/dashboard/GrowthTable";

import GroupIcon from "../../assets/Group.svg"; 
import FishIcon from "../../assets/db-fish.svg";
import WeightIcon from "../../assets/db-weight.svg";

const MOCK_DB_2025: any = {
  small: {
    stats: {
      farmSummary: [
        { title: "จำนวนฟาร์มทั้งหมด", value: "30", unit: "ฟาร์ม", bgColor: "#D4EAFF" },
        { title: "จำนวนบ่อเลี้ยงทั้งหมด", value: "59", unit: "บ่อ", bgColor: "#D7F9FF" },
      ],
      fishStats: [
        { title: "จำนวนปลาทั้งหมด", value: "1,256", unit: "ตัว", icon: FishIcon, titleColor: "#0F614E", valueColor: "#0F614E" },
        { title: "อายุปลาเฉลี่ย (วัน)", value: "96", unit: "วัน", icon: FishIcon, titleColor: "#0F614E", valueColor: "#0F614E" },
        { title: "น้ำหนักเฉลี่ย (kg.)", value: "0.7", unit: "kg.", icon: WeightIcon, titleColor: "#0F614E", valueColor: "#0F614E" },
      ],
    },
    growthChart: [
      { name: "Jan", growth: 0.55 }, { name: "Feb", growth: 0.6 }, { name: "Mar", growth: 0.9 },
      { name: "Apr", growth: 1.3 }, { name: "May", growth: 1.0 }, { name: "Jun", growth: 1.05 },
      { name: "Jul", growth: 1.0 }, { name: "Aug", growth: 0.95 }, { name: "Sep", growth: 0.9 },
      { name: "Oct", growth: 1.0 }, { name: "Nov", growth: 0.8 }, { name: "Dec", growth: 0.7 },
    ],
    feedingChart: [
      { name: "Jan", food: 0.8 }, { name: "Feb", food: 0.3 }, { name: "Mar", food: 0.85 },
      { name: "Apr", food: 0.5 }, { name: "May", food: 1.2 }, { name: "Jun", food: 0.7 },
      { name: "Jul", food: 0.5 }, { name: "Aug", food: 0.25 }, { name: "Sep", food: 0.7 },
      { name: "Oct", food: 0.5 }, { name: "Nov", food: 0.25 }, { name: "Dec", food: 0.7 },
    ],
    growthTable: [
      { rank: 1, farm: "อรพินธ์ นาดี", pondCount: 6, fishCount: 258, survivalRate: 250, deathRate: 8, lastUpdate: "17/05/25" },
      { rank: 2, farm: "สมปอง มองการไกล", pondCount: 7, fishCount: 220, survivalRate: 210, deathRate: 10, lastUpdate: "18/05/25" },
      { rank: 3, farm: "สมหมาย มีดี", pondCount: 4, fishCount: 144, survivalRate: 124, deathRate: 20, lastUpdate: "19/05/25" },
      { rank: 4, farm: "มานี มีสุข", pondCount: 12, fishCount: 259, survivalRate: 230, deathRate: 29, lastUpdate: "20/05/25" },
      { rank: 5, farm: "แก้วตา นาวา", pondCount: 10, fishCount: 150, survivalRate: 120, deathRate: 30, lastUpdate: "21/05/25" },
      { rank: 6, farm: "แก้วตา นาวา", pondCount: 10, fishCount: 150, survivalRate: 120, deathRate: 30, lastUpdate: "21/05/25" },
    ],
    waterQualityTable: [
      { rank: 1, farm: "อรพินธ์ นาดี", totalPonds: 6, goodPonds: 6, avgPh: 7, lastUpdate: "17/05/25" },
      { rank: 2, farm: "สมปอง มองการไกล", totalPonds: 7, goodPonds: 6, avgPh: 7, lastUpdate: "18/05/25" },
      { rank: 3, farm: "สมหมาย มีดี", totalPonds: 4, goodPonds: 3, avgPh: 7, lastUpdate: "19/05/25" },
      { rank: 4, farm: "มานี มีสุข", totalPonds: 12, goodPonds: 10, avgPh: 7, lastUpdate: "20/05/25" },
      { rank: 5, farm: "แก้วตา นาวา", totalPonds: 10, goodPonds: 8, avgPh: 7, lastUpdate: "21/05/25" },
      { rank: 6, farm: "แก้วตา นาวา", totalPonds: 10, goodPonds: 8, avgPh: 7, lastUpdate: "21/05/25" },
    ]
  },
  large: {
    stats: {
      farmSummary: [
        { title: "จำนวนฟาร์มทั้งหมด", value: "12", unit: "ฟาร์ม", bgColor: "#D4EAFF" },
        { title: "จำนวนบ่อเลี้ยงทั้งหมด", value: "48", unit: "บ่อ", bgColor: "#D7F9FF" },
      ],
      fishStats: [
        { title: "จำนวนปลาทั้งหมด", value: "5,600", unit: "ตัว", icon: FishIcon, titleColor: "#0F614E", valueColor: "#0F614E" },
        { title: "อายุปลาเฉลี่ย (วัน)", value: "45", unit: "วัน", icon: FishIcon, titleColor: "#0F614E", valueColor: "#0F614E" },
        { title: "น้ำหนักเฉลี่ย (kg.)", value: "1.2", unit: "kg.", icon: WeightIcon, titleColor: "#0F614E", valueColor: "#0F614E" },
      ],
    },
    growthChart: [
      { name: "Jan", growth: 1.5 }, { name: "Feb", growth: 1.6 }, { name: "Mar", growth: 1.9 },
      { name: "Apr", growth: 2.3 }, { name: "May", growth: 2.0 }, { name: "Jun", growth: 2.5 },
      { name: "Jul", growth: 2.8 }, { name: "Aug", growth: 3.0 }, { name: "Sep", growth: 3.2 },
      { name: "Oct", growth: 3.5 }, { name: "Nov", growth: 3.8 }, { name: "Dec", growth: 4.0 },
    ],
    feedingChart: [
      { name: "Jan", food: 2.8 }, { name: "Feb", food: 3.0 }, { name: "Mar", food: 3.5 },
      { name: "Apr", food: 4.5 }, { name: "May", food: 5.2 }, { name: "Jun", food: 4.7 },
      { name: "Jul", food: 4.5 }, { name: "Aug", food: 4.2 }, { name: "Sep", food: 4.7 },
      { name: "Oct", food: 4.5 }, { name: "Nov", food: 4.2 }, { name: "Dec", food: 4.7 },
    ],
    growthTable: [
      { rank: 1, farm: "บิ๊กฟาร์ม จำกัด", pondCount: 20, fishCount: 1500, survivalRate: 1450, deathRate: 50, lastUpdate: "17/05/25" },
      { rank: 2, farm: "มหาชน เลี้ยงปลา", pondCount: 18, fishCount: 1200, survivalRate: 1100, deathRate: 100, lastUpdate: "18/05/25" },
    ],
    waterQualityTable: [
      { rank: 1, farm: "บิ๊กฟาร์ม จำกัด", totalPonds: 20, goodPonds: 19, avgPh: 7.2, lastUpdate: "17/05/25" },
      { rank: 2, farm: "มหาชน เลี้ยงปลา", totalPonds: 18, goodPonds: 15, avgPh: 6.9, lastUpdate: "18/05/25" },
    ]
  },
  market: {
    stats: {
      farmSummary: [
        { title: "จำนวนฟาร์มทั้งหมด", value: "5", unit: "ฟาร์ม", bgColor: "#D4EAFF" },
        { title: "จำนวนบ่อเลี้ยงทั้งหมด", value: "20", unit: "บ่อ", bgColor: "#D7F9FF" },
      ],
      fishStats: [
        { title: "จำนวนปลาทั้งหมด", value: "8,900", unit: "ตัว", icon: FishIcon, titleColor: "#0F614E", valueColor: "#0F614E" },
        { title: "อายุปลาเฉลี่ย (วัน)", value: "120", unit: "วัน", icon: FishIcon, titleColor: "#0F614E", valueColor: "#0F614E" },
        { title: "น้ำหนักเฉลี่ย (kg.)", value: "2.8", unit: "kg.", icon: WeightIcon, titleColor: "#0F614E", valueColor: "#0F614E" },
      ],
    },
    growthChart: [
      { name: "Jan", growth: 3.5 }, { name: "Feb", growth: 4.0 }, { name: "Mar", growth: 4.5 },
      { name: "Apr", growth: 5.0 }, { name: "May", growth: 5.5 }, { name: "Jun", growth: 6.0 },
      { name: "Jul", growth: 6.5 }, { name: "Aug", growth: 7.0 }, { name: "Sep", growth: 7.5 },
      { name: "Oct", growth: 8.0 }, { name: "Nov", growth: 8.5 }, { name: "Dec", growth: 9.0 },
    ],
    feedingChart: [
      { name: "Jan", food: 10 }, { name: "Feb", food: 12 }, { name: "Mar", food: 11 },
      { name: "Apr", food: 14 }, { name: "May", food: 18 }, { name: "Jun", food: 16 },
      { name: "Jul", food: 15 }, { name: "Aug", food: 14 }, { name: "Sep", food: 16 },
      { name: "Oct", food: 15 }, { name: "Nov", food: 12 }, { name: "Dec", food: 14 },
    ],
    growthTable: [
      { rank: 1, farm: "ตลาดไท ฟิชชิ่ง", pondCount: 50, fishCount: 5000, survivalRate: 4900, deathRate: 100, lastUpdate: "17/05/25" },
      { rank: 2, farm: "เจ๊แดง ปลาสด", pondCount: 40, fishCount: 4000, survivalRate: 3800, deathRate: 200, lastUpdate: "18/05/25" },
    ],
    waterQualityTable: [
      { rank: 1, farm: "ตลาดไท ฟิชชิ่ง", totalPonds: 50, goodPonds: 48, avgPh: 7.5, lastUpdate: "17/05/25" },
      { rank: 2, farm: "เจ๊แดง ปลาสด", totalPonds: 40, goodPonds: 35, avgPh: 7.4, lastUpdate: "18/05/25" },
    ]
  }
};

const MOCK_DB_HISTORY: any = {
  stats: {
    farmSummary: [
      { title: "จำนวนฟาร์มทั้งหมด", value: "0", unit: "ฟาร์ม", bgColor: "#EFEFEF" },
      { title: "จำนวนบ่อเลี้ยงทั้งหมด", value: "0", unit: "บ่อ", bgColor: "#EFEFEF" },
    ],
    fishStats: [
      { title: "จำนวนปลาทั้งหมด", value: "-", unit: "ตัว", icon: FishIcon, titleColor: "#666", valueColor: "#666" },
      { title: "อายุปลาเฉลี่ย (วัน)", value: "-", unit: "วัน", icon: FishIcon, titleColor: "#666", valueColor: "#666" },
      { title: "น้ำหนักเฉลี่ย (kg.)", value: "-", unit: "kg.", icon: WeightIcon, titleColor: "#666", valueColor: "#666" },
    ],
  },
  growthChart: [],
  feedingChart: [],
  growthTable: [],
  waterQualityTable: []
};

const Dashboard = () => {
  const [selectedFarm, setSelectedFarm] = useState("small");
  const [selectedYear, setSelectedYear] = useState("2025");

  const handleFarmSelect = (farmId: string) => {
    setSelectedFarm(farmId);
  };

  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
  };

  const currentData = selectedYear === "2025" 
    ? MOCK_DB_2025[selectedFarm] 
    : MOCK_DB_HISTORY;

  return (
    <div className="min-h-screen bg-gray-50">
      <header
        className={`h-16 flex justify-between items-center px-5 text-white mb-2 bg-[#034A30] sticky top-0 z-20 shadow-md pl-16 lg:pl-5`}
      >
        <h1 className="text-xl ms-2">Dashboard</h1>
        <div className="flex items-center space-x-3 text-sm">
          <span className="text-xl me-2">Admin</span>
        </div>
      </header>

      <div className="p-4 md:p-6 w-full overflow-x-hidden">
        <DashboardFilter
          selectedFarm={selectedFarm}
          handleFarmSelect={handleFarmSelect}
          selectedYear={selectedYear}
          handleYearSelect={handleYearSelect}
          GroupIcon={GroupIcon}
        />

        {currentData.stats && <StatCards data={currentData.stats} />}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 mb-8">
          {currentData.growthChart && <GrowthChart data={currentData.growthChart} />}
          {currentData.feedingChart && <FeedingChart data={currentData.feedingChart} />}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {currentData.waterQualityTable && <WaterQualityTable data={currentData.waterQualityTable} />}
          {currentData.growthTable && <GrowthTable data={currentData.growthTable} />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;