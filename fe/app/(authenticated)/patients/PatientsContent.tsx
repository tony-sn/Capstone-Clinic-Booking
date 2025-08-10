"use client";

import {
  AlertCircle,
  Edit,
  Eye,
  MoreVertical,
  RotateCcw,
  Search,
  User as UserIcon,
  Users,
  X,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import EditUserModal from "@/components/new/forms/admin/EditUserModal";
import PatientDetailsDialog from "@/components/patient/PatientDetailsDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePatients } from "@/hooks/users/useUsers";
import { User } from "@/types/user";

export default function PatientsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [, setShowDeleteModal] = useState(false);

  const { data: patients = [], isLoading, error, refetch } = usePatients();

  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return patients;

    const query = searchQuery.toLowerCase().trim();
    return patients.filter(
      (patient: User) =>
        patient.id.toString().includes(query) ||
        patient.username.toLowerCase().includes(query) ||
        patient.firstName.toLowerCase().includes(query) ||
        patient.lastName.toLowerCase().includes(query) ||
        (patient.email && patient.email.toLowerCase().includes(query))
    );
  }, [patients, searchQuery]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleViewPatient = useCallback((patient: User) => {
    // Navigate to patient detail page
    // window.location.href = `/patients/${patient.id}`;
    setSelectedPatient(patient);
    setShowViewModal(true);
  }, []);

  const handleEditPatient = useCallback((patient: User) => {
    setSelectedPatient(patient);
    setShowEditModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedPatient(null);
    setShowViewModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
  }, []);

  const handleEditSuccess = useCallback(() => {
    handleCloseModal();
    refetch(); // Refresh the patient list
  }, [handleCloseModal, refetch]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-2 animate-spin text-blue-500">
            <Users className="size-10" />
          </div>
          <p className="text-gray-600">Loading patients...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 size-12 text-red-500" />
          <p className="mb-4 text-gray-700">Failed to load patients.</p>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <RotateCcw className="size-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full">
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-blue-600 p-3">
                <Users className="size-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Patient Management
                </h1>
                <p className="text-gray-600">Manage and view patient records</p>
              </div>
            </div>
          </div>

          <div className="relative mb-4">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="size-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by ID, name, username, or email..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-12 py-3 text-gray-700 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-4"
              >
                <X className="size-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Username / Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredPatients.map((patient: User) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <UserIcon className="mr-2 size-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {patient.firstName} {patient.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {patient.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {patient.username}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              className="inline-flex items-center justify-center rounded-md p-1 hover:bg-gray-100"
                              title="Actions"
                            >
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                              onClick={() => handleViewPatient(patient)}
                            >
                              <Eye className="mr-2 size-4" />
                              View Records
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditPatient(patient)}
                            >
                              <Edit className="mr-2 size-4" />
                              Edit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPatients.length === 0 && (
            <div className="py-16 text-center text-gray-600">
              <Users className="mx-auto mb-4 size-12 text-gray-400" />
              No patients found.
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showViewModal && selectedPatient && (
        <PatientDetailsDialog
          patient={selectedPatient}
          open={showViewModal}
          onOpenChange={setShowViewModal}
        />
      )}

      {showEditModal && selectedPatient && (
        <EditUserModal
          user={selectedPatient}
          open={showEditModal}
          onClose={handleCloseModal}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
}
