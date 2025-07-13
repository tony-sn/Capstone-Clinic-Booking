"use client";

// import Link from "next/link";
import { useState } from "react";

import InfiniteScroll from "@/components/InfiniteScroll";
import MedicalHistoryDeleteModal from "@/components/new/forms/medical-history/medicalHistoryDeleteForm"; // Import delete modal
import MedicalHistoryDetailModal from "@/components/new/forms/medical-history/medicalhistoryDetailForm";
import MedicalHistoryFormModal from "@/components/new/forms/medical-history/medicalhistoryEditForm";
import { useInfiniteMedicalHistories } from "@/hooks/medicalhistories/useMedicalhistories";
import { MedicalHistory } from "@/types/medicalHistory";

const MedicalHistoriesPage = () => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteMedicalHistories(0);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Add delete modal state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null); // Add deleting ID state
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "completed"
  >("all"); // Add status filter

  // Flatten all pages' data into a single array
  const histories: MedicalHistory[] =
    data?.pages?.flatMap((page) => page?.data || []) || [];

  // Filter histories based on status
  const filteredHistories = histories.filter((history) => {
    switch (statusFilter) {
      case "active":
        return history.active;
      case "completed":
        return !history.active;
      default:
        return true;
    }
  });

  // Handler để mở detail modal
  const handleViewRecord = (medicalHistoryId: number) => {
    setSelectedId(medicalHistoryId);
    setIsDetailModalOpen(true);
  };

  // Handler để mở form modal (create)
  const handleCreateRecord = () => {
    setEditingId(null); // No ID = create mode
    setIsFormModalOpen(true);
  };

  // Handler để mở form modal (edit)
  const handleEditRecord = (medicalHistoryId: number) => {
    setEditingId(medicalHistoryId);
    setIsFormModalOpen(true);
  };

  // Handler để mở delete modal
  const handleDeleteRecord = (medicalHistoryId: number) => {
    setDeletingId(medicalHistoryId);
    setIsDeleteModalOpen(true);
  };

  // Handler để đóng detail modal
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedId(null);
  };

  // Handler để đóng form modal
  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingId(null);
  };

  // Handler để đóng delete modal
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingId(null);
  };

  // Handler sau khi create/update thành công
  const handleFormSuccess = () => {
    setIsFormModalOpen(false);
    setEditingId(null);
    refetch(); // Refresh data
  };

  // Handler sau khi delete thành công
  const handleDeleteSuccess = () => {
    setIsDeleteModalOpen(false);
    setDeletingId(null);
    refetch(); // Refresh data
  };

  // Handler để toggle active status
  const handleToggleActive = async (
    medicalHistoryId: number,
    newActiveStatus: boolean
  ) => {
    try {
      // You'll need to implement this API call
      // await updateMedicalHistoryStatus(medicalHistoryId, newActiveStatus);
      console.log(
        `Toggling record ${medicalHistoryId} to ${newActiveStatus ? "active" : "inactive"}`
      );

      // For now, just show a message and refresh
      alert(`Record marked as ${newActiveStatus ? "active" : "completed"}`);
      refetch(); // Refresh data after status change
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  // Get record title for delete modal
  const getDeletingRecordTitle = () => {
    if (!deletingId) return undefined;
    const record = histories.find((h) => h.medicalHistoryId === deletingId);
    return record ? `Medical Record #${record.medicalHistoryId}` : undefined;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="mb-4 text-2xl font-semibold">Medical Histories</h1>
        <div className="flex items-center justify-center py-8">
          <div className="size-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading medical histories...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <h1 className="mb-4 text-2xl font-semibold">Medical Histories</h1>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-800">
            Failed to load medical histories. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header with Create Button */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Medical Histories</h1>
        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as "all" | "active" | "completed"
                )
              }
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Records ({histories.length})</option>
              <option value="active">
                Active Treatment ({histories.filter((h) => h.active).length})
              </option>
              <option value="completed">
                Completed ({histories.filter((h) => !h.active).length})
              </option>
            </select>
          </div>

          <button
            onClick={handleCreateRecord}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700"
          >
            <svg
              className="size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create New Record
          </button>
        </div>
      </div>

      {filteredHistories.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500">
            {statusFilter === "all"
              ? "No medical histories found."
              : `No ${statusFilter} medical histories found.`}
          </p>
          {statusFilter === "all" && (
            <button
              onClick={handleCreateRecord}
              className="mt-4 rounded-lg bg-green-600 px-6 py-2 font-medium text-white transition-colors hover:bg-green-700"
            >
              Create First Record
            </button>
          )}
        </div>
      ) : (
        <InfiniteScroll
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        >
          <div className="space-y-4">
            {filteredHistories.map((history) => (
              <div
                key={history.medicalHistoryId}
                className={`rounded-xl border-l-4 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md ${
                  history.active
                    ? "border-l-emerald-500 hover:border-l-emerald-600"
                    : "border-l-slate-400 hover:border-l-slate-500"
                }`}
              >
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-blue-50">
                      <svg
                        className="size-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Medical Record #{history.medicalHistoryId}
                      </h3>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            history.active
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          <span
                            className={`mr-1.5 size-2 rounded-full ${
                              history.active ? "bg-emerald-400" : "bg-slate-400"
                            }`}
                          ></span>
                          {history.active ? "Active Treatment" : "Completed"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-500">
                      Total Cost
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      ${history.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Patient & Doctor Info */}
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-blue-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <svg
                        className="size-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <p className="text-sm font-medium text-blue-800">
                        Patient Information
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-blue-900">
                      ID: {history.patientId}
                    </p>
                  </div>
                  <div className="rounded-lg bg-purple-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <svg
                        className="size-4 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      <p className="text-sm font-medium text-purple-800">
                        Attending Physician
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-purple-900">
                      Dr. ID: {history.doctorId}
                    </p>
                  </div>
                </div>

                {/* Medical Details */}
                <div className="space-y-4">
                  {history.symptoms && (
                    <div className="border-l-4 border-red-200 pl-4">
                      <div className="mb-2 flex items-center gap-2">
                        <svg
                          className="size-4 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                        <h4 className="font-medium text-red-800">
                          Reported Symptoms
                        </h4>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-700">
                        {history.symptoms}
                      </p>
                    </div>
                  )}

                  {history.diagnosis && (
                    <div className="border-l-4 border-amber-200 pl-4">
                      <div className="mb-2 flex items-center gap-2">
                        <svg
                          className="size-4 text-amber-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        <h4 className="font-medium text-amber-800">
                          Medical Diagnosis
                        </h4>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-700">
                        {history.diagnosis}
                      </p>
                    </div>
                  )}

                  {history.treatmentInstructions && (
                    <div className="border-l-4 border-green-200 pl-4">
                      <div className="mb-2 flex items-center gap-2">
                        <svg
                          className="size-4 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                          />
                        </svg>
                        <h4 className="font-medium text-green-800">
                          Treatment Plan
                        </h4>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-700">
                        {history.treatmentInstructions}
                      </p>
                    </div>
                  )}
                </div>

                {/* Status Toggle */}
                <div className="my-4">
                  <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center gap-2">
                      <svg
                        className="size-4 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">
                        Treatment Status:
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        handleToggleActive(
                          history.medicalHistoryId,
                          !history.active
                        )
                      }
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                        history.active
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {history.active ? "Mark as Completed" : "Mark as Active"}
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 border-t border-slate-200 pt-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleViewRecord(history.medicalHistoryId)}
                      className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleEditRecord(history.medicalHistoryId)}
                      className="flex-1 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-700"
                    >
                      Edit Record
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteRecord(history.medicalHistoryId)
                      }
                      className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && selectedId && (
        <MedicalHistoryDetailModal
          medicalHistoryId={selectedId}
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
        />
      )}

      {/* Form Modal (Create/Edit) */}
      <MedicalHistoryFormModal
        medicalHistoryId={editingId}
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Modal */}
      {isDeleteModalOpen && deletingId && (
        <MedicalHistoryDeleteModal
          medicalHistoryId={deletingId}
          medicalHistoryTitle={getDeletingRecordTitle()}
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
};

export default MedicalHistoriesPage;
