import PrescriptionPageClient from "./page.client";

import { requireStaffRole } from "@/lib/auth-guard";

export default async function PrescriptionPage() {
  // Protect this page - only allow staff roles
  await requireStaffRole();

  return <PrescriptionPageClient />;
}
