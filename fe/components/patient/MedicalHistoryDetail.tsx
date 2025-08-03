"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getMedicalHistoryById } from "@/lib/api/medical-history.action";
import type { MedicalHistory } from "@/types/medicalHistory";
import AppointmentDetail from "./AppointmentDetail";

interface MedicalHistoryDetailProps {
  medicalHistoryId: number;
  onBack: () => void;
}

export default function MedicalHistoryDetail({
  medicalHistoryId,
  onBack,
}: MedicalHistoryDetailProps) {
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAppointmentDetail, setShowAppointmentDetail] = useState(false);

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        setLoading(true);
        const response = await getMedicalHistoryById(medicalHistoryId);
        setMedicalHistory(response.data);
      } catch (err) {
        setError("Failed to load medical history details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalHistory();
  }, [medicalHistoryId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading medical history details...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !medicalHistory) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to List
            </Button>
          </div>
          <div className="text-center py-8 text-red-500">
            {error || "Medical history not found"}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showAppointmentDetail) {
    return (
      <AppointmentDetail
        medicalHistoryId={medicalHistoryId}
        onBack={() => setShowAppointmentDetail(false)}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to List
          </Button>
          <CardTitle>Medical Record #{medicalHistory.medicalHistoryId}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Medical Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Symptoms</label>
                <p className="mt-1">{medicalHistory.symptoms || "No symptoms recorded"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Diagnosis</label>
                <p className="mt-1">{medicalHistory.diagnosis || "No diagnosis recorded"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Treatment Instructions</label>
                <p className="mt-1">{medicalHistory.treatmentInstructions || "No instructions recorded"}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Additional Details</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Doctor ID</label>
                <p className="mt-1">{medicalHistory.doctorId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Total Amount</label>
                <p className="mt-1">${medicalHistory.totalAmount.toFixed(2)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <p className="mt-1">{medicalHistory.active ? "Active" : "Inactive"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button 
            onClick={() => setShowAppointmentDetail(true)}
            className="w-full md:w-auto"
          >
            View Related Appointments
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}