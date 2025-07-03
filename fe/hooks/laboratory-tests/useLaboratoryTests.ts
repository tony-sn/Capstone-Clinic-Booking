
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { getAllLaboratoryTest, getLaboratoryTestById } from "@/lib/api/laboratory-test.actions";

import { MedicalHistoryResponse } from "@/types/medicalHistory";
import { LaboratoryTestReport } from "@/types/laboratoryTest";

export const useLaboratoryTests = ({
  pageSize = 5,
  pageNumber = 1,
}: {
  pageSize?: number;
  pageNumber?: number;
}) =>
  useQuery({
    queryKey: ["laboratoryTests", pageSize, pageNumber],
    queryFn: () => getAllLaboratoryTest({ pageSize, pageNumber }),
  });

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

export const laboratoryTestDetail = ({ laboratoryTestId }: { laboratoryTestId: number }) => useQuery<LaboratoryTestReport>({
  queryKey: ["laboratoryTest", laboratoryTestId],
  queryFn: () => getLaboratoryTestById(laboratoryTestId)
});