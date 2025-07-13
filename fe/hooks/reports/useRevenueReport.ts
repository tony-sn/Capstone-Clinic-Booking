import { useQuery } from "@tanstack/react-query";
import { getRevenueReportsByType } from "@/lib/api/revenue-report.actions";
import { RevenueType } from "@/types/revenue";

export const useRevenueReports = (type: RevenueType) => {
  return useQuery({
    queryKey: ["revenue-reports", type],
    queryFn: () => getRevenueReportsByType(type),
    enabled: !!type,
  });
};
