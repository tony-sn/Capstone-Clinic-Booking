import { requireStaffRole } from "@/lib/auth-guard";

import TransactionPageClient from "./page.client";

export default async function TransactionPage() {
  // Protect this page - only allow staff roles
  await requireStaffRole();

  return <TransactionPageClient />;
}
