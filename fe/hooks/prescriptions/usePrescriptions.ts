import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { getAllPrescriptions } from "@/lib/api/prescription.actions";

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
