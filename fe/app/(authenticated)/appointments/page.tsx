import { requireStaffRole } from "@/lib/auth-guard";

import AppointmentPageClient from "./page.client";

export default async function AppointmentPage() {
  // Protect this page - only allow staff roles
  await requireStaffRole();

  return <AppointmentPageClient />;
}
