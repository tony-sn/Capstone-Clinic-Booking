"use server";

import { Endpoints } from "@/lib/app.config";

export const getRevenueReportsByType = async (
  type: "Monthly" | "Weekly" | "Quartertly" | "Yearly",
  pageNumber = 1,
  pageSize = 100
) => {
  const res = await fetch(
    `${Endpoints.REVENUE_REPORT}/filter?type=${type}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch revenue reports");
  }

  return res.json();
};
