import AppointmentPageClient from "./page.client";

import { requireStaffRole } from "@/lib/auth-guard";

export default async function AppointmentPage() {
  // Protect this page - only allow staff roles
  await requireStaffRole();

  return <AppointmentPageClient />;
}
