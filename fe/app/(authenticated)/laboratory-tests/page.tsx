import { requireStaffRole } from "@/lib/auth-guard";

import LaboratoryTestPageClient from "./page.client";

export default async function LaboratoryTestPage() {
  // Protect this page - only allow staff roles
  await requireStaffRole();

  return <LaboratoryTestPageClient />;
}
