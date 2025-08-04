import MedicalHistoriesPageClient from "./page.client";

import { requireStaffRole } from "@/lib/auth-guard";

export default async function MedicalHistoriesPage() {
  // Protect this page - only allow staff roles
  await requireStaffRole();

  return <MedicalHistoriesPageClient />;
}
