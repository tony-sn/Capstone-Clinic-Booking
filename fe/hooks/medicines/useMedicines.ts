import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { getAllMedicine } from "@/lib/api/medicine.actions";

export const useMedicines = ({
  pageSize = 5,
  pageNumber = 1,
}: {
  pageSize?: number;
  pageNumber?: number;
}) =>
  useQuery({
    queryKey: ["medicines", pageSize, pageNumber],
    queryFn: () => getAllMedicine({ pageSize, pageNumber }),
  });

export const useInfiniteMedicines = (pageSize = 5) =>
  useInfiniteQuery({
    queryKey: ["medicines", pageSize],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getAllMedicine({ pageNumber: pageParam, pageSize }),
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.pagination;
      const hasNextPage =
        pagination.pageNumber * pagination.pageSize < pagination.totalItems;
      return hasNextPage ? pagination.pageNumber + 1 : undefined;
    },
    initialPageParam: 1,
  });
