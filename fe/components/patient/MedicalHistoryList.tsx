"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePatientAppointments } from "@/hooks/appointments/useAppointments";
import type { Appointment } from "@/types/appointment";
import type { MedicalHistoriesResponse } from "@/types/medicalHistory";

import AppointmentDetail from "./AppointmentDetail";
import MedicalHistoryDetail from "./MedicalHistoryDetail";

interface MedicalHistoryListProps {
  medicalHistoryData: MedicalHistoriesResponse;
  patientId: number;
}

export default function MedicalHistoryList({
  medicalHistoryData,
  patientId,
}: MedicalHistoryListProps) {
  const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(
    null
  );
  const [selectedAppointmentHistoryId, setSelectedAppointmentHistoryId] =
    useState<number | null>(null);

  const { data: appointmentsData } = usePatientAppointments({
    patientId,
    pageSize: 0,
    pageNumber: 1,
  });

  const filteredData = medicalHistoryData.data.filter(
    (history) => history.patientId === patientId && history.active
  );

  // Helper function to find appointment by medical history ID
  const findAppointmentByMedicalHistoryId = (
    medicalHistoryId: number
  ): Appointment | undefined => {
    return appointmentsData?.data.find(
      (appointment) => appointment.medicalHistoryId === medicalHistoryId
    );
  };

  if (selectedHistoryId) {
    return (
      <MedicalHistoryDetail
        medicalHistoryId={selectedHistoryId}
        onBack={() => setSelectedHistoryId(null)}
      />
    );
  }

  if (selectedAppointmentHistoryId) {
    return (
      <AppointmentDetail
        medicalHistoryId={selectedAppointmentHistoryId}
        onBack={() => setSelectedAppointmentHistoryId(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      {filteredData.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="py-8 text-center text-muted-foreground">
              No medical history records found.
              <br />
              Your medical records will appear here once you have appointments.
            </p>
          </CardContent>
        </Card>
      ) : (
        filteredData.map((history) => (
          <Card
            key={history.medicalHistoryId}
            className="transition-shadow hover:shadow-md"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Medical Record #{history.medicalHistoryId}
                </CardTitle>
                <Badge variant={history.active ? "default" : "secondary"}>
                  {history.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {history.symptoms && (
                  <div>
                    <span className="font-medium">Symptoms: </span>
                    <span className="text-muted-foreground">
                      {history.symptoms}
                    </span>
                  </div>
                )}
                {history.diagnosis && (
                  <div>
                    <span className="font-medium">Diagnosis: </span>
                    <span className="text-muted-foreground">
                      {history.diagnosis}
                    </span>
                  </div>
                )}
                {history.totalAmount > 0 && (
                  <div>
                    <span className="font-medium">Total Amount: </span>
                    <span className="text-muted-foreground">
                      ${history.totalAmount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() =>
                      setSelectedHistoryId(history.medicalHistoryId)
                    }
                    variant="outline"
                  >
                    View Details
                  </Button>
                  {findAppointmentByMedicalHistoryId(
                    history.medicalHistoryId
                  ) && (
                    <Button
                      onClick={() =>
                        setSelectedAppointmentHistoryId(
                          history.medicalHistoryId
                        )
                      }
                      variant="secondary"
                    >
                      View Appointment
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
