import { z } from "zod";

export const MedicineFormSchema = z.object({
  medicineName: z.string().min(1, "Medicine name is required"),
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().nonnegative(),
  unitPrice: z.coerce.number().nonnegative(),
});
