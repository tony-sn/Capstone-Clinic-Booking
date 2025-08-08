import { requireStaffRole } from "@/lib/auth-guard";

import AdminPageClient from "./page.client";

export default async function AdminPage() {
  await requireStaffRole();

  return <AdminPageClient />;
}