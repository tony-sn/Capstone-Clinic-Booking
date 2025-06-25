import { z } from "zod";

export const LaboratoryTestFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().nonnegative(),
});
