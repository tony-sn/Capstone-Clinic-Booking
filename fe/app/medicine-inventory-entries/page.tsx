"use client";

import InfiniteScroll from "@/components/InfiniteScroll";
import { useInfiniteMedicineInventoryEntries } from "@/hooks/medicine-inventory-entries/useMedicineInventoryEntries";
import { flattenPages } from "@/lib/utils";

export default function LaboratoryTestPage() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteMedicineInventoryEntries();

  const entries = flattenPages<any>(data?.pages || []);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">
        Medicine Inventory Entries
      </h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Something went wrong.</p>
      ) : (
        <InfiniteScroll
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        >
          <ul className="space-y-3">
            {entries.map((item, index) => (
              <li key={index} className="rounded border p-3">
                {item.name}
              </li>
            ))}
          </ul>
        </InfiniteScroll>
      )}
    </div>
  );
}
