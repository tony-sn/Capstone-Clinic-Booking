import TransactionPageClient from "./page.client";

import { requireStaffRole } from "@/lib/auth-guard";

export default async function TransactionPage() {
  // Protect this page - only allow staff roles
  await requireStaffRole();

  return <TransactionPageClient />;
}
