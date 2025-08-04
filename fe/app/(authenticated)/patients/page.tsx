import { requireStaffRole } from "@/lib/auth-guard";

import PatientsContent from "./PatientsContent";

export default async function PatientsPage() {
  // Protect this page - only allow staff roles
  await requireStaffRole();

  return <PatientsContent />;
}
