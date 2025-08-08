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
    price: "",
    appointmentStatus: "0", // Default to "Booked"
  });

  const { data: doctorsResponse } = useDoctors({
    pageSize: 100,
    pageNumber: 1,
  });
  const queryClient = useQueryClient();

  const doctors = doctorsResponse?.data || [];

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
      const startDate = new Date(value);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Add 1 hour
      const endTimeString = endDate.toISOString().slice(0, 16);
      setFormState((prev) => ({
        ...prev,
        endTime: endTimeString,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("doctorId", formState.doctorId);
    formData.append("bookByUserId", patientId.toString());
    formData.append("startTime", formState.startTime);
    formData.append("endTime", formState.endTime);
    formData.append("price", formState.price);
    formData.append("appointmentStatus", formState.appointmentStatus);
    formData.append("active", "true");

    createMutation.mutate(formData);
  };

  const isFormValid =
    formState.doctorId &&
    formState.startTime &&
    formState.endTime &&
    formState.price;

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

          <div className="space-y-2">
            <Label htmlFor="price">Consultation Fee *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formState.price}
                onChange={(e) => handleChange("price", e.target.value)}
                className="pl-8"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formState.appointmentStatus}
              onValueChange={(value) =>
                handleChange("appointmentStatus", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Booked</SelectItem>
                <SelectItem value="1">Pending</SelectItem>
              </SelectContent>
            </Select>
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
