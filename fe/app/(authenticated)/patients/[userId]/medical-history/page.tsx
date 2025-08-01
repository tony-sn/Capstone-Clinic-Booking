import { requireSpecificPatient } from "@/lib/auth-guard";

export default async function PatientMedicalHistoryPage({
  params,
}: {
  params: { userId: string };
}) {
  // Ensure only the specific patient can access their own medical history
  await requireSpecificPatient(params.userId);

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            My Medical History
          </h1>
          <p className="text-muted-foreground">
            View your complete medical history and records
          </p>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Medical Records</h2>
            </div>
            <div className="mt-6">
              <p className="py-8 text-center text-muted-foreground">
                Your medical history will be displayed here.
                <br />
                This section will show your medical records, diagnoses,
                treatments, and other health information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
