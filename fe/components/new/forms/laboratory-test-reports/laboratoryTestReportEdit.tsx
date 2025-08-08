"use client";

import {
  AlertCircle,
  Edit,
  FilePlus,
  FileText,
  Loader2,
  Plus,
  TestTubes,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  useCreateLaboratoryTestReport,
  useDeleteLaboratoryTestReport,
  useMedicalHistoryReport,
  useUpdateLaboratoryTestReport,
} from "@/hooks/laboratory-test-report/useEditLaboratoryTestReport";
import { useLaboratoryTests } from "@/hooks/laboratory-tests/useLaboratoryTests";
import { useDoctors } from "@/hooks/users/useUsers";

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

  const isEditMode = !!(medicalHistoryId && laboratoryTestId);

  const {
    data: existingReport,
    isLoading: isLoadingReport,
    error: reportError,
  } = useMedicalHistoryReport(
    medicalHistoryId || 0,
    laboratoryTestId || 0,
    isEditMode && isOpen
  );

  const {
    data: doctors = [],
    isLoading: isLoadingDoctors,
    error: doctorsError,
  } = useDoctors();

  const {
    data: laboratoryTests = [],
    isLoading: isLoadingLabTests,
    error: labTestsError,
  } = useLaboratoryTests({ pageSize: 0, pageNumber: 1 });

  const createMutation = useCreateLaboratoryTestReport();
  const updateMutation = useUpdateLaboratoryTestReport();
  const deleteMutation = useDeleteLaboratoryTestReport();

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
      setFormData({
        medicalHistoryId: medicalHistoryId || 0,
        laboratoryTestId: laboratoryTestId || 0,
        result: "",
        technicianId: doctors.length > 0 ? doctors[0].id : 1,
        active: true,
      });
    }
  }, [existingReport, isEditMode, medicalHistoryId, laboratoryTestId, doctors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditMode) {
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

  if (
    isEditMode &&
    (isLoadingReport || isLoadingDoctors || isLoadingLabTests)
  ) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4 text-center sm:block">
          <div className="fixed inset-0 bg-gray-500/75 transition-opacity" />
          <div className="my-8 inline-block w-full max-w-md overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
            <div className="flex min-h-[200px] items-center justify-center">
              <div className="text-center">
                <Loader2 className="mx-auto mb-4 size-12 animate-spin text-blue-600" />
                <p className="text-lg font-medium text-gray-700">
                  Loading report data...
                </p>
              </div>
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
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:block">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500/75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className="my-8 inline-block w-full max-w-2xl overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-blue-600 p-3">
                {isEditMode ? (
                  <Edit className="size-6 text-white" />
                ) : (
                  <FilePlus className="size-6 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {isEditMode
                    ? "Edit Laboratory Test Report"
                    : "Create Laboratory Test Report"}
                </h3>
                <p className="text-sm text-gray-600">
                  {isEditMode
                    ? `Medical History ID: ${medicalHistoryId} | Lab Test ID: ${laboratoryTestId}`
                    : "Create a new laboratory test report"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-200"
            >
              <XCircle className="size-6" />
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="m-6 rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="size-6 text-red-500" />
                <p className="font-medium text-red-700">
                  {error instanceof Error ? error.message : "An error occurred"}
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {/* Medical History ID & Lab Test ID */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FileText className="size-4" />
                  Medical History ID
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
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                  placeholder="Enter medical history ID"
                  required
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <TestTubes className="size-4" />
                  Laboratory Test
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
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
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
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FileText className="size-4" />
                Test Result
              </label>
              <textarea
                value={formData.result}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, result: e.target.value }))
                }
                className="w-full resize-none rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <User className="size-4" />
                Technician (Doctor)
              </label>
              <select
                value={formData.technicianId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    technicianId: parseInt(e.target.value) || 1,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
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
              <div className="rounded-xl bg-gray-50 p-4">
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
                    className="size-5 rounded border-2 border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    Report is active
                  </span>
                </label>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 border-t border-gray-100 pt-6">
              <button
                type="submit"
                disabled={isLoading || isLoadingDoctors || isLoadingLabTests}
                className="flex-1 rounded-xl bg-green-600 px-6 py-3 font-bold text-white transition-all duration-200 hover:bg-green-700 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="size-5 animate-spin" />
                    {isEditMode ? "Updating..." : "Creating..."}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    {isEditMode ? (
                      <Edit className="size-5" />
                    ) : (
                      <Plus className="size-5" />
                    )}
                    {isEditMode ? "Update Report" : "Create Report"}
                  </div>
                )}
              </button>

              {isEditMode && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isLoading}
                  className="rounded-xl border border-red-200 bg-red-50 px-6 py-3 font-bold text-red-600 transition-all duration-200 hover:bg-red-100 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-200"
                >
                  <Trash2 className="size-5" />
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="rounded-xl border border-gray-200 bg-white px-6 py-3 font-bold text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 text-center sm:block">
            <div
              className="fixed inset-0 bg-gray-500/75 transition-opacity"
              onClick={() => setShowDeleteConfirm(false)}
            />
            <div className="my-8 inline-block w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-red-100 p-3">
                  <Trash2 className="size-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Delete Report
                  </h3>
                  <p className="text-sm text-gray-600">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <p className="mb-6 mt-4 text-gray-700">
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
              <div className="flex gap-4">
                <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="flex-1 rounded-xl bg-red-600 px-4 py-2 font-bold text-white transition-all duration-200 hover:bg-red-700 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {deleteMutation.isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="size-5 animate-spin" />
                      Deleting...
                    </div>
                  ) : (
                    "Delete"
                  )}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2 font-bold text-gray-700 transition-all duration-200 hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
