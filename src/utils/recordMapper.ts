import { FarmerHistory } from "@/components/farmers/FarmerHistoryTable";
import { FarmerDetailEntry } from "@/services/api/farmers";
import { RecordResponse } from "@/services/api/records";
import dayjs from 'dayjs';
import 'dayjs/locale/th';

type RecordInput = FarmerDetailEntry | RecordResponse;

export const mapRecordToHistory = (record: RecordInput): FarmerHistory => {
  // Use indexed access for fields that differ between the two types
  const r = record as Record<string, unknown>;

  const rawWeight = (r.fishAverageWeight ?? r.averageFishWeightGr) as number | null | undefined;
  const weightValue =
    rawWeight !== null && rawWeight !== undefined
      ? parseFloat(Number(rawWeight).toFixed(2))
      : 0;

  return {
    id: record.id,
    date: dayjs(record.recordedAt).locale('th').format('DD/MM/YYYY - HH:mm'),

    farmType: record.farmType,
    fishAgeDays: record.fishAgeDays,

    age: (record.fishAgeLabel || `${record.fishAgeDays} วัน`) as string,
    weight: weightValue,

    initialFishCount: (r.fishReleased as number) ?? '-',
    remainingFishCount: (r.fishRemaining as number) ?? '-',
    foodType: ((r.feedFormulaName as string) || '-'),
    medicineGiven: ((r.medicineName as string) || '-'),

    pondType: record.pondType === 'EARTHEN' ? 'บ่อดิน' : record.pondType === 'CONCRETE' ? 'บ่อปูน' : record.pondType,

    pondCount: record.pondCount ?? '-',
    fishCount: ((r.fishCountText as string) || (r.fishCount as number)?.toString() || '-'),

    foodAmountKg: record.foodAmountKg,

    temp: (record.weatherTemperatureC !== null && record.weatherTemperatureC !== undefined)
      ? `${record.weatherTemperatureC} °C`
      : '-',
    rain: record.weatherRainMm ?? 0,
    humidity: record.weatherHumidityPct ?? 0,
  };
};