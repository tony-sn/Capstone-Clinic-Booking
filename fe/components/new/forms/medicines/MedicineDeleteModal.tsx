import React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useEditMedicine } from "@/hooks/medicines/useEditMedicine";

interface Props {
  medicineId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MedicineDeleteModal({
  medicineId,
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const { remove } = useEditMedicine();

  const handleDelete = async () => {
    if (!medicineId) return;
    try {
      await remove.mutateAsync(medicineId);
      onSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Medicine</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete this medicine?</p>
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
