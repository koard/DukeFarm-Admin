'use client';

import Image from "next/image";

interface FarmSummaryData {
  title: string;
  value: string;
  unit: string;
  bgColor: string;
  valueColor?: string; 
  titleColor?: string; 
}

interface FishStatData {
  title: string;
  value: string;
  unit: string;
  icon: any;
  titleColor: string;
  valueColor: string;
}

interface StatCardsProps {
  data: {
    farmSummary: FarmSummaryData[];
    fishStats: FishStatData[];
  };
}

const SummaryCard = ({
  title,
  value,
  unit,
  bgColor,
  valueColor,
  titleColor,
}: FarmSummaryData) => {
  return (
    <div
      className="flex flex-col justify-between items-start p-4 rounded-2xl shadow-lg border border-gray-100 h-28 w-full"
      style={{ backgroundColor: bgColor }}
    >
      <h3 className="text-sm font-medium" style={{ color: titleColor }}>
        {title}
      </h3>
      <div className="flex flex-col flex-grow w-full justify-center items-center">
        <div className="flex items-baseline space-x-2 md:space-x-3">
          <p
            className="text-3xl font-bold leading-none"
            style={{ color: valueColor }}
          >
            {value}
          </p>
          <span className="text-lg font-medium" style={{ color: titleColor }}>
            {unit}
          </span>
        </div>
      </div>
    </div>
  );
};

const FishStatCard = ({
  title,
  value,
  unit,
  icon,
  titleColor,
  valueColor,
  isLast,
}: FishStatData & { isLast: boolean }) => {
  const dividerClass = isLast ? "" : "md:border-r border-gray-300";

  return (
    <div
      className={`flex flex-row md:flex-col items-center md:items-start justify-between md:justify-between w-full md:w-1/3 p-4 space-x-4 md:space-x-0 ${dividerClass}`}
    >
      <div className="flex items-center space-x-2 mb-0 md:mb-2">
        <Image
          src={icon}
          alt="Icon"
          width={20}
          height={20}
          className="w-5 h-5"
        />
        <h3 className="text-sm font-medium" style={{ color: titleColor }}>
          {title}
        </h3>
      </div>

      <div className="flex flex-col flex-grow w-full justify-center items-end md:items-center">
        <div className="flex items-baseline space-x-1">
          <p
            className="text-2xl md:text-3xl font-bold leading-none"
            style={{ color: valueColor }}
          >
            {value}
          </p>
          <span
            className="text-lg md:text-xl font-bold leading-none ms-1"
            style={{ color: valueColor }}
          >
            {unit}
          </span>
        </div>
      </div>
    </div>
  );
};

const StatCards = ({ data }: StatCardsProps) => {
  if (!data) return null;

  return (
    <div className="flex flex-col xl:flex-row gap-4 mb-10 mt-8">
      <div className="flex flex-row w-full xl:w-4/12 gap-2">
        {data.farmSummary.map((item, index) => (
          <SummaryCard key={index} {...item} />
        ))}
      </div>

      <div
        className="flex flex-col md:flex-row items-stretch justify-around p-2 rounded-xl shadow-lg border border-gray-100 w-full xl:w-8/12 space-y-2 md:space-y-0"
        style={{ backgroundColor: "#F4FFFC" }}
      >
        {data.fishStats.map((item, index) => (
          <FishStatCard
            key={index}
            {...item}
            isLast={index === data.fishStats.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default StatCards;