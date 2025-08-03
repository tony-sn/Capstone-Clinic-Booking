import { requireSpecificPatient } from "@/lib/auth-guard";
import { getAllMedicalHistory } from "@/lib/api/medical-history.action";
import MedicalHistoryList from "@/components/patient/MedicalHistoryList";

export default async function PatientMedicalHistoryPage({
  params,
}: {
  params: { userId: string };
}) {
  // Ensure only the specific patient can access their own medical history
  const { userInfo } = await requireSpecificPatient(params.userId);
  
  // Fetch medical history data
  const medicalHistoryData = await getAllMedicalHistory({
    pageSize: 10,
    pageNumber: 1,
  });

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

        <MedicalHistoryList 
          medicalHistoryData={medicalHistoryData}
          patientId={parseInt(params.userId)}
        />
      </div>
    </div>
  );
}
