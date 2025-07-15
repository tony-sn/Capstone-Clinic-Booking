import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { getMedicineById } from "@/lib/api/medicine.actions";
import { Medicine } from "@/types/medicines";

interface Props {
  medicineId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MedicineDetailModal({
  medicineId,
  isOpen,
  onClose,
}: Props) {
  const [medicine, setMedicine] = useState<Medicine | null>(null);

  useEffect(() => {
    if (medicineId && isOpen) {
      getMedicineById(medicineId).then((res) => setMedicine(res.data));
    }
  }, [medicineId, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Medicine Detail</DialogTitle>
        </DialogHeader>
        {medicine ? (
          <div className="space-y-2">
            <p>
              <strong>ID:</strong> {medicine.medicineID}
            </p>
            <p>
              <strong>Name:</strong> {medicine.medicineName}
            </p>
            <p>
              <strong>Description:</strong> {medicine.description}
            </p>
            <p>
              <strong>Quantity:</strong> {medicine.quantity}
            </p>
            <p>
              <strong>Unit Price:</strong> {medicine.unitPrice}
            </p>
          </div>
        ) : (
          <div>Loading...</div>
        )}
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
