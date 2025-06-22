import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { getAllAppointment } from "@/lib/api/appointment.actions";

export const useAppointments = ({
  pageSize = 5,
  pageNumber = 1,
}: {
  pageSize?: number;
  pageNumber?: number;
}) => {
  return useQuery({
    queryKey: ["appointments", pageSize, pageNumber],
    queryFn: () => getAllAppointment({ pageSize, pageNumber }),
  });
};

export const useInfiniteAppointments = (pageSize = 5) =>
  useInfiniteQuery({
    queryKey: ["appointments", pageSize],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getAllAppointment({ pageNumber: pageParam, pageSize }), // TODO: may need to check whether this pageParam is pageNumber
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.pagination;

      const hasNextPage =
        pagination.pageNumber * pagination.pageSize < pagination.totalItems;
      return hasNextPage ? pagination.pageNumber + 1 : undefined;
    },
    initialPageParam: 1,
  });
