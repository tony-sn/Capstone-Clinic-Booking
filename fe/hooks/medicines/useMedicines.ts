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
      // Gán mặc định pageParam = 1 nếu undefined
      queryFn: ({ pageParam = 1 }: { pageParam?: number }) =>
        getAllMedicine({ pageNumber: pageParam, pageSize }),
      getNextPageParam: (lastPage) => {
        const { pageNumber, pageSize, totalItems } = lastPage.pagination!;
        const hasNext = pageNumber * pageSize < totalItems;
        return hasNext ? pageNumber + 1 : undefined;
      },
      initialPageParam: 1,
    });
