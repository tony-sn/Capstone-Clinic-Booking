import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import {
  getAllMedicineInventoryEntries,
  getMedicineInventoryEntryById,
} from "@/lib/api/medicine-inventory-entry.actions";

export const useMedicineInventoryEntries = ({
  pageSize = 100,
  pageNumber = 1,
}: {
  pageSize?: number;
  pageNumber?: number;
}) =>
  useQuery({
    queryKey: ["medicineInventoryEntries", pageSize, pageNumber],
    queryFn: () => getAllMedicineInventoryEntries({ pageSize, pageNumber }),
  });

export const useInfiniteMedicineInventoryEntries = (pageSize = 5) =>
  useInfiniteQuery({
    queryKey: ["medicineInventoryEntries", pageSize],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getAllMedicineInventoryEntries({ pageNumber: pageParam, pageSize }),
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.pagination;
      const hasNextPage =
        pagination.pageNumber * pagination.pageSize < pagination.totalItems;
      return hasNextPage ? pagination.pageNumber + 1 : undefined;
    },
    initialPageParam: 1,
  });

export const useMedicineInventoryEntry = (id: number, enabled = true) =>
  useQuery({
    queryKey: ["medicineInventoryEntry", id],
    queryFn: () => getMedicineInventoryEntryById(id),
    enabled: enabled && id > 0,
  });
