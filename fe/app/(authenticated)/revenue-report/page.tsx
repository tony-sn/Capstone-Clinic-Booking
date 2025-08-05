import { requireStaffRole } from "@/lib/auth-guard";

import RevenueReportPageClient from "./page.client";

export default async function RevenueReportPage() {
  // Protect this page - only allow staff roles
  await requireStaffRole();

  return <RevenueReportPageClient />;
}
