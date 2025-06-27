import { z } from "zod";

export const PrescriptionSchema = z.object({
  prescriptionId: z.coerce.number(),
  medicalHistoryId: z
    .union([z.coerce.number().positive(), z.literal("")])
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  totalAmount: z
    .union([z.coerce.number().positive(), z.literal("")])
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
});
