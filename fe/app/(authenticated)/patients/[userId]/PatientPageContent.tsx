"use client";
import MedicalHistoryList from "@/components/patient/MedicalHistoryList";
import { usePatientMedicalHistories } from "@/hooks/medicalhistories/useMedicalhistories";

interface PatientPageContentProps {
  userId: string;
}

// Loading state component
const LoadingState = () => (
  <div className="bg-card text-card-foreground rounded-lg border shadow-sm">
    <div className="p-6">
      <p className="text-muted-foreground py-8 text-center">
        Loading medical history...
      </p>
    </div>
  </div>
);

// Error state component
const ErrorState = () => (
  <div className="bg-card text-card-foreground rounded-lg border shadow-sm">
    <div className="p-6">
      <p className="py-8 text-center text-red-500">
        Error loading medical history. Please try again.
      </p>
    </div>
  </div>
);

// Empty state component
const EmptyState = () => (
  <div className="bg-card text-card-foreground rounded-lg border shadow-sm">
    <div className="p-6">
      <p className="text-muted-foreground py-8 text-center">
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
  const {
    data: medicalHistoryData,
    isLoading,
    error,
  } = usePatientMedicalHistories({
    patientId,
    pageSize: 0,
    pageNumber: 1,
  });

  // Determine what content to render
  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (error) {
      return <ErrorState />;
    }

    if (!medicalHistoryData) {
      return <EmptyState />;
    }

    return (
      <MedicalHistoryList
        medicalHistoryData={medicalHistoryData}
        patientId={patientId}
      />
    );
  };

  const content = renderContent();

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="space-y-6">
        <PageHeader />
        <div className="space-y-6">{content}</div>
      </div>
    </div>
  );
}
