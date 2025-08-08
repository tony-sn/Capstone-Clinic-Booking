"use client";

import {
  Calendar,
  Clock,
  Eye,
  Plus,
  Search,
  User as UserIcon,
  X,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import ViewAppointmentModal from "@/components/new/forms/appointments/ViewAppointmentModal";
import PatientCreateAppointmentModal from "@/components/patient/PatientCreateAppointmentModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePatientAppointments } from "@/hooks/appointments/useAppointments";
import { useDoctors } from "@/hooks/doctors/useDoctors";
import { useUsers } from "@/hooks/users/useUsers";
import { Appointment } from "@/types/appointment";
import { DoctorDTO } from "@/types/doctor";
import { User } from "@/types/user";

interface PatientAppointmentListProps {
  patientId: number;
  patientName: string;
}

export default function PatientAppointmentList({
  patientId,
  patientName,
}: PatientAppointmentListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch patient's appointments
  const {
    data: appointmentsResponse,
    isLoading,
    error,
    refetch,
  } = usePatientAppointments({
    patientId,
    pageSize: 0,
    pageNumber: 1,
  });

  // Fetch doctors and users for name resolution
  const { data: doctorsResponse } = useDoctors({
    pageSize: 100,
    pageNumber: 1,
  });
  const { data: users = [] } = useUsers();

  const appointments = appointmentsResponse?.data || [];
  const doctors = doctorsResponse?.data || [];

  // Create lookup maps for performance
  const doctorMap = useMemo(() => {
    return doctors.reduce(
      (acc, doctor) => {
        acc[doctor.id] = doctor;
        return acc;
      },
      {} as Record<number, DoctorDTO>
    );
  }, [doctors]);

  const userMap = useMemo(() => {
    return users.reduce(
      (acc, user) => {
        acc[user.id] = user;
        return acc;
      },
      {} as Record<number, User>
    );
  }, [users]);

  // Filter appointments based on search query
  const filteredAppointments = useMemo(() => {
    if (!searchQuery.trim()) return appointments;

    const query = searchQuery.toLowerCase().trim();
    return appointments.filter((appointment) => {
      const doctor = doctorMap[appointment.doctorId];
      const doctorName = doctor
        ? `Dr. ${doctor.firstName} ${doctor.lastName}`
        : "";

      return (
        appointment.id.toString().includes(query) ||
        doctorName.toLowerCase().includes(query) ||
        getAppointmentStatus(appointment.appointmentStatus)
          .toLowerCase()
          .includes(query)
      );
    });
  }, [appointments, searchQuery, doctorMap]);

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

  const handleCreateAppointment = useCallback(() => {
    setShowCreateModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedAppointment(null);
    setShowViewModal(false);
    setShowCreateModal(false);
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
    const colorMap: Record<number, string> = {
      0: "default",
      1: "secondary",
      2: "default",
    };
    return colorMap[status] || "outline";
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
      <div className="rounded-lg border bg-card p-8">
        <div className="text-center">
          <Calendar className="mx-auto mb-4 size-8 animate-pulse text-muted-foreground" />
          <p className="text-muted-foreground">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border bg-card p-8">
        <div className="text-center">
          <p className="mb-4 text-red-500">Failed to load appointments.</p>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with search and create button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold">My Appointments</h3>
          <p className="text-sm text-muted-foreground">
            {appointments.length} appointment
            {appointments.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <Button
          onClick={handleCreateAppointment}
          className="flex items-center gap-2"
        >
          <Plus className="size-4" />
          Book New Appointment
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search appointments by ID, doctor, or status..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="px-10"
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="rounded-lg border bg-card p-8">
          <div className="text-center">
            <Calendar className="mx-auto mb-4 size-8 text-muted-foreground" />
            <p className="mb-2 text-muted-foreground">
              {searchQuery
                ? "No appointments match your search."
                : "No appointments found."}
            </p>
            {!searchQuery && (
              <p className="text-sm text-muted-foreground">
                Your appointments will appear here once you book them.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border bg-card">
          <div className="divide-y">
            {filteredAppointments.map((appointment) => {
              const doctor = doctorMap[appointment.doctorId];
              const doctorName = doctor
                ? `Dr. ${doctor.firstName} ${doctor.lastName}`
                : "Unknown Doctor";

              return (
                <div
                  key={appointment.id}
                  className="p-6 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      {/* Appointment header */}
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">#{appointment.id}</Badge>
                        <Badge
                          variant={getStatusColor(
                            appointment.appointmentStatus
                          )}
                        >
                          {getAppointmentStatus(appointment.appointmentStatus)}
                        </Badge>
                        {!appointment.active && (
                          <Badge variant="destructive">Inactive</Badge>
                        )}
                      </div>

                      {/* Doctor info */}
                      <div className="flex items-center gap-2 text-sm">
                        <UserIcon className="size-4 text-muted-foreground" />
                        <span className="font-medium">{doctorName}</span>
                        {doctor?.department && (
                          <>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">
                              {doctor.department.name}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Time and price */}
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="size-4 text-muted-foreground" />
                          <span>{formatDateTime(appointment.startTime)}</span>
                        </div>
                        <div className="font-medium text-green-600">
                          ${appointment.price.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewAppointment(appointment)}
                      >
                        <Eye className="mr-2 size-4" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modals */}
      {showViewModal && selectedAppointment && (
        <ViewAppointmentModal
          appointment={selectedAppointment}
          doctor={doctorMap[selectedAppointment.doctorId]}
          patient={userMap[selectedAppointment.bookByUserId]}
          onClose={handleCloseModal}
        />
      )}

      {showCreateModal && (
        <PatientCreateAppointmentModal
          patientId={patientId}
          patientName={patientName}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
