"use client";

import {
  AlertCircle,
  Calendar,
  Clock,
  Edit,
  Eye,
  MoreVertical,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  User as UserIcon,
  X,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import CreateAppointmentModal from "@/components/new/forms/appointments/CreateAppointmentModal";
import DeleteAppointmentModal from "@/components/new/forms/appointments/DeleteAppointmentModal";
import EditAppointmentModal from "@/components/new/forms/appointments/EditAppointmentModal";
import ViewAppointmentModal from "@/components/new/forms/appointments/ViewAppointmentModal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppointments } from "@/hooks/appointments/useAppointments";
import { useDoctors } from "@/hooks/doctors/useDoctors";
import { useUsers } from "@/hooks/users/useUsers";
import { Appointment } from "@/types/appointment";
import { DoctorDTO } from "@/types/doctor";
import { User } from "@/types/user";

function AppointmentPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    data: appointmentsResponse,
    isLoading,
    refetch,
    error,
  } = useAppointments({
    pageSize: 100,
    pageNumber: 1,
  });
  const { data: doctorsResponse } = useDoctors({
    pageSize: 100,
    pageNumber: 1,
  });
  const { data: users = [] } = useUsers();

  // Create lookup maps for performance
  const doctorMap = useMemo(() => {
    const doctors = doctorsResponse?.data || [];
    return doctors.reduce(
      (acc, doctor) => {
        acc[doctor.id] = doctor;
        return acc;
      },
      {} as Record<number, DoctorDTO>
    );
  }, [doctorsResponse?.data]);

  const userMap = useMemo(() => {
    return users.reduce(
      (acc, user) => {
        acc[user.id] = user;
        return acc;
      },
      {} as Record<number, User>
    );
  }, [users]);

  const filteredAppointments = useMemo(() => {
    const appointments = appointmentsResponse?.data || [];
    if (!searchQuery.trim()) return appointments;

    const query = searchQuery.toLowerCase().trim();
    return appointments.filter((appointment) => {
      const doctor = doctorMap[appointment.doctorId];
      const patient = userMap[appointment.bookByUserId];
      const doctorName = doctor
        ? `Dr. ${doctor.firstName} ${doctor.lastName}`
        : "";
      const patientName = patient
        ? `${patient.firstName} ${patient.lastName}`
        : "";

      return (
        appointment.id.toString().includes(query) ||
        doctorName.toLowerCase().includes(query) ||
        patientName.toLowerCase().includes(query) ||
        getAppointmentStatus(appointment.appointmentStatus)
          .toLowerCase()
          .includes(query)
      );
    });
  }, [appointmentsResponse?.data, searchQuery, doctorMap, userMap]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleViewAppointment = useCallback((appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowViewModal(true);
  }, []);

  const handleEditAppointment = useCallback((appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowEditModal(true);
  }, []);

  const handleDeleteAppointment = useCallback((appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDeleteModal(true);
  }, []);

  const handleCreateAppointment = useCallback(() => {
    setShowCreateModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedAppointment(null);
    setShowCreateModal(false);
    setShowViewModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
  }, []);

  const handleSuccess = useCallback(() => {
    handleCloseModal();
    refetch();
  }, [handleCloseModal, refetch]);

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
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-2 animate-spin text-blue-500">
            <Calendar className="size-10" />
          </div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 size-12 text-red-500" />
          <p className="mb-4 text-gray-700">Failed to load appointments.</p>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <RotateCcw className="size-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-blue-600 p-3">
                <Calendar className="size-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Appointment Management
                </h1>
                <p className="text-gray-600">
                  Manage patient appointments and schedules
                </p>
              </div>
            </div>
            <button
              onClick={handleCreateAppointment}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              <Plus className="size-4" />
              Create New Appointment
            </button>
          </div>

          <div className="relative mb-4">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="size-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by appointment ID, doctor name, patient name, or status..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-12 py-3 text-gray-700 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-4"
              >
                <X className="size-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Appointment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Schedule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredAppointments.map((appointment: Appointment) => {
                  const doctor = doctorMap[appointment.doctorId];
                  const patient = userMap[appointment.bookByUserId];
                  const doctorName = doctor
                    ? `Dr. ${doctor.firstName} ${doctor.lastName}`
                    : "Unknown Doctor";
                  const patientName = patient
                    ? `${patient.firstName} ${patient.lastName}`
                    : "Unknown Patient";

                  return (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            #{appointment.id}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.active ? "Active" : "Inactive"}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <UserIcon className="mr-2 size-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {doctorName}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {appointment.doctorId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <UserIcon className="mr-2 size-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {patientName}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {appointment.bookByUserId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center text-sm text-gray-900">
                          <Clock className="mr-2 size-4 text-gray-400" />
                          <div>
                            <div className="font-medium">
                              {formatDateTime(appointment.startTime)}
                            </div>
                            <div className="text-gray-500">
                              to {formatDateTime(appointment.endTime)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                            appointment.appointmentStatus
                          )}`}
                        >
                          {getAppointmentStatus(appointment.appointmentStatus)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        ${appointment.price.toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <div className="flex items-center justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                className="inline-flex items-center justify-center rounded-md p-1 hover:bg-gray-100"
                                title="Actions"
                              >
                                <MoreVertical className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleViewAppointment(appointment)
                                }
                              >
                                <Eye className="mr-2 size-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleEditAppointment(appointment)
                                }
                              >
                                <Edit className="mr-2 size-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDeleteAppointment(appointment)
                                }
                              >
                                <Trash2 className="mr-2 size-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredAppointments.length === 0 && (
            <div className="py-16 text-center text-gray-600">
              <Calendar className="mx-auto mb-4 size-12 text-gray-400" />
              No appointments found.
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateAppointmentModal
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}

      {showViewModal && selectedAppointment && (
        <ViewAppointmentModal
          appointment={selectedAppointment}
          doctor={doctorMap[selectedAppointment.doctorId]}
          patient={userMap[selectedAppointment.bookByUserId]}
          onClose={handleCloseModal}
        />
      )}

      {showEditModal && selectedAppointment && (
        <EditAppointmentModal
          appointment={selectedAppointment}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}

      {showDeleteModal && selectedAppointment && (
        <DeleteAppointmentModal
          appointment={selectedAppointment}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

export default function AppointmentPageClient() {
  return <AppointmentPageContent />;
}
