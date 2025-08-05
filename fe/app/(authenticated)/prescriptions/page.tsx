import { requireStaffRole } from "@/lib/auth-guard";

import PrescriptionPageClient from "./page.client";

export default async function PrescriptionPage() {
  // Protect this page - only allow staff roles
  await requireStaffRole();

  return <PrescriptionPageClient />;
}
