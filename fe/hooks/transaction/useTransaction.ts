import { useInfiniteQuery } from "@tanstack/react-query";
import { getTransactions } from "@/lib/api/transaction.actions";
import type { TransactionFilter } from "@/types/transaction";

export const useInfiniteTransactions = (filters: TransactionFilter) => {
  return useInfiniteQuery({
    queryKey: ["transactions", filters],
    queryFn: async ({ pageParam = 1 }) =>
      getTransactions({
        ...filters,
        pageNumber: pageParam,
        pageSize: 10,
      }),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      const { pageNumber, totalItems, pageSize } = pagination;
      const totalPages = Math.ceil(totalItems / pageSize);
      return pageNumber < totalPages ? pageNumber + 1 : undefined;
    },
    initialPageParam: 1,
  });
};
