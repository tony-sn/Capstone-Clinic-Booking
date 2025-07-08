import { useEffect, useRef } from "react";

type InfiniteScrollProps = {
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  children: React.ReactNode;
  loader?: React.ReactNode;
  endMessage?: React.ReactNode;
};

export default function InfiniteScroll({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  children,
  loader = <p>Loading more...</p>,
  endMessage = <p>No more items to load</p>,
}: InfiniteScrollProps) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { rootMargin: "100px" }
    );

    const current = loadMoreRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      {children}

      <div
        ref={loadMoreRef}
        className="flex h-12 items-center justify-center text-sm text-gray-500"
      >
        {isFetchingNextPage
          ? loader
          : hasNextPage
            ? "Scroll to load more"
            : endMessage}
      </div>
    </>
  );
}
