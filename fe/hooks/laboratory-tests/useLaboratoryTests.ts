import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { getAllLaboratoryTest } from "@/lib/api/laboratory-test.actions";

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
      const hasNextPage =
        pagination.pageNumber * pagination.pageSize < pagination.totalItems;
      return hasNextPage ? pagination.pageNumber + 1 : undefined;
    },
    initialPageParam: 1,
  });
