"use client";
import MedicalHistoryList from "@/components/patient/MedicalHistoryList";
import PatientAppointmentList from "@/components/patient/PatientAppointmentList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePatientAppointments } from "@/hooks/appointments/useAppointments";
import { usePatientMedicalHistories } from "@/hooks/medicalhistories/useMedicalhistories";
import { useUsers } from "@/hooks/users/useUsers";

interface PatientPageContentProps {
  userId: string;
}

// Loading state component
const LoadingState = () => (
  <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
    <div className="p-6">
      <p className="py-8 text-center text-muted-foreground">
        Loading medical history...
      </p>
    </div>
  </div>
);

// Error state component
const ErrorState = () => (
  <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
    <div className="p-6">
      <p className="py-8 text-center text-red-500">
        Error loading medical history. Please try again.
      </p>
    </div>
  </div>
);

// Empty state component
const EmptyState = () => (
  <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
    <div className="p-6">
      <p className="py-8 text-center text-muted-foreground">
        No medical history data available.
        <br />
        Your medical records will appear here once you have appointments.
      </p>
    </div>
  </div>
);

// Header component
const PageHeader = () => (
  <div>
    <h1 className="text-3xl font-bold tracking-tight">My Medical Records</h1>
    <p className="text-muted-foreground">
      View your medical history and appointment details
    </p>
  </div>
);

export default function PatientPageContent({
  userId,
}: PatientPageContentProps) {
  const patientId = parseInt(userId);

  // Fetch user data to get patient name
  const { data: users = [] } = useUsers();
  const patient = users.find((user) => user.id === patientId);
  const patientName = patient
    ? `${patient.firstName} ${patient.lastName}`
    : "Patient";

  const {
    data: medicalHistoryData,
    isLoading: medicalLoading,
    error: medicalError,
  } = usePatientMedicalHistories({
    patientId,
    pageSize: 0,
    pageNumber: 1,
  });

  const { data: appointmentsData } = usePatientAppointments({
    patientId,
    pageSize: 0,
    pageNumber: 1,
  });

  // Render medical history content
  const renderMedicalHistoryContent = () => {
    if (medicalLoading) {
      return <LoadingState />;
    }

    if (medicalError) {
      return <ErrorState />;
    }

    if (!medicalHistoryData || medicalHistoryData.data.length === 0) {
      return <EmptyState />;
    }

    return (
      <MedicalHistoryList
        medicalHistoryData={medicalHistoryData}
        patientId={patientId}
      />
    );
  };

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="space-y-6">
        <PageHeader />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <h3 className="font-medium text-green-900">My Appointments</h3>
            <p className="text-2xl font-bold text-green-700">
              {appointmentsData?.data?.length || 0}
            </p>
            <p className="text-sm text-green-600">Total appointments</p>
          </div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h3 className="font-medium text-blue-900">Medical Records</h3>
            <p className="text-2xl font-bold text-blue-700">
              {medicalHistoryData?.data?.length || 0}
            </p>
            <p className="text-sm text-blue-600">Total records</p>
          </div>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="appointments">My Appointments</TabsTrigger>
            <TabsTrigger value="medical-history">Medical History</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-6">
            <PatientAppointmentList
              patientId={patientId}
              patientName={patientName}
            />
          </TabsContent>

          <TabsContent value="medical-history" className="space-y-6">
            {renderMedicalHistoryContent()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
