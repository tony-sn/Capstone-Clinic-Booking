import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import {
  getAllAppointment,
  getAppointmentById,
  getAppointmentsByPatientId,
} from "@/lib/api/appointment.actions";
import type {
  AppointmentsResponse,
  AppointmentResponse,
} from "@/types/appointment";

export const useAppointments = ({
  pageSize = 5,
  pageNumber = 1,
}: {
  pageSize?: number;
  pageNumber?: number;
}) => {
  return useQuery<AppointmentsResponse>({
    queryKey: ["appointments", pageSize, pageNumber],
    queryFn: () => getAllAppointment({ pageSize, pageNumber }),
  });
};

export const useInfiniteAppointments = (pageSize = 5) =>
  useInfiniteQuery<AppointmentsResponse>({
    queryKey: ["appointments", pageSize],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getAllAppointment({ pageNumber: pageParam, pageSize }),
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.pagination;

      const hasNextPage =
        pagination.pageNumber * pagination.pageSize < pagination.totalItems;
      return hasNextPage ? pagination.pageNumber + 1 : undefined;
    },
    initialPageParam: 1,
  });

export const usePatientAppointments = (
  {
    patientId,
    pageSize = 5,
    pageNumber = 1,
  }: {
    patientId: number;
    pageSize?: number;
    pageNumber?: number;
  },
  options?: { enabled?: boolean }
) =>
  useQuery<AppointmentsResponse | undefined>({
    queryKey: ["patientAppointments", patientId, pageSize, pageNumber],
    queryFn: () =>
      getAppointmentsByPatientId(patientId, { pageSize, pageNumber }),
    enabled: !!patientId && options?.enabled !== false,
  });

export const useAppointmentDetail = ({
  appointmentId,
}: {
  appointmentId: number;
}) =>
  useQuery<AppointmentResponse>({
    queryKey: ["appointment", appointmentId],
    queryFn: () => getAppointmentById(appointmentId),
    enabled: !!appointmentId,
  });
