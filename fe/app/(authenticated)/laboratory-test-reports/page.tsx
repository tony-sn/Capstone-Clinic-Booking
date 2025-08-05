import { requireStaffRole } from "@/lib/auth-guard";

import MedicalHistoryLayoutClient from "./page.client";

interface MedicalHistoryLayoutProps {
  showFilters?: boolean;
}

export default async function MedicalHistoryLayout({
  showFilters = true,
}: MedicalHistoryLayoutProps) {
  // Protect this page - only allow staff roles
  await requireStaffRole();

  return <MedicalHistoryLayoutClient showFilters={showFilters} />;
}
