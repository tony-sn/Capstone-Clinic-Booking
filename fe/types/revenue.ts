// types/revenue.ts

export type RevenueType = "Weekly" | "Monthly" | "Quartertly" | "Yearly";

export interface RevenueReport {
  id: number;
  revenueType: RevenueType;
  fromDate: string; // ISO date string
  toDate: string; // ISO date string
  revenueAmount: number;
  active: boolean;
}
