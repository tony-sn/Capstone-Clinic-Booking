import RevenueReportPageClient from "./page.client";

import { requireStaffRole } from "@/lib/auth-guard";

export default async function RevenueReportPage() {
  // Protect this page - only allow staff roles
  await requireStaffRole();

  return <RevenueReportPageClient />;
}
