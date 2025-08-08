import { requireSpecificPatient } from "@/lib/auth-guard";

import PatientTransactionsClient from "./page.client";

export default async function PatientTransactionsPage({
  params,
}: {
  params: { userId: string };
}) {
  // Ensure only the specific patient can access their own transactions
  await requireSpecificPatient(params.userId);

  return <PatientTransactionsClient userId={params.userId} />;
}
