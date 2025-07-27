import { useMutation } from "@tanstack/react-query";

import {
  createDoctor,
  deleteDoctorById,
  updateDoctor,
} from "@/lib/api/doctor.actions";

export const useEditAppointment = () => {
  const create = useMutation({
    mutationFn: (formData: FormData) => createDoctor(formData),
  });

  const update = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      updateDoctor(id, formData),
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteDoctorById(id),
  });
  return { create, update, remove };
};
