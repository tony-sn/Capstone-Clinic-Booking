"use client";

import InfiniteScroll from "@/components/InfiniteScroll";
import { useInfinitePrescriptions } from "@/hooks/prescriptions/usePrescriptions";
import { flattenPages } from "@/lib/utils";

export default function PrescriptionPage() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePrescriptions();

  const prescriptions = flattenPages<any>(data?.pages || []);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Prescriptions</h1>
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
            {prescriptions.map((item, index) => (
              <li key={index} className="rounded border p-3">
                {item.totalAmount}
              </li>
            ))}
          </ul>
        </InfiniteScroll>
      )}
    </div>
  );
}
