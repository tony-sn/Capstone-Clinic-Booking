import { useMutation } from "@tanstack/react-query";

import {
  createMedicineInventoryEntry,
  deleteMedicineInventoryEntryById,
  updateMedicineInventoryEntry,
} from "@/lib/api/medicine-inventory-entry.actions";

export const useEditMedicineInventoryEntry = () => {
  const create = useMutation({
    mutationFn: (formData: FormData) => createMedicineInventoryEntry(formData),
  });

  const update = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      updateMedicineInventoryEntry(id, formData),
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteMedicineInventoryEntryById(id),
  });

  return { create, update, remove };
};
