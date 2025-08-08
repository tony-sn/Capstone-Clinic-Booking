"use client";

import {
  AlertCircle,
  Edit,
  Eye,
  MoreVertical,
  Plus,
  RotateCcw,
  Search,
  Stethoscope,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import PrescriptionDeleteModal from "@/components/new/forms/prescriptions/PrescriptionDeleteModal";
import PrescriptionDetailModal from "@/components/new/forms/prescriptions/PrescriptionDetailModal";
import PrescriptionEditModal from "@/components/new/forms/prescriptions/PrescriptionEditModal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useInfinitePrescriptions } from "@/hooks/prescriptions/usePrescriptions";
import { useToast } from "@/hooks/use-toast";
import { flattenPages } from "@/lib/utils";
import { Prescription } from "@/types/prescription";

function PrescriptionPageContent() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [medicalHistoryId, setMedicalHistoryId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfinitePrescriptions(5);

  //eslint-disable-next-line
  const allPrescriptions = flattenPages<any>(data?.pages || []);
  console.log({ allPrescriptions });

  const filteredPrescriptions = useMemo(() => {
    if (!searchQuery.trim()) return allPrescriptions;

    const query = searchQuery.toLowerCase().trim();
    return allPrescriptions.filter((prescription: Prescription) => {
      return (
        prescription.prescriptionID.toString().includes(query) ||
        prescription.medicalHistoryID.toString().includes(query) ||
        prescription.totalAmount.toString().includes(query)
      );
    });
  }, [allPrescriptions, searchQuery]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleViewPrescription = useCallback(
    (prescriptionId: number, medicalHistoryId: number) => {
      setSelectedId(prescriptionId);
      setMedicalHistoryId(medicalHistoryId);
      setIsDetailOpen(true);
    },
    []
  );

  const handleEditPrescription = useCallback((id: number) => {
    setEditingId(id);
    setIsEditOpen(true);
  }, []);

  const handleDeletePrescription = useCallback((id: number) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  }, []);

  const handleCreatePrescription = useCallback(() => {
    setEditingId(null);
    setIsEditOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedId(null);
    setMedicalHistoryId(null);
    setEditingId(null);
    setDeletingId(null);
    setIsDetailOpen(false);
    setIsEditOpen(false);
    setIsDeleteOpen(false);
  }, []);

  const handleSuccess = useCallback(() => {
    handleCloseModal();
    toast({
      title: "Prescription Updated",
      description: "Prescription updated successfully!",
      duration: 3000,
    });
    refetch();
  }, [handleCloseModal, refetch, toast]);

  const handleDeleteSuccess = useCallback(() => {
    handleCloseModal();
    refetch();
  }, [handleCloseModal, refetch]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-2 animate-spin text-blue-500">
            <Stethoscope className="size-10" />
          </div>
          <p className="text-gray-600">Loading prescriptions...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 size-12 text-red-500" />
          <p className="mb-4 text-gray-700">Failed to load prescriptions.</p>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-blue-600 p-3">
                <Stethoscope className="size-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Prescription Management
                </h1>
                <p className="text-gray-600">
                  Manage patient prescriptions and medication records
                </p>
              </div>
            </div>
            <button
              onClick={handleCreatePrescription}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              <Plus className="size-4" />
              Create New Prescription
            </button>
          </div>

          <div className="relative mb-4">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="size-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by prescription ID, medical history ID, or total amount..."
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
                    Prescription
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Medical History
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredPrescriptions.map(
                  (prescription: Prescription, index: number) => (
                    <tr
                      key={prescription.prescriptionID || index}
                      className="hover:bg-gray-50"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          Prescription #{prescription.prescriptionID}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-900">
                          Medical History #{prescription.medicalHistoryID}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        ${prescription.totalAmount.toFixed(2)}
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
                                onClick={() =>
                                  handleViewPrescription(
                                    prescription.prescriptionID,
                                    prescription.medicalHistoryID
                                  )
                                }
                              >
                                <Eye className="mr-2 size-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleEditPrescription(
                                    prescription.prescriptionID
                                  )
                                }
                              >
                                <Edit className="mr-2 size-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDeletePrescription(
                                    prescription.prescriptionID
                                  )
                                }
                              >
                                <Trash2 className="mr-2 size-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {filteredPrescriptions.length === 0 && (
            <div className="py-16 text-center text-gray-600">
              <Stethoscope className="mx-auto mb-4 size-12 text-gray-400" />
              No prescriptions found.
            </div>
          )}
        </div>

        {hasNextPage && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isFetchingNextPage && (
                <RotateCcw className="size-4 animate-spin" />
              )}
              Load More
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {isDetailOpen && selectedId && medicalHistoryId && (
        <PrescriptionDetailModal
          prescriptionId={selectedId}
          medicalHistoryId={medicalHistoryId}
          isOpen={isDetailOpen}
          onClose={handleCloseModal}
        />
      )}

      {isEditOpen && (
        <PrescriptionEditModal
          prescriptionId={editingId}
          isOpen={isEditOpen}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}

      {isDeleteOpen && deletingId && (
        <PrescriptionDeleteModal
          prescriptionId={deletingId}
          isOpen={isDeleteOpen}
          onClose={handleCloseModal}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}

export default function PrescriptionPageClient() {
  return <PrescriptionPageContent />;
}
