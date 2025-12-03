export type FarmTypeCode = 'NURSERY_SMALL' | 'NURSERY_LARGE' | 'GROWOUT';

export interface FarmerListItem {
  id: string; // userId from backend
  rowNumber?: number;
  name: string;
  phone: string;
  groupType: string;
  pondType?: string;
  pondCount?: number | null;
  location: string;
  registeredDate: string;
  registeredAtISO?: string;
  farmTypeCode?: FarmTypeCode;
}
