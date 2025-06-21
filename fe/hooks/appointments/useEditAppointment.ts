import { useMutation } from "@tanstack/react-query";

import {
  createAppointment,
  deleteAppointmentById,
  updateAppointment,
} from "@/lib/api/appointment.actions";

export const useEditAppointment = () => {
  const create = useMutation({
    mutationFn: (formData: FormData) => createAppointment(formData),
  });

  const update = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      updateAppointment(id, formData),
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteAppointmentById(id),
  });
  return { create, update, remove };
};
