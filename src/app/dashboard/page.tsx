'use client';

import React, { useState, useEffect } from "react";
import { dashboardAPI } from "@/services/api/dashboard";

import DashboardFilter from "../../components/dashboard/DashboardFilter";
import StatCards from "../../components/dashboard/StatCards";
import GrowthChart from "../../components/dashboard/GrowthChart";
import FeedingChart from "../../components/dashboard/FeedingChart";
import WaterQualityTable from "../../components/dashboard/WaterQualityTable";
import GrowthTable from "../../components/dashboard/GrowthTable";

import GroupIcon from "../../assets/Group.svg";
import FishIcon from "../../assets/db-fish.svg";
import WeightIcon from "../../assets/db-weight.svg";



// Mapping Helper for Stat Cards
const mapStatsToCards = (stats: any) => {
  if (!stats) return { items: [] };

  return {
    items: [
      { title: "จำนวนฟาร์มทั้งหมด", value: stats.totalFarms?.toLocaleString() || "0", unit: "ฟาร์ม", bgColor: "#D4EAFF" },
      { title: "จำนวนบ่อเลี้ยงทั้งหมด", value: stats.totalPonds?.toLocaleString() || "0", unit: "บ่อ", bgColor: "#D7F9FF" },
      { title: "จำนวนปลาทั้งหมด", value: stats.totalFish?.toLocaleString() || "0", unit: "ตัว", bgColor: "#E2F6F0", titleColor: "#0F614E", valueColor: "#0F614E", icon: FishIcon },
      { title: "ปริมาณอาหารรวม", value: stats.totalFeed?.toLocaleString() || "0", unit: "kg.", bgColor: "#FFF4DD", titleColor: "#856404", valueColor: "#856404", icon: WeightIcon },
    ]
  };
};

const Dashboard = () => {
  const [selectedFarm, setSelectedFarm] = useState("small");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  const handleFarmSelect = (farmId: string) => {
    setSelectedFarm(farmId);
  };

  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const response = await dashboardAPI.get(selectedFarm); // Note: API currently doesn't support year param explicitly in standard get, may need update if we want to filter by year. Assuming backend defaults to current year or handles it.
        // For Admin, response.data contains the new structure
        setDashboardData(response);
      } catch (error) {
        console.error("Failed to fetch dashboard", error);
        setDashboardData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [selectedFarm, selectedYear]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  // Fallback for empty data
  const statsData = dashboardData?.stats ? mapStatsToCards(dashboardData.stats) : { items: [] };
  const feedingChartData = dashboardData?.feedingChart || [];
  const survivalChartData = dashboardData?.survivalChart || []; // Reusing GrowthComponent structure (name, value)
  // Need to map keys for Chart components if they expect specific keys (e.g. 'growth', 'food')
  // Backend returns { month, value }
  const mappedFeedingChart = feedingChartData.map((d: any) => ({ name: d.month, food: d.value }));
  const mappedSurvivalChart = survivalChartData.map((d: any) => ({ name: d.month, growth: d.value })); // Mapping 'value' to 'growth' prop key for reuse

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

        <StatCards data={statsData} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 mb-8">
          {/* Reuse GrowthChart for Survival Trend (Percent) */}
          {/* We might need to change title inside GrowthChart component or make it dynamic. For now, let's pass data. */}
          {/* Ideally we rename GrowthChart to LineChartGeneric */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-[#093832] mb-4">แนวโน้มอัตราการรอดชีวิต (%)</h3>
            <GrowthChart data={mappedSurvivalChart} unit="%" tooltipLabel="อัตราการรอดชีวิต" />
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-[#093832] mb-4">ปริมาณการใช้อาหาร (kg.)</h3>
            <FeedingChart data={mappedFeedingChart} unit="kg." tooltipLabel="ปริมาณอาหาร" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Ranking (formerly Water Quality) */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-[#093832] mb-4">5 อันดับฟาร์มที่มีการอัปเดตสม่ำเสมอ</h3>
            {/* Using WaterQualityTable component but passing ActiveRanking data. 
                 We need to Ensure props match or map them.
                 WaterQualityTable expects: { rank, farm, totalPonds, goodPonds, avgPh, lastUpdate }
                 Backend activeRanking returns matches: goodPonds = distinct entries count.
             */}
            <WaterQualityTable data={dashboardData?.activeRanking || []} />
          </div>

          {/* Survival Ranking */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-[#093832] mb-4">5 อันดับฟาร์มที่มีอัตราการรอดชีวิตสูง</h3>
            {/* GrowthTable expects: { rank, farm, pondCount, fishCount, survivalRate, deathRate, lastUpdate } 
                 Backend survivalRanking matches this.
             */}
            <GrowthTable data={dashboardData?.survivalRanking || []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;