"use client";

import { User } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePatientAppointments } from "@/hooks/appointments/useAppointments";
import { usePatientMedicalHistories } from "@/hooks/medicalhistories/useMedicalhistories";
import type { User as UserType } from "@/types/user";

import MedicalHistoryList from "./MedicalHistoryList";

interface PatientDetailsDialogProps {
  patient: UserType;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function PatientDetailsDialog({
  patient,
  trigger,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: PatientDetailsDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  // Use external control if provided, otherwise use internal state
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;

  const {
    data: medicalHistoryData,
    isLoading: medicalLoading,
    error: medicalError,
  } = usePatientMedicalHistories(
    {
      patientId: patient.id,
      pageSize: 0,
      pageNumber: 1,
    },
    {
      enabled: open, // Only fetch when dialog is open
    }
  );

  const { data: appointmentsData } = usePatientAppointments(
    {
      patientId: patient.id,
      pageSize: 0,
      pageNumber: 1,
    },
    {
      enabled: open, // Only fetch when dialog is open
    }
  );

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <User className="mr-2 size-4" />
      View Records
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Only render trigger if one is provided or if not using external control */}
      {(trigger || externalOpen === undefined) && (
        <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      )}
      <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="size-5" />
            Patient Details - {patient.firstName} {patient.lastName}
          </DialogTitle>
          <DialogDescription>
            View medical history and appointment records for this patient
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Basic Info */}
          <div className="grid grid-cols-1 gap-4 rounded-lg bg-muted/50 p-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Patient ID
              </p>
              <p className="text-base">#{patient.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-base">{patient.username}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Status
              </p>
              <Badge
                variant={
                  patient.roles && patient.roles.length > 0
                    ? "default"
                    : "secondary"
                }
              >
                {patient.roles && patient.roles.length > 0
                  ? "Active"
                  : "Inactive"}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Roles</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {patient.roles && patient.roles.length > 0 ? (
                  patient.roles.map((role, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {role}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    No roles
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h3 className="font-medium text-blue-900">Medical Records</h3>
              <p className="text-2xl font-bold text-blue-700">
                {medicalHistoryData?.data?.length || 0}
              </p>
              <p className="text-sm text-blue-600">Total records</p>
            </div>
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <h3 className="font-medium text-green-900">Appointments</h3>
              <p className="text-2xl font-bold text-green-700">
                {appointmentsData?.data?.length || 0}
              </p>
              <p className="text-sm text-green-600">Total appointments</p>
            </div>
          </div>

          {/* Medical History Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Medical History</h3>
              <p className="text-sm text-muted-foreground">
                Patient&apos;s medical records and associated appointments
              </p>
            </div>

            {medicalLoading ? (
              <div className="p-8 text-center text-muted-foreground">
                Loading medical history...
              </div>
            ) : medicalError ? (
              <div className="p-8 text-center text-red-500">
                Error loading medical history. Please try again.
              </div>
            ) : medicalHistoryData && medicalHistoryData.data.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                <MedicalHistoryList
                  medicalHistoryData={medicalHistoryData}
                  patientId={patient.id}
                />
              </div>
            ) : (
              <div className="rounded-lg border p-8 text-center text-muted-foreground">
                No medical history records found for this patient.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
