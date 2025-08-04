import { requireStaffRole } from "@/lib/auth-guard";

import MedicinePageClient from "./page.client";

export default async function MedicinePage() {
  // Protect this page - only allow staff roles
  await requireStaffRole();

  return <MedicinePageClient />;
}
