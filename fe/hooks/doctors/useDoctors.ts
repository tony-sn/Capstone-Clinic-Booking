import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { getAllDoctors } from "@/lib/api/doctor.actions";

export const useDoctors = ({
  pageSize = 5,
  pageNumber = 1,
}: {
  pageSize?: number;
  pageNumber?: number;
}) => {
  return useQuery({
    queryKey: ["doctors", pageSize, pageNumber],
    queryFn: () => getAllDoctors({ pageSize, pageNumber }),
  });
};

export const useInfiniteDoctors = (pageSize = 5) =>
  useInfiniteQuery({
    queryKey: ["doctors", pageSize],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getAllDoctors({ pageNumber: pageParam, pageSize }),
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.pagination;

      const hasNextPage =
        pagination.pageNumber * pagination.pageSize < pagination.totalItems;
      return hasNextPage ? pagination.pageNumber + 1 : undefined;
    },
    initialPageParam: 1,
  });
