import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getUserInfo } from "@/lib/api/patient.actions";
import { signInPath } from "@/paths";

export default async function PatientMedicalHistoryPage({
  params,
}: {
  params: { userId: string };
}) {
  const headersList = await headers();
  const headersObj = Object.fromEntries(headersList.entries());
  const { response, data: userInfo } = await getUserInfo({
    headers: headersObj,
  });

  if (response.status !== 200 || !userInfo) {
    redirect(signInPath());
  }

  // Ensure the user can only access their own medical history
  if (userInfo.id.toString() !== params.userId) {
    redirect(signInPath());
  }

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

        <div className="rounded-lg border bg-card shadow-sm text-card-foreground">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Medical Records</h2>
            </div>
            <div className="mt-6">
              <p className="text-center text-muted-foreground py-8">
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
