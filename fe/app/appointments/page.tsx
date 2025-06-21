"use client";

import AppointmentForm from "@/components/new/forms/AppointmentForm";
import { useAppointments } from "@/hooks/appointments/useAppointments";

export default function AppointmentPage() {
  const {
    data: appointments,
    isLoading,
    isError,
  } = useAppointments({
    pageSize: 5,
    pageNumber: 1,
  });

  console.log({
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
        <ul className="space-y-3">
          {appointments.map((appt) => (
            <li key={appt.id} className="rounded border p-3">
              {appt.appointmentStatus}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
