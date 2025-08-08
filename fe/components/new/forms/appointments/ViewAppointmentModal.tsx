"use client";

import { X, Eye, Calendar, Clock, User, DollarSign } from "lucide-react";
import { useEffect } from "react";

import { Appointment } from "@/types/appointment";
import { DoctorDTO } from "@/types/doctor";
import { User as UserType } from "@/types/user";

export default function ViewAppointmentModal({
  appointment,
  doctor,
  patient,
  onClose,
}: {
  appointment: Appointment;
  doctor?: DoctorDTO;
  patient?: UserType;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const getAppointmentStatus = (status: number) => {
    const statusMap: Record<number, string> = {
      0: "Booked",
      1: "Pending",
      2: "Examined",
    };
    return statusMap[status] || "Unknown";
  };

  const getStatusColor = (status: number) => {
    const colors: Record<number, string> = {
      0: "bg-blue-100 text-blue-800",
      1: "bg-yellow-100 text-yellow-800",
      2: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatDateTime = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg">
          <button
            type="button"
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <X className="size-5" />
          </button>

          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2">
              <Eye className="size-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Appointment Details
              </h2>
              <p className="text-sm text-gray-600">
                Appointment #{appointment.id}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <User className="size-4 text-gray-600" />
                  <h3 className="font-semibold text-gray-800">
                    Doctor Information
                  </h3>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Name:</span>{" "}
                    {doctor
                      ? `Dr. ${doctor.firstName} ${doctor.lastName}`
                      : "Unknown Doctor"}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">ID:</span>{" "}
                    {appointment.doctorId}
                  </p>
                  {doctor?.certificate && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Certificate:</span>{" "}
                      {doctor.certificate}
                    </p>
                  )}
                  {doctor?.department && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Department:</span>{" "}
                      {doctor.department.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <User className="size-4 text-gray-600" />
                  <h3 className="font-semibold text-gray-800">
                    Patient Information
                  </h3>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Name:</span>{" "}
                    {patient
                      ? `${patient.firstName} ${patient.lastName}`
                      : "Unknown Patient"}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">ID:</span>{" "}
                    {appointment.bookByUserId}
                  </p>
                  {patient?.username && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Email:</span>{" "}
                      {patient.username}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Calendar className="size-4 text-gray-600" />
                  <h3 className="font-semibold text-gray-800">Schedule</h3>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Start:</span>{" "}
                    {formatDateTime(appointment.startTime)}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">End:</span>{" "}
                    {formatDateTime(appointment.endTime)}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Duration:</span>{" "}
                    {Math.round(
                      (new Date(appointment.endTime).getTime() -
                        new Date(appointment.startTime).getTime()) /
                        (1000 * 60)
                    )}{" "}
                    minutes
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <DollarSign className="size-4 text-gray-600" />
                  <h3 className="font-semibold text-gray-800">
                    Payment & Status
                  </h3>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Price:</span>{" "}
                    <span className="text-lg font-semibold text-green-600">
                      ${appointment.price.toFixed(2)}
                    </span>
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      Status:
                    </span>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                        appointment.appointmentStatus
                      )}`}
                    >
                      {getAppointmentStatus(appointment.appointmentStatus)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Active:</span>{" "}
                    <span
                      className={`font-medium ${
                        appointment.active ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {appointment.active ? "Yes" : "No"}
                    </span>
                  </p>
                </div>
              </div>

              {appointment.medicalHistoryId && (
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Clock className="size-4 text-gray-600" />
                    <h3 className="font-semibold text-gray-800">
                      Medical History
                    </h3>
                  </div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Medical History ID:</span>{" "}
                    {appointment.medicalHistoryId}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
