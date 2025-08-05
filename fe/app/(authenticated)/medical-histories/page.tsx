import { requireStaffRole } from "@/lib/auth-guard";

import MedicalHistoriesPageClient from "./page.client";

export default async function MedicalHistoriesPage() {
  // Protect this page - only allow staff roles
  await requireStaffRole();

  return <MedicalHistoriesPageClient />;
}
