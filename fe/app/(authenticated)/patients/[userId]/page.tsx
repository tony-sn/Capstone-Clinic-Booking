import PatientPageContent from "./PatientPageContent";

import { requireSpecificPatient } from "@/lib/auth-guard";

export default async function PatientPage({
  params,
}: {
  params: { userId: string };
}) {
  // Ensure only the specific patient can access their own data
  await requireSpecificPatient(params.userId);

  return <PatientPageContent userId={params.userId} />;
}
