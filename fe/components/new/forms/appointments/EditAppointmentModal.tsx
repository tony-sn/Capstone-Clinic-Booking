"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Loader2, Edit } from "lucide-react";
import { useEffect, useState } from "react";

import { useDoctors } from "@/hooks/doctors/useDoctors";
import { usePatients } from "@/hooks/users/useUsers";
import { updateAppointment } from "@/lib/api/appointment.actions";
import { Appointment } from "@/types/appointment";

export default function EditAppointmentModal({
  appointment,
  onClose,
  onSuccess,
}: {
  appointment: Appointment;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [formState, setFormState] = useState({
    doctorId: appointment.doctorId.toString(),
    bookByUserId: appointment.bookByUserId.toString(),
    startTime: formatDateTimeForInput(appointment.startTime),
    endTime: formatDateTimeForInput(appointment.endTime),
    price: appointment.price.toString(),
    appointmentStatus: appointment.appointmentStatus.toString(),
    active: appointment.active.toString(),
  });

  const { data: doctorsResponse } = useDoctors({
    pageSize: 100,
    pageNumber: 1,
  });
  const { data: patients = [] } = usePatients();

  const doctors = doctorsResponse?.data || [];
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (formData: FormData) =>
      updateAppointment(appointment.id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      onSuccess?.();
    },
  });

  function formatDateTimeForInput(dateString: string | Date): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("doctorId", formState.doctorId);
    formData.append("bookByUserId", formState.bookByUserId);
    formData.append("startTime", formState.startTime);
    formData.append("endTime", formState.endTime);
    formData.append("price", formState.price);
    formData.append("appointmentStatus", formState.appointmentStatus);
    formData.append("active", formState.active);

    updateMutation.mutate(formData);
  };

  const isFormValid =
    formState.doctorId &&
    formState.bookByUserId &&
    formState.startTime &&
    formState.endTime &&
    formState.price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4">
      <div className="flex min-h-full items-center justify-center p-4">
        <form
          onSubmit={handleSubmit}
          className="relative w-full max-w-lg space-y-4 rounded-xl bg-white p-6 shadow-lg"
        >
          <button
            type="button"
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <X className="size-5" />
          </button>

          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2">
              <Edit className="size-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Edit Appointment
              </h2>
              <p className="text-sm text-gray-600">
                Update appointment #{appointment.id}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Doctor *
              </label>
              <select
                name="doctorId"
                value={formState.doctorId}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="">Select a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.firstName} {doctor.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Patient *
              </label>
              <select
                name="bookByUserId"
                value={formState.bookByUserId}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="">Select a patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Start Time *
              </label>
              <input
                name="startTime"
                type="datetime-local"
                value={formState.startTime}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                End Time *
              </label>
              <input
                name="endTime"
                type="datetime-local"
                value={formState.endTime}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Price *
              </label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formState.price}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Status *
              </label>
              <select
                name="appointmentStatus"
                value={formState.appointmentStatus}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="0">Booked</option>
                <option value="1">Pending</option>
                <option value="2">Examined</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Active *
              </label>
              <select
                name="active"
                value={formState.active}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={updateMutation.isPending}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending || !isFormValid}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {updateMutation.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              Update Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
