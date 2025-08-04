import MedicalHistoryLayoutClient from "./page.client";

import { requireStaffRole } from "@/lib/auth-guard";

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
