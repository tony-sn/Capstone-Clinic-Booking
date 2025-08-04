import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import {
  getAllLaboratoryTest,
  getLaboratoryTestById,
} from "@/lib/api/laboratory-test.actions";
import { LaboratoryTestReport } from "@/types/laboratoryTest";

export const useLaboratoryTests = ({
  pageSize = 0,
  pageNumber = 1,
}: {
  pageSize?: number;
  pageNumber?: number;
}) => {
  return useQuery({
    queryKey: ["laboratoryTests", pageSize, pageNumber],
    queryFn: async () => {
      const response = await getAllLaboratoryTest({ pageSize, pageNumber });
      // Extract data from ApiResponse
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useInfiniteLaboratoryTests = (pageSize = 5) =>
  useInfiniteQuery({
    queryKey: ["laboratoryTests", pageSize],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getAllLaboratoryTest({ pageNumber: pageParam, pageSize }),
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

export const useLaboratoryTestDetail = ({
  laboratoryTestId,
}: {
  laboratoryTestId: number;
}) =>
  useQuery<LaboratoryTestReport>({
    queryKey: ["laboratoryTest", laboratoryTestId],
    queryFn: () => getLaboratoryTestById(laboratoryTestId),
  });
