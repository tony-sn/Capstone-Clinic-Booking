"use client";

import { useState, useEffect } from "react";

import {
  useMedicalHistoryReport,
  useUpdateLaboratoryTestReport,
  useDeleteLaboratoryTestReport,
  useCreateLaboratoryTestReport,
} from "@/hooks/laboratory-test-report/useEditLaboratoryTestReport";
import { useLaboratoryTests } from "@/hooks/laboratory-tests/useLaboratoryTests"; // Import laboratory tests hook
import { useDoctors } from "@/hooks/users/useUsers"; // Import your custom hook

interface LaboratoryTestReportEditProps {
  medicalHistoryId?: number;
  laboratoryTestId?: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormData {
  medicalHistoryId: number;
  laboratoryTestId: number;
  result: string;
  technicianId: number;
  active: boolean;
}

export default function LaboratoryTestReportEdit({
  medicalHistoryId,
  laboratoryTestId,
  isOpen,
  onClose,
  onSuccess,
}: LaboratoryTestReportEditProps) {
  const [formData, setFormData] = useState<FormData>({
    medicalHistoryId: medicalHistoryId || 0,
    laboratoryTestId: laboratoryTestId || 0,
    result: "",
    technicianId: 1,
    active: true,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Determine if this is edit mode (both IDs provided) or create mode
  const isEditMode = !!(medicalHistoryId && laboratoryTestId);

  // Fetch existing data for edit mode
  const {
    data: existingReport,
    isLoading: isLoadingReport,
    error: reportError,
  } = useMedicalHistoryReport(
    medicalHistoryId || 0,
    laboratoryTestId || 0,
    isEditMode && isOpen
  );

  // Fetch doctors list
  const {
    data: doctors = [],
    isLoading: isLoadingDoctors,
    error: doctorsError,
  } = useDoctors();

  // Fetch laboratory tests list (get all with pageSize: 0)
  const {
    data: laboratoryTests = [],
    isLoading: isLoadingLabTests,
    error: labTestsError,
  } = useLaboratoryTests({ pageSize: 0, pageNumber: 1 });

  // Mutations
  const createMutation = useCreateLaboratoryTestReport();
  const updateMutation = useUpdateLaboratoryTestReport();
  const deleteMutation = useDeleteLaboratoryTestReport();

  // Initialize form data when editing
  useEffect(() => {
    if (isEditMode && existingReport) {
      setFormData({
        medicalHistoryId: existingReport.medicalHistoryId,
        laboratoryTestId: existingReport.laboratoryTestId,
        result: existingReport.result,
        technicianId: existingReport.technician.id,
        active: existingReport.active,
      });
    } else if (!isEditMode) {
      // Reset form for create mode
      setFormData({
        medicalHistoryId: medicalHistoryId || 0,
        laboratoryTestId: laboratoryTestId || 0,
        result: "",
        technicianId: doctors.length > 0 ? doctors[0].id : 1, // Set first doctor as default
        active: true,
      });
    }
  }, [
    existingReport,
    isEditMode,
    medicalHistoryId,
    laboratoryTestId,
    doctors,
    laboratoryTests,
  ]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditMode) {
      // Update existing report
      updateMutation.mutate(
        {
          medicalHistoryId: formData.medicalHistoryId,
          laboratoryTestId: formData.laboratoryTestId,
          data: {
            result: formData.result,
            status: formData.active,
            technicianId: formData.technicianId,
          },
        },
        {
          onSuccess: (result) => {
            if (result.success) {
              onSuccess?.();
              onClose();
            }
          },
        }
      );
    } else {
      // Create new report
      createMutation.mutate(
        {
          medicalHistoryId: formData.medicalHistoryId,
          laboratoryTestId: formData.laboratoryTestId,
          result: formData.result,
          technicianId: formData.technicianId,
        },
        {
          onSuccess: (result) => {
            if (result.success) {
              onSuccess?.();
              onClose();
            }
          },
        }
      );
    }
  };

  // Handle delete
  const handleDelete = () => {
    if (!isEditMode) return;

    deleteMutation.mutate(
      {
        medicalHistoryId: formData.medicalHistoryId,
        laboratoryTestId: formData.laboratoryTestId,
      },
      {
        onSuccess: (result) => {
          if (result.success) {
            setShowDeleteConfirm(false);
            onSuccess?.();
            onClose();
          }
        },
      }
    );
  };

  // Loading state for edit mode
  if (
    isEditMode &&
    (isLoadingReport || isLoadingDoctors || isLoadingLabTests)
  ) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500/75 transition-opacity" />
          <div className="my-8 inline-block w-full max-w-md overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
            <div className="p-8 text-center">
              <div className="relative mb-6">
                <div className="mx-auto size-12 animate-spin rounded-full border-4 border-blue-200"></div>
                <div className="absolute left-1/2 top-0 size-12 -translate-x-1/2 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              </div>
              <p className="font-medium text-gray-600">Loading data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isOpen) return null;

  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;
  const error =
    createMutation.error ||
    updateMutation.error ||
    deleteMutation.error ||
    reportError ||
    doctorsError ||
    labTestsError;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500/75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className="my-8 inline-block w-full max-w-2xl overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/20 p-2">
                  <svg
                    className="size-6 text-white"
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
                  <h3 className="text-xl font-bold text-white">
                    {isEditMode
                      ? "✏️ Edit Laboratory Test Report"
                      : "➕ Create Laboratory Test Report"}
                  </h3>
                  <p className="text-sm text-blue-100">
                    {isEditMode
                      ? `Medical History ID: ${medicalHistoryId} | Lab Test ID: ${laboratoryTestId}`
                      : "Create a new laboratory test report"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl p-2 text-white transition-colors hover:bg-white/20"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mx-6 mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="flex items-center gap-2">
                <svg
                  className="size-5 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="font-medium text-red-700">
                  {error instanceof Error ? error.message : "An error occurred"}
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {/* Medical History ID & Lab Test ID */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  🏥 Medical History ID
                </label>
                <input
                  type="number"
                  value={formData.medicalHistoryId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      medicalHistoryId: parseInt(e.target.value) || 0,
                    }))
                  }
                  disabled={isEditMode}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100"
                  placeholder="Enter medical history ID"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  🧪 Laboratory Test
                </label>
                <select
                  value={formData.laboratoryTestId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      laboratoryTestId: parseInt(e.target.value) || 0,
                    }))
                  }
                  disabled={isEditMode || isLoadingLabTests}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100"
                  required
                >
                  {isLoadingLabTests ? (
                    <option value="">Loading laboratory tests...</option>
                  ) : laboratoryTests.length === 0 ? (
                    <option value="">No laboratory tests available</option>
                  ) : (
                    <>
                      <option value="">Select laboratory test</option>
                      {laboratoryTests.map((test) => (
                        <option key={test.id} value={test.id}>
                          {test.name} - {test.price || "Not yet"}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Test Result */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                📋 Test Result
              </label>
              <textarea
                value={formData.result}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, result: e.target.value }))
                }
                className="w-full resize-none rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-200"
                placeholder="Enter test result details..."
                rows={4}
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter detailed test results, measurements, or observations
              </p>
            </div>

            {/* Technician (Doctor) Select */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                👨‍⚕️ Technician (Doctor)
              </label>
              <select
                value={formData.technicianId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    technicianId: parseInt(e.target.value) || 1,
                  }))
                }
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-200"
                required
                disabled={isLoadingDoctors}
              >
                {isLoadingDoctors ? (
                  <option value="">Loading doctors...</option>
                ) : doctors.length === 0 ? (
                  <option value="">No doctors available</option>
                ) : (
                  <>
                    <option value="">Select technician</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        Dr. {doctor.username} -{" "}
                        {doctor.roles.toString() || "General"}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            {/* Active Status (Edit mode only) */}
            {isEditMode && (
              <div className="rounded-xl bg-blue-50 p-4">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        active: e.target.checked,
                      }))
                    }
                    className="size-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    ✅ Report is active
                  </span>
                </label>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 border-t border-gray-200 pt-4">
              {/* Save/Create Button */}
              <button
                type="submit"
                disabled={isLoading || isLoadingDoctors || isLoadingLabTests}
                className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:from-blue-600 hover:to-purple-700 hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    {isEditMode ? "Updating..." : "Creating..."}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {isEditMode ? "💾 Update Report" : "➕ Create Report"}
                  </div>
                )}
              </button>

              {/* Delete Button (Edit mode only) */}
              {isEditMode && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isLoading}
                  className="rounded-xl border-2 border-red-300 px-6 py-3 font-bold text-red-700 transition-all hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  🗑️ Delete
                </button>
              )}

              {/* Cancel Button */}
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="rounded-xl border-2 border-gray-300 px-6 py-3 font-bold text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="z-60 fixed inset-0 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500/75 transition-opacity" />
            <div className="my-8 inline-block w-full max-w-md overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
              <div className="p-6">
                <div className="mb-4 flex items-center gap-4">
                  <div className="rounded-full bg-red-100 p-3">
                    <svg
                      className="size-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      🗑️ Delete Report
                    </h3>
                    <p className="text-sm text-gray-600">
                      This action cannot be undone
                    </p>
                  </div>
                </div>

                <p className="mb-6 text-gray-700">
                  Are you sure you want to delete this laboratory test report?
                  <br />
                  <span className="font-semibold">
                    Medical History ID: {medicalHistoryId}
                  </span>
                  <br />
                  <span className="font-semibold">
                    Laboratory Test ID: {laboratoryTestId}
                  </span>
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    className="flex-1 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 px-4 py-2 font-bold text-white transition-all hover:from-red-600 hover:to-pink-700 disabled:opacity-50"
                  >
                    {deleteMutation.isPending ? "Deleting..." : "🗑️ Delete"}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleteMutation.isPending}
                    className="flex-1 rounded-xl border-2 border-gray-300 px-4 py-2 font-bold text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
