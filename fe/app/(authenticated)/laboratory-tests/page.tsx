import LaboratoryTestPageClient from "./page.client";

import { requireStaffRole } from "@/lib/auth-guard";

export default async function LaboratoryTestPage() {
  // Protect this page - only allow staff roles
  await requireStaffRole();

  return <LaboratoryTestPageClient />;
}
