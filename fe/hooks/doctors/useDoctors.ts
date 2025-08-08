import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { getAllDoctors, getDoctorById } from "@/lib/api/doctor.actions";

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

// Infinite scroll hook
export const useInfiniteDoctors = (pageSize = 5) =>
  useInfiniteQuery({
    queryKey: ["doctors-infinite", pageSize],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getAllDoctors({ pageNumber: pageParam, pageSize }),
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.pagination;
      const hasNext =
        pagination.pageNumber * pagination.pageSize < pagination.totalItems;
      return hasNext ? pagination.pageNumber + 1 : undefined;
    },
    initialPageParam: 1,
  });

// Optional: Hook lấy chi tiết doctor theo id
export const useDoctorById = (id: number) => {
  return useQuery({
    queryKey: ["doctor", id],
    queryFn: () => getDoctorById(id),
    enabled: !!id, // chỉ gọi khi có id hợp lệ
  });
};
