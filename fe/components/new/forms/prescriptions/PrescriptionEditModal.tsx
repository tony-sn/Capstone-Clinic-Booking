"use client";

import { Save, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEditPrescription } from "@/hooks/prescriptions/useEditPrescription";
import { getPrescriptionById } from "@/lib/api/prescription.actions";

interface Props {
  prescriptionId?: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function PrescriptionEditModal({
  prescriptionId,
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const isEditMode = !!prescriptionId;
  const { create, update } = useEditPrescription();
  const [totalAmount, setTotalAmount] = useState<string>("");
  const [medicalHistoryId, setMedicalHistoryId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && prescriptionId && isOpen) {
      setLoading(true);
      getPrescriptionById(prescriptionId)
        .then((res) => {
          setTotalAmount(res?.data.totalAmount.toString());
          setMedicalHistoryId(res?.data.medicalHistoryID.toString());
        })
        .finally(() => setLoading(false));
    } else {
      setTotalAmount("");
    }
  }, [prescriptionId, isEditMode, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "MedicalHistoryID") {
      setMedicalHistoryId(value);
    } else {
      setTotalAmount(value);
    }
  };

  const handleSubmit = async () => {
    const form = new FormData();
    form.append("MedicalHistoryID", medicalHistoryId);
    form.append("TotalAmount", totalAmount);

    try {
      if (isEditMode && prescriptionId) {
        console.log("is updating");
        await update.mutateAsync({ id: prescriptionId, formData: form });
      } else {
        await create.mutateAsync(form);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Failed to save prescription", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Prescription" : "Create Prescription"}
          </DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="py-8 text-center">
            <Loader2 className="mx-auto size-6 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <Label htmlFor="MedicalHistoryID">Medical History ID</Label>
              <Input
                type="text"
                name="MedicalHistoryID"
                placeholder="Medical History ID"
                value={medicalHistoryId}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-4">
              <Label htmlFor="totalAmount">Total Amount</Label>
              <Input
                type="text"
                name="TotalAmount"
                placeholder="Total Amount"
                value={totalAmount}
                onChange={handleChange}
              />
            </div>
          </>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            <Save className="mr-2 size-4" />
            {isEditMode ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
