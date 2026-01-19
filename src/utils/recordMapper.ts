import { FarmerHistory } from "@/components/farmers/FarmerHistoryTable"; 
import { FarmerEntry } from "@/services/api/farmers"; 
import dayjs from 'dayjs';
import 'dayjs/locale/th';

export const mapRecordToHistory = (record: FarmerEntry): FarmerHistory => {
  const r = record as any;

  const rawWeight = r.fishAverageWeight ?? r.averageFishWeightGr;
  const weightValue =
    rawWeight !== null && rawWeight !== undefined
      ? parseFloat(Number(rawWeight).toFixed(2))
      : 0;

  return {
    id: r.id,
    date: dayjs(r.recordedAt).locale('th').format('DD/MM/YYYY - HH:mm'),
    age: r.fishAgeLabel || `${r.fishAgeDays} วัน`,
    weight: weightValue,

    pondType: r.pondType === 'EARTH' ? 'บ่อดิน'
             : r.pondType === 'CONCRETE' ? 'บ่อปูน'
             : r.pondType,

    pondCount: r.pondCount ?? '-',
    fishCount: r.fishCountText || r.fishCount?.toString() || '-',

    foodAmountKg: r.foodAmountKg,

    temp: r.weatherTemperatureC !== null ? `${r.weatherTemperatureC} °C` : '-',
    rain: r.weatherRainMm ?? 0,
    humidity: r.weatherHumidityPct ?? 0,
  };
};
