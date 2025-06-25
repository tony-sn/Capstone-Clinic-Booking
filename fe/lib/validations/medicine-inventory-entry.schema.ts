import { z } from "zod";

export const MedicineInventoryEntrySchema = z.object({
  changeType: z.enum(["0", "1", "2", "3"]),
  quantity: z.coerce.number().nonnegative(),
  companyName: z.coerce.string().nullable(),
  note: z.coerce.string().nullable(),
});
