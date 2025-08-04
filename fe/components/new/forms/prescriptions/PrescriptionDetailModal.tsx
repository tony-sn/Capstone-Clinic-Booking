import Link from "next/link";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useMedicalDetail } from "@/hooks/medicalhistories/useMedicalhistories";
import { useGetPrescriptionDetail } from "@/hooks/prescriptions/usePrescriptions";
import { getPrescriptionById } from "@/lib/api/prescription.actions";

interface Props {
  prescriptionId: number | null;
  medicalHistoryId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function PrescriptionDetailModal({
  medicalHistoryId,
  prescriptionId,
  isOpen,
  onClose,
}: Props) {
  // eslint-disable-next-line
  const [data, setData] = useState<any | null>(null);

  const { data: medicalHistory, isLoading: isMedicalLoading } =
    useMedicalDetail({
      medicalHistoryId,
    });
  const {
    data: prescriptionDetailData,
    isLoading: isPrescriptionDetailLoading,
  } = useGetPrescriptionDetail();

  useEffect(() => {
    if (
      prescriptionId &&
      medicalHistory &&
      isOpen &&
      prescriptionDetailData?.data
    ) {
      getPrescriptionById(prescriptionId).then((data) =>
        setData({
          prescription: data?.data,
          medicalHistory: medicalHistory?.data,
          prescriptionDetails: prescriptionDetailData?.data,
        })
      );
    }
  }, [prescriptionId, medicalHistory, isOpen, prescriptionDetailData]);

  if (isMedicalLoading || isPrescriptionDetailLoading)
    return <p>Loading data...</p>;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Prescription Detail</DialogTitle>
        </DialogHeader>
        {data ? (
          <div className="space-y-4 text-sm">
            <p>
              <strong>ID:</strong> {data.prescription.prescriptionID}
            </p>
            <p>
              <strong>Total Amount:</strong> ${data.prescription.totalAmount}
            </p>

            <div>
              <strong>Diagnosis:</strong>{" "}
              {data.medicalHistory.diagnosis ?? "N/A"}
            </div>
            <div>
              <strong>Symptoms:</strong> {data.medicalHistory.symptoms ?? "N/A"}
            </div>
            <div>
              <strong>Instructions:</strong>{" "}
              {data.medicalHistory.treatmentInstructions}
            </div>
            <div className="flex gap-4">
              <Link
                href={`/patients/${data.medicalHistory.patientId}`}
                className="text-blue-600 underline"
              >
                View Patient
              </Link>
              <Link
                href={`/doctors/${data.medicalHistory.doctorId}`}
                className="text-blue-600 underline"
              >
                View Doctor
              </Link>
            </div>
            <div>
              <strong>Medicines:</strong>
              <ul className="ml-4 list-disc">
                {/* eslint-disable-next-line */}
                {data.prescriptionDetails.map((item: any, idx: number) => (
                  <li key={idx}>
                    Medicine #{item.medicineID} - Qty: {item.quantity} - $
                    {item.amount} - <em>{item.usage}</em>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
