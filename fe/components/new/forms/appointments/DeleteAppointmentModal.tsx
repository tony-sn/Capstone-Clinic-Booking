"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Loader2, Trash2, AlertTriangle } from "lucide-react";
import { useEffect } from "react";

import { deleteAppointmentById } from "@/lib/api/appointment.actions";
import { Appointment } from "@/types/appointment";

export default function DeleteAppointmentModal({
  appointment,
  onClose,
  onSuccess,
}: {
  appointment: Appointment;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteAppointmentById(appointment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      onSuccess?.();
    },
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const getAppointmentStatus = (status: number) => {
    const statusMap: Record<number, string> = {
      0: "Booked",
      1: "Pending",
      2: "Examined",
    };
    return statusMap[status] || "Unknown";
  };

  const formatDateTime = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">
          <button
            type="button"
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <X className="size-5" />
          </button>

          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-2">
              <AlertTriangle className="size-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Delete Appointment
              </h2>
              <p className="text-sm text-gray-600">
                This action cannot be undone
              </p>
            </div>
          </div>

          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <p className="mb-3 text-sm text-gray-700">
              Are you sure you want to delete this appointment?
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">
                  Appointment ID:
                </span>
                <span className="text-gray-900">#{appointment.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Doctor ID:</span>
                <span className="text-gray-900">{appointment.doctorId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Patient ID:</span>
                <span className="text-gray-900">
                  {appointment.bookByUserId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Start Time:</span>
                <span className="text-gray-900">
                  {formatDateTime(appointment.startTime)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Status:</span>
                <span className="text-gray-900">
                  {getAppointmentStatus(appointment.appointmentStatus)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Price:</span>
                <span className="text-gray-900">
                  ${appointment.price.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-lg bg-red-50 p-4">
            <div className="flex">
              <AlertTriangle className="mr-3 mt-0.5 size-5 shrink-0 text-red-400" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Warning</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    Deleting this appointment will permanently remove it from
                    the system. This action cannot be undone and may affect
                    related records.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={deleteMutation.isPending}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {deleteMutation.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              <Trash2 className="size-4" />
              Delete Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
