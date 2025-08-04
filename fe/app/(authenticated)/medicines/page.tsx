import MedicinePageClient from "./page.client";

import { requireStaffRole } from "@/lib/auth-guard";

export default async function MedicinePage() {
  // Protect this page - only allow staff roles
  await requireStaffRole();

  return <MedicinePageClient />;
}
