import { useMutation } from "@tanstack/react-query";
import {
  createMedicalHistory,
  updateMedicalHistory,
  // deleteMedicalHistoryById, // Add this if you have delete function
} from "@/lib/api/medical-history.action";

export const useEditMedicalHistory = () => {
  const create = useMutation({
    mutationFn: (formData: FormData) => createMedicalHistory(formData),
  });

  const update = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      updateMedicalHistory(id, formData),
  });

  // Uncomment if you have delete function
  // const remove = useMutation({
  //   mutationFn: (id: number) => deleteMedicalHistoryById(id),
  // });

  return { 
    create, 
    update, 
    // remove 
  };
};