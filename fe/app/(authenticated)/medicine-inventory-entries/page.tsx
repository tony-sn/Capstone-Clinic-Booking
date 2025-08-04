import { requireStaffRole } from "@/lib/auth-guard";

import MedicineInventoryEntryPageClient from "./page.client";

export default async function MedicineInventoryEntryPage() {
  // Protect this page - only allow staff roles
  await requireStaffRole();

  return <MedicineInventoryEntryPageClient />;
}
