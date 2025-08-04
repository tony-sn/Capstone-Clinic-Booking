import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import {
  getAllMedicalHistory,
  getMedicalHistoryById,
  getMedicalHistoryByPatientId,
} from "@/lib/api/medical-history.action";
import type {
  MedicalHistoriesResponse,
  MedicalHistoryResponse,
} from "@/types/medicalHistory";

export const useMedicalHistories = ({
  pageSize = 5,
  pageNumber = 1,
}: {
  pageSize?: number;
  pageNumber?: number;
}) =>
  useQuery<MedicalHistoriesResponse | undefined>({
    queryKey: ["medicalHistories", pageSize, pageNumber],
    queryFn: () => getAllMedicalHistory({ pageSize, pageNumber }),
  });

export const useInfiniteMedicalHistories = (pageSize = 5) =>
  useInfiniteQuery<MedicalHistoriesResponse>({
    queryKey: ["medicalHistories", pageSize],
    queryFn: async ({ pageParam = 1 }) =>
      await getAllMedicalHistory({
        pageNumber: pageParam as number,
        pageSize,
      }),
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.pagination;
      if (!pagination) return undefined;
      // Nếu đã đến trang cuối thì không load nữa
      if (pagination.pageNumber >= pagination.totalPages) return undefined;
      // Ngược lại, trả về số trang tiếp theo
      return pagination.pageNumber + 1;
    },
    initialPageParam: 1,
  });

export const useMedicalDetail = ({
  medicalHistoryId,
}: {
  medicalHistoryId: number;
}) =>
  useQuery<MedicalHistoryResponse>({
    queryKey: ["medicalHistory", medicalHistoryId],
    queryFn: () => getMedicalHistoryById(medicalHistoryId),
  });

export const usePatientMedicalHistories = ({
  patientId,
  pageSize = 5,
  pageNumber = 1,
}: {
  patientId: number;
  pageSize?: number;
  pageNumber?: number;
}) =>
  useQuery<MedicalHistoriesResponse | undefined>({
    queryKey: ["patientMedicalHistories", patientId, pageSize, pageNumber],
    queryFn: () => getMedicalHistoryByPatientId(patientId, { pageSize, pageNumber }),
    enabled: !!patientId,
  });
