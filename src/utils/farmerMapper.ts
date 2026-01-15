import type { Farmer as FarmerApiResponse } from '@/services/api/farmers';
import type { FarmerListItem } from '@/types/farmer';

const FARM_TYPE_LABELS: Record<string, string> = {
  SMALL: 'ปลาตุ้ม',
  LARGE: 'ปลานิ้ว',
  MARKET: 'ปลาตลาด',

  NURSERY_SMALL: 'กลุ่มอนุบาลขนาดเล็ก',
  NURSERY_LARGE: 'กลุ่มอนุบาลขนาดใหญ่',
  GROWOUT: 'กลุ่มผู้เลี้ยงขนาดตลาด',
};

const formatRegisteredDate = (isoString: string | null | undefined) => {
  if (!isoString) return '-';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '-';
  const datePart = date.toLocaleDateString('th-TH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const timePart = date.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${datePart} - ${timePart}`;
};

const formatCoordinates = (latitude?: number | null, longitude?: number | null) => {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return '-';
  }
  return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
};

export const mapFarmerResponse = (farmer: FarmerApiResponse): FarmerListItem => ({
  id: farmer.userId,
  rowNumber: farmer.no,
  name: farmer.fullName || '-',
  phone: farmer.phone || '-',
  farmType: farmer.farmType,
  farmTypes: farmer.farmTypes || [], 
  farmAreaRai: farmer.farmAreaRai,
  groupType: FARM_TYPE_LABELS[farmer.farmType] || farmer.farmType,


  pondType: 'ไม่ระบุ', 
  pondCount: typeof farmer.pondCount === 'number' ? farmer.pondCount : null,
  location: formatCoordinates(farmer.latitude, farmer.longitude),
  registeredDate: formatRegisteredDate(farmer.registeredAt),
  registeredAtISO: farmer.registeredAt,
});