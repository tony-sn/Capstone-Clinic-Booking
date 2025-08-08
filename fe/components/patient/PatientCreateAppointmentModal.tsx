"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDoctors } from "@/hooks/doctors/useDoctors";
import { usePatientMedicalHistories } from "@/hooks/medicalhistories/useMedicalhistories";
import { createAppointment } from "@/lib/api/appointment.actions";

interface PatientCreateAppointmentModalProps {
  patientId: number;
  patientName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function PatientCreateAppointmentModal({
  patientId,
  patientName,
  onClose,
  onSuccess,
}: PatientCreateAppointmentModalProps) {
  const [formState, setFormState] = useState({
    doctorId: "",
    startTime: "",
    endTime: "",
    // Hidden fields with defaults
    price: "0", // Default to 0, will be set by staff later
    appointmentStatus: "0", // Default to "Booked"
  });

  const { data: doctorsResponse } = useDoctors({
    pageSize: 100,
    pageNumber: 1,
  });

  // Fetch patient's medical histories to get the medicalHistoryId
  const { data: medicalHistoriesResponse } = usePatientMedicalHistories({
    patientId,
    pageSize: 1, // We just need the most recent one
    pageNumber: 1,
  });

  const queryClient = useQueryClient();

  const doctors = doctorsResponse?.data || [];
  const medicalHistories = medicalHistoriesResponse?.data || [];
  const mostRecentMedicalHistoryId =
    medicalHistories.length > 0 ? medicalHistories[0].medicalHistoryId : null;

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => createAppointment(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["patientAppointments"] });
      onSuccess?.();
    },
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleChange = (name: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-set end time to 1 hour after start time
    if (name === "startTime" && value) {
      // Parse the datetime-local string directly and add 1 hour
      const startDate = new Date(value);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Add 1 hour

      // Format back to datetime-local format (YYYY-MM-DDTHH:MM)
      const year = endDate.getFullYear();
      const month = String(endDate.getMonth() + 1).padStart(2, "0");
      const day = String(endDate.getDate()).padStart(2, "0");
      const hours = String(endDate.getHours()).padStart(2, "0");
      const minutes = String(endDate.getMinutes()).padStart(2, "0");
      const endTimeString = `${year}-${month}-${day}T${hours}:${minutes}`;

      setFormState((prev) => ({
        ...prev,
        endTime: endTimeString,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if patient has a medical history
    if (mostRecentMedicalHistoryId === null) {
      alert(
        "This patient doesn't have a medical history record yet. A medical history must be created before booking an appointment. Please contact staff for assistance."
      );
      return;
    }

    // Create FormData with PascalCase field names as expected by the API
    const formData = new FormData();
    formData.append("DoctorId", formState.doctorId);
    formData.append("BookByUserId", patientId.toString());
    formData.append("StartTime", formState.startTime);
    formData.append("EndTime", formState.endTime);
    formData.append("Price", formState.price); // Default to 0
    formData.append("AppointmentStatus", formState.appointmentStatus); // Default to 0 (Booked)
    formData.append("MedicalHistoryId", mostRecentMedicalHistoryId.toString());

    console.log("Submitting appointment with data:", {
      DoctorId: formState.doctorId,
      BookByUserId: patientId.toString(),
      StartTime: formState.startTime,
      EndTime: formState.endTime,
      Price: formState.price,
      AppointmentStatus: formState.appointmentStatus,
      MedicalHistoryId: mostRecentMedicalHistoryId.toString(),
    });

    createMutation.mutate(formData);
  };

  const isFormValid =
    formState.doctorId && formState.startTime && formState.endTime;

  // Get minimum date/time (current time)
  const now = new Date();
  const minDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-2">
              <Plus className="size-6 text-green-600" />
            </div>
            <div>
              <DialogTitle>Book New Appointment</DialogTitle>
              <DialogDescription>
                Schedule an appointment for {patientName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="doctorId">Doctor *</Label>
            <Select
              value={formState.doctorId}
              onValueChange={(value) => handleChange("doctorId", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id.toString()}>
                    <div className="flex flex-col items-start">
                      <span>
                        Dr. {doctor.firstName} {doctor.lastName}
                      </span>
                      {doctor.department && (
                        <span className="text-xs text-muted-foreground">
                          {doctor.department.name}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time *</Label>
            <Input
              id="startTime"
              type="datetime-local"
              value={formState.startTime}
              min={minDateTime}
              onChange={(e) => handleChange("startTime", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endTime">End Time *</Label>
            <Input
              id="endTime"
              type="datetime-local"
              value={formState.endTime}
              min={formState.startTime || minDateTime}
              onChange={(e) => handleChange("endTime", e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              End time is automatically set to 1 hour after start time
            </p>
          </div>

          {/* Medical History Status */}
          {mostRecentMedicalHistoryId ? (
            <div className="rounded-lg bg-green-50 p-3">
              <p className="text-sm text-green-800">
                <strong>✓ Medical History:</strong> Found (ID:{" "}
                {mostRecentMedicalHistoryId})
              </p>
            </div>
          ) : (
            <div className="rounded-lg bg-red-50 p-3">
              <p className="text-sm text-red-800">
                <strong>⚠ Medical History Required:</strong> No medical history
                found. Please contact staff to create one before booking.
              </p>
            </div>
          )}

          {/* Note about consultation fee */}
          <div className="rounded-lg bg-blue-50 p-3">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> The consultation fee will be determined and
              set by medical staff after your examination.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || !isFormValid}
            >
              {createMutation.isPending && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              Book Appointment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
