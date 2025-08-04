"use client";

import { ArrowLeft, Calendar, Clock, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAppointmentsByMedicalHistoryId,
  getAppointmentById,
} from "@/lib/api/appointment.actions";
import type { Appointment } from "@/types/appointment";

interface AppointmentDetailProps {
  medicalHistoryId: number;
  onBack: () => void;
}

export default function AppointmentDetail({
  medicalHistoryId,
  onBack,
}: AppointmentDetailProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response =
          await getAppointmentsByMedicalHistoryId(medicalHistoryId);
        setAppointments(response.data || []);
      } catch (err) {
        setError("Failed to load appointments");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [medicalHistoryId]);

  const handleViewAppointmentDetail = async (appointmentId: number) => {
    try {
      setLoadingDetail(true);
      const response = await getAppointmentById(appointmentId);
      setSelectedAppointment(response.data);
    } catch (err) {
      setError("Failed to load appointment details");
      console.error(err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <Badge variant="default">Booked</Badge>;
      case 1:
        return <Badge variant="secondary">Pending</Badge>;
      case 2:
        return <Badge variant="outline">Examined</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatDateTime = (dateTime: string | Date) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="size-4" />
              Back to Medical History
            </Button>
          </div>
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading appointments...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="size-4" />
              Back to Medical History
            </Button>
          </div>
          <div className="py-8 text-center text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (selectedAppointment) {
    const startDateTime = formatDateTime(selectedAppointment.startTime);
    const endDateTime = formatDateTime(selectedAppointment.endTime);

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setSelectedAppointment(null)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="size-4" />
              Back to Appointments
            </Button>
            <CardTitle>Appointment #{selectedAppointment.id}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {loadingDetail ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">
                Loading appointment details...
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                  <Calendar className="size-5" />
                  Schedule Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Start Date & Time
                    </label>
                    <p className="mt-1">
                      {startDateTime.date} at {startDateTime.time}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      End Date & Time
                    </label>
                    <p className="mt-1">
                      {endDateTime.date} at {endDateTime.time}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Status
                    </label>
                    <div className="mt-1">
                      {getStatusBadge(selectedAppointment.appointmentStatus)}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                  <DollarSign className="size-5" />
                  Additional Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Doctor ID
                    </label>
                    <p className="mt-1">{selectedAppointment.doctorId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Booked By
                    </label>
                    <p className="mt-1">
                      User #{selectedAppointment.bookByUserId}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Price
                    </label>
                    <p className="mt-1">
                      ${selectedAppointment.price.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Medical History ID
                    </label>
                    <p className="mt-1">
                      {selectedAppointment.medicalHistoryId || "Not assigned"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="size-4" />
            Back to Medical History
          </Button>
          <CardTitle>Related Appointments</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No appointments found for this medical history record.
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => {
              const startDateTime = formatDateTime(appointment.startTime);

              return (
                <Card
                  key={appointment.id}
                  className="transition-shadow hover:shadow-md"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            Appointment #{appointment.id}
                          </span>
                          {getStatusBadge(appointment.appointmentStatus)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="size-4" />
                            {startDateTime.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="size-4" />
                            {startDateTime.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="size-4" />$
                            {appointment.price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleViewAppointmentDetail(appointment.id)
                        }
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
