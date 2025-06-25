import { useMutation } from "@tanstack/react-query";

import {
  createLaboratoryTest,
  deleteLaboratoryTestById,
  updateLaboratoryTest,
} from "@/lib/api/laboratory-test.actions";

export const useEditLaboratoryTest = () => {
  const create = useMutation({
    mutationFn: (formData: FormData) => createLaboratoryTest(formData),
  });

  const update = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      updateLaboratoryTest(id, formData),
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteLaboratoryTestById(id),
  });

  return { create, update, remove };
};
