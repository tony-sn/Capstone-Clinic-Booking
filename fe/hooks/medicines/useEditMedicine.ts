import { useMutation } from "@tanstack/react-query";

import {
  createMedicine,
  deleteMedicineById,
  updateMedicine,
} from "@/lib/api/medicine.actions";

export const useEditMedicine = () => {
  const create = useMutation({
    mutationFn: (formData: FormData) => createMedicine(formData),
  });

  const update = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      updateMedicine(id, formData),
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteMedicineById(id),
  });

  return { create, update, remove };
};
