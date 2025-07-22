"use client";

import InfiniteScroll from "@/components/InfiniteScroll";
import AppointmentForm from "@/components/new/forms/AppointmentForm";
import { useInfiniteAppointments } from "@/hooks/appointments/useAppointments";
import { flattenPages } from "@/lib/utils";
import { Appointment } from "@/types/appointment";

export default function AppointmentPage() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteAppointments();

  const appointments = flattenPages<Appointment>(data?.pages || []);
  console.log({
    data,
    appointments,
  });
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Appointments</h1>

      <AppointmentForm mode="create" onSuccess={() => {}} />

      <hr className="my-6" />

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
            {appointments.map((appt, index) => (
              <li key={`${appt.id}-${index}`} className="rounded border p-3">
                {appt.appointmentStatus}
              </li>
            ))}
          </ul>
        </InfiniteScroll>
      )}
    </div>
  );
}
