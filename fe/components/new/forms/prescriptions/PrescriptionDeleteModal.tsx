import React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useEditPrescription } from "@/hooks/prescriptions/useEditPrescription";

interface Props {
  prescriptionId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PrescriptionDeleteModal({
  prescriptionId,
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const { remove } = useEditPrescription();

  const handleDelete = async () => {
    if (!prescriptionId) return;
    try {
      await remove.mutateAsync(prescriptionId);
      onSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Prescription</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete this prescription?</p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
