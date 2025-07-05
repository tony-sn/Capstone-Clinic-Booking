import { useQuery } from "@tanstack/react-query";
import { getAllMedicalHistory, getMedicalHistoryReport } from "@/lib/api/laboratory-test-report.actions";
import { LaboratoryTestReportResult } from "@/types/laboratoryTestReport";

// Simple hook - get all reports with optional filter
export const useMedicalHistoryReports = (result: string | null = null) =>
    useQuery({
        queryKey: ["medicalHistoryReports", result],
        queryFn: () => getAllMedicalHistory({
            PageSize: 0, // Get all
            PageNumber: 1,
            Result: result
        }),
    });
export const useMedicalHistoryReport = (
    medicalHistoryId: number,
    laboratoryTestId: number,
    enabled: boolean = true
) =>
    useQuery({
        queryKey: ["medicalHistoryReport", medicalHistoryId, laboratoryTestId],
        queryFn: () => getMedicalHistoryReport(medicalHistoryId, laboratoryTestId),
        enabled: enabled && medicalHistoryId > 0 && laboratoryTestId > 0,
    });