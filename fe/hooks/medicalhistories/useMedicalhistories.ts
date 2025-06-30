import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getAllMedicalHistory } from "@/lib/api/medical-history.action";
import type { MedicalHistoryResponse } from "@/types/medicalHistory";

export const useMedicalHistories = ({
  pageSize = 5,
  pageNumber = 1,
}: {
  pageSize?: number;
  pageNumber?: number;
}) =>
  useQuery<MedicalHistoryResponse | undefined>({
    queryKey: ["medicalHistories", pageSize, pageNumber],
    queryFn: () => getAllMedicalHistory({ pageSize, pageNumber }),
  });

export const useInfiniteMedicalHistories = (pageSize = 5) =>
  useInfiniteQuery<MedicalHistoryResponse>({
    queryKey: ["medicalHistories", pageSize],
    queryFn: async ({ pageParam = 1 }) =>
      await getAllMedicalHistory({
        pageNumber: pageParam as number,
        pageSize
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