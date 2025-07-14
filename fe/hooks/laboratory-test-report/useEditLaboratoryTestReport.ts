// hooks/laboratory-test-report/useLaboratory-test-report.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    getAllMedicalHistory,
    getMedicalHistoryReport,
    createLaboratoryTestReport,
    updateLaboratoryTestReport,
    deleteLaboratoryTestReport
} from "@/lib/api/laboratory-test-report.actions";
import {
    LaboratoryTestReportQueryParam,
    CreateLaboratoryTestReportRequest,
    UpdateLaboratoryTestReportRequest
} from "@/types/laboratoryTestReport";

// Query Keys
export const LAB_TEST_REPORT_KEYS = {
    all: ['laboratory-test-reports'] as const,
    lists: () => [...LAB_TEST_REPORT_KEYS.all, 'list'] as const,
    list: (params: LaboratoryTestReportQueryParam) =>
        [...LAB_TEST_REPORT_KEYS.lists(), params] as const,
    details: () => [...LAB_TEST_REPORT_KEYS.all, 'detail'] as const,
    detail: (medicalHistoryId: number, laboratoryTestId: number) =>
        [...LAB_TEST_REPORT_KEYS.details(), medicalHistoryId, laboratoryTestId] as const,
};

// GET ALL REPORTS - Hook
export const useMedicalHistoryReports = (
    params?: Partial<LaboratoryTestReportQueryParam>
) => {
    const queryParams: LaboratoryTestReportQueryParam = {
        PageSize: 0,
        PageNumber: 1,
        Result: null,
        ...params
    };

    return useQuery({
        queryKey: LAB_TEST_REPORT_KEYS.list(queryParams),
        queryFn: () => getAllMedicalHistory(queryParams),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
};

// GET SINGLE REPORT - Hook
export const useMedicalHistoryReport = (
    medicalHistoryId: number,
    laboratoryTestId: number,
    enabled: boolean = true
) => {
    return useQuery({
        queryKey: LAB_TEST_REPORT_KEYS.detail(medicalHistoryId, laboratoryTestId),
        queryFn: () => getMedicalHistoryReport(medicalHistoryId, laboratoryTestId),
        enabled: enabled && medicalHistoryId > 0 && laboratoryTestId > 0,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};

// CREATE REPORT - Hook
export const useCreateLaboratoryTestReport = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createLaboratoryTestReport,
        onSuccess: (result) => {
            if (result.success) {
                // Invalidate and refetch reports list
                queryClient.invalidateQueries({
                    queryKey: LAB_TEST_REPORT_KEYS.lists()
                });

                // Optionally set the new data in cache
                if (result.data) {
                    queryClient.setQueryData(
                        LAB_TEST_REPORT_KEYS.detail(
                            result.data.medicalHistoryId,
                            result.data.laboratoryTestId
                        ),
                        result.data
                    );
                }
            }
        },
        onError: (error) => {
            console.error("Create report error:", error);
        }
    });
};

// UPDATE REPORT - Hook
export const useUpdateLaboratoryTestReport = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            medicalHistoryId,
            laboratoryTestId,
            data
        }: {
            medicalHistoryId: number;
            laboratoryTestId: number;
            data: Partial<UpdateLaboratoryTestReportRequest>;
        }) => updateLaboratoryTestReport(medicalHistoryId, laboratoryTestId, data),
        onSuccess: (result, variables) => {
            if (result.success) {
                // Invalidate reports list
                queryClient.invalidateQueries({
                    queryKey: LAB_TEST_REPORT_KEYS.lists()
                });

                // Update specific report in cache
                if (result.data) {
                    queryClient.setQueryData(
                        LAB_TEST_REPORT_KEYS.detail(
                            variables.medicalHistoryId,
                            variables.laboratoryTestId
                        ),
                        result.data
                    );
                }
            }
        },
        onError: (error) => {
            console.error("Update report error:", error);
        }
    });
};

export const useDeleteLaboratoryTestReport = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            medicalHistoryId,
            laboratoryTestId
        }: {
            medicalHistoryId: number;
            laboratoryTestId: number;
        }) => deleteLaboratoryTestReport(medicalHistoryId, laboratoryTestId),
        onSuccess: (result, variables) => {
            if (result.success) {
                // Invalidate reports list
                queryClient.invalidateQueries({
                    queryKey: LAB_TEST_REPORT_KEYS.lists()
                });

                // Remove specific report from cache
                queryClient.removeQueries({
                    queryKey: LAB_TEST_REPORT_KEYS.detail(
                        variables.medicalHistoryId,
                        variables.laboratoryTestId
                    )
                });
            }
        },
        onError: (error) => {
            console.error("Delete report error:", error);
        }
    });
};