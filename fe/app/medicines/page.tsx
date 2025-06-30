"use client";

import InfiniteScroll from "@/components/InfiniteScroll";
import { useInfiniteMedicines } from "@/hooks/medicines/useMedicines";
import { flattenPages } from "@/lib/utils";


export default function MedicinePage() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteMedicines();

  const medicines = flattenPages<any>(data?.pages || []);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Medicines</h1>
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
            {medicines.map((item, index) => (
              <li key={index} className="rounded border p-3">
                {item.medicineName}
              </li>
            ))}
          </ul>
        </InfiniteScroll>
      )}
    </div>
  );
}
