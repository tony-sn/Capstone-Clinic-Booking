import { useMutation } from "@tanstack/react-query";

import { updateDoctor } from "@/lib/api/doctor.actions";
import { DoctorDTO } from "@/types/doctor";

export const useEditDoctor = () => {
  return useMutation<DoctorDTO, unknown, { id: number; formData: FormData }>({
    mutationFn: async ({ id, formData }) => {
      const result = await updateDoctor(id, formData);

      if (result.success && result.data) {
        return result.data; // Trả về đúng kiểu DoctorDTO
      } else {
        throw new Error(result.error || "Failed to update doctor");
      }
    },
    onSuccess: (data) => {
      console.log("Doctor updated successfully", data);
    },
    onError: (error) => {
      console.error("Error updating doctor:", error);
    },
  });
};
