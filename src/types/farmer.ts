export type FarmTypeCode = string;

export interface FarmerListItem {
  id: string;
  rowNumber?: number;
  name: string;
  phone: string;
  farmType: string;
  farmTypes?: string[];
  farmAreaRai?: number | null;
  groupType: string;
  pondType?: string;
  pondCount?: number | null;
  location: string;
  registeredDate: string;
  registeredAtISO?: string;
  farmTypeCode?: FarmTypeCode;
  totalProductionCycles?: number;
}