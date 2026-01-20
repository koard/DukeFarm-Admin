'use client';

import Image from "next/image";

interface StatItem {
  title: string;
  value: string;
  unit: string;
  icon?: any;
  bgColor?: string; // For explicit bg
  titleColor?: string;
  valueColor?: string;
}

interface StatCardsProps {
  data: {
    // We can support the old structure or a new one.
    // Let's support a generic list for flexibility
    items: StatItem[];
  };
}

const StatCard = ({
  title,
  value,
  unit,
  bgColor = "#FFFFFF",
  titleColor = "#093832",
  valueColor = "#093832",
  icon
}: StatItem) => {
  return (
    <div
      className="flex flex-col justify-between p-5 rounded-2xl shadow-sm border border-gray-100 h-32 w-full relative overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex justify-between items-start z-10">
        <h3 className="text-sm font-medium" style={{ color: titleColor }}>
          {title}
        </h3>
        {icon && (
          <div className="opacity-80">
            <Image src={icon} alt={title} width={24} height={24} />
          </div>
        )}
      </div>

      <div className="flex items-baseline space-x-2 z-10 mt-2">
        <p
          className="text-3xl font-bold leading-none"
          style={{ color: valueColor }}
        >
          {value}
        </p>
        <span className="text-sm font-medium opacity-80" style={{ color: valueColor }}>
          {unit}
        </span>
      </div>
    </div>
  );
};

const StatCards = ({ data }: StatCardsProps) => {
  if (!data || !data.items) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8 mt-6">
      {data.items.map((item, index) => (
        <StatCard key={index} {...item} />
      ))}
    </div>
  );
};

export default StatCards;