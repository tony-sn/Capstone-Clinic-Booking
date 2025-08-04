import MedicineInventoryEntryPageClient from "./page.client";

import { requireStaffRole } from "@/lib/auth-guard";

export default async function MedicineInventoryEntryPage() {
  // Protect this page - only allow staff roles
  await requireStaffRole();

  return <MedicineInventoryEntryPageClient />;
}
