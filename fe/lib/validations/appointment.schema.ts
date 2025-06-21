import { z } from "zod";

export const AppointmentFormSchema = z.object({
  doctorId: z.coerce.number().min(1, "Doctor ID is required"),
  bookByUserId: z.coerce.number().min(1, "User ID is required"),
  startTime: z.date(),
  endTime: z.date(),
  price: z
    .union([z.coerce.number().positive(), z.literal("")])
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  appointmentStatus: z.string().min(1, "Status is required"),
  medicalHistoryId: z
    .union([z.coerce.number().positive(), z.literal("")])
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
});
