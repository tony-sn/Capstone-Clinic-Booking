"use client";

import { DataTable } from "@/components/table/DataTable";
import { patientColumns } from "@/components/table/patient-columns";
import { usePatients } from "@/hooks/users/useUsers";

export default function PatientsContent() {
  const { data: patients, isLoading, error } = usePatients();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground">
            Manage and view patient records
          </p>
        </div>
        <div className="rounded-lg border bg-card p-8">
          <p className="text-center text-muted-foreground">
            Loading patients...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground">
            Manage and view patient records
          </p>
        </div>
        <div className="rounded-lg border bg-card p-8">
          <p className="text-center text-red-500">
            Error loading patients. Please try again.
          </p>
        </div>
      </div>
    );
  }

  const patientData = patients || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
        <p className="text-muted-foreground">
          Manage and view patient records ({patientData.length} patients)
        </p>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <DataTable columns={patientColumns} data={patientData} />
        </div>
      </div>
    </div>
  );
}
