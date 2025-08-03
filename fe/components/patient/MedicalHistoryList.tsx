"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { MedicalHistoriesResponse } from "@/types/medicalHistory";
import MedicalHistoryDetail from "./MedicalHistoryDetail";

interface MedicalHistoryListProps {
  medicalHistoryData: MedicalHistoriesResponse;
  patientId: number;
}

export default function MedicalHistoryList({
  medicalHistoryData,
  patientId,
}: MedicalHistoryListProps) {
  const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(null);

  const filteredData = medicalHistoryData.data.filter(
    (history) => history.patientId === patientId && history.active
  );

  if (selectedHistoryId) {
    return (
      <MedicalHistoryDetail
        medicalHistoryId={selectedHistoryId}
        onBack={() => setSelectedHistoryId(null)}
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
          <Card key={history.medicalHistoryId} className="hover:shadow-md transition-shadow">
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
                    <span className="text-muted-foreground">{history.symptoms}</span>
                  </div>
                )}
                {history.diagnosis && (
                  <div>
                    <span className="font-medium">Diagnosis: </span>
                    <span className="text-muted-foreground">{history.diagnosis}</span>
                  </div>
                )}
                {history.totalAmount > 0 && (
                  <div>
                    <span className="font-medium">Total Amount: </span>
                    <span className="text-muted-foreground">${history.totalAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-4">
                  <Button 
                    onClick={() => setSelectedHistoryId(history.medicalHistoryId)}
                    variant="outline"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}