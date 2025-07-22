import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import {
  getAllPrescriptions,
  getPrescriptionDetail,
  getPrescriptionDetailById,
} from "@/lib/api/prescription.actions";
import { PrescriptionDetailResponse } from "@/types/prescription";

export const usePrescriptions = ({
  pageSize = 5,
  pageNumber = 1,
}: {
  pageSize?: number;
  pageNumber?: number;
}) =>
  useQuery({
    queryKey: ["prescriptions", pageSize, pageNumber],
    queryFn: () => getAllPrescriptions({ pageSize, pageNumber }),
  });

export const useInfinitePrescriptions = (pageSize = 5) =>
  useInfiniteQuery({
    queryKey: ["prescriptions", pageSize],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getAllPrescriptions({ pageNumber: pageParam, pageSize }),
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.pagination;
      const hasNextPage =
        pagination.pageNumber * pagination.pageSize < pagination.totalItems;
      return hasNextPage ? pagination.pageNumber + 1 : undefined;
    },
    initialPageParam: 1,
  });

export const useGetPrescriptionDetail = () =>
  useQuery<PrescriptionDetailResponse>({
    queryKey: ["prescriptionDetail"],
    queryFn: () => getPrescriptionDetail(),
  });

export const useGetPrescriptionDetailById = ({
  prescriptionId,
  medicineId,
}: {
  prescriptionId: number;
  medicineId: number;
}) =>
  useQuery<PrescriptionDetailResponse>({
    queryKey: ["prescriptionDetail", prescriptionId, medicineId],
    queryFn: () => getPrescriptionDetailById(prescriptionId, medicineId),
  });
