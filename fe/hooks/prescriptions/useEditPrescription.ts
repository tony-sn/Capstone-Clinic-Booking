import { useMutation } from "@tanstack/react-query";

import {
  createPrescription,
  deletePrescriptionById,
  updatePrescription,
} from "@/lib/api/prescription.actions";

export const useEditPrescription = () => {
  const create = useMutation({
    mutationFn: (formData: FormData) => createPrescription(formData),
  });

  const update = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      updatePrescription(id, formData),
  });

  const remove = useMutation({
    mutationFn: (id: number) => deletePrescriptionById(id),
  });

  return { create, update, remove };
};
