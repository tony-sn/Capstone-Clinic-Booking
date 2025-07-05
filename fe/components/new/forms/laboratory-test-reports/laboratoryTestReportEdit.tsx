"use client";

import { useState, useEffect } from "react";
import { 
  useMedicalHistoryReport, 
  useUpdateLaboratoryTestReport, 
  useDeleteLaboratoryTestReport,
  useCreateLaboratoryTestReport 
} from "@/hooks/laboratory-test-report/useEditLaboratoryTestReport";
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
  onSuccess
}: LaboratoryTestReportEditProps) {
  const [formData, setFormData] = useState<FormData>({
    medicalHistoryId: medicalHistoryId || 0,
    laboratoryTestId: laboratoryTestId || 0,
    result: "",
    technicianId: 1,
    active: true
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Determine if this is edit mode (both IDs provided) or create mode
  const isEditMode = !!(medicalHistoryId && laboratoryTestId);

  // Fetch existing data for edit mode
  const { 
    data: existingReport, 
    isLoading: isLoadingReport,
    error: reportError 
  } = useMedicalHistoryReport(
    medicalHistoryId || 0, 
    laboratoryTestId || 0, 
    isEditMode && isOpen
  );

  // Fetch doctors list
  const { 
    data: doctors = [], 
    isLoading: isLoadingDoctors,
    error: doctorsError 
  } = useDoctors();

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
        active: existingReport.active
      });
    } else if (!isEditMode) {
      // Reset form for create mode
      setFormData({
        medicalHistoryId: medicalHistoryId || 0,
        laboratoryTestId: laboratoryTestId || 0,
        result: "",
        technicianId: doctors.length > 0 ? doctors[0].id : 1, // Set first doctor as default
        active: true
      });
    }
  }, [existingReport, isEditMode, medicalHistoryId, laboratoryTestId, doctors]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditMode) {
      // Update existing report
      updateMutation.mutate({
        medicalHistoryId: formData.medicalHistoryId,
        laboratoryTestId: formData.laboratoryTestId,
        data: {
          result: formData.result,
          active: formData.active,
          technicianId: formData.technicianId
        }
      }, {
        onSuccess: (result) => {
          if (result.success) {
            onSuccess?.();
            onClose();
          }
        }
      });
    } else {
      // Create new report
      createMutation.mutate({
        medicalHistoryId: formData.medicalHistoryId,
        laboratoryTestId: formData.laboratoryTestId,
        result: formData.result,
        technicianId: formData.technicianId
      }, {
        onSuccess: (result) => {
          if (result.success) {
            onSuccess?.();
            onClose();
          }
        }
      });
    }
  };

  // Handle delete
  const handleDelete = () => {
    if (!isEditMode) return;

    deleteMutation.mutate({
      medicalHistoryId: formData.medicalHistoryId,
      laboratoryTestId: formData.laboratoryTestId
    }, {
      onSuccess: (result) => {
        if (result.success) {
          setShowDeleteConfirm(false);
          onSuccess?.();
          onClose();
        }
      }
    });
  };

  // Loading state for edit mode
  if (isEditMode && (isLoadingReport || isLoadingDoctors)) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
          <div className="inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
            <div className="p-8 text-center">
              <div className="relative mb-6">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 mx-auto"></div>
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0 left-1/2 transform -translate-x-1/2"></div>
              </div>
              <p className="text-gray-600 font-medium">Loading data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isOpen) return null;

  const isLoading = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;
  const error = createMutation.error || updateMutation.error || deleteMutation.error || reportError || doctorsError;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {isEditMode ? '✏️ Edit Laboratory Test Report' : '➕ Create Laboratory Test Report'}
                  </h3>
                  <p className="text-blue-100 text-sm">
                    {isEditMode 
                      ? `Medical History ID: ${medicalHistoryId} | Lab Test ID: ${laboratoryTestId}`
                      : 'Create a new laboratory test report'
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white hover:bg-white/20 rounded-xl transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 font-medium">
                  {error instanceof Error ? error.message : 'An error occurred'}
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Medical History ID & Lab Test ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🏥 Medical History ID
                </label>
                <input
                  type="number"
                  value={formData.medicalHistoryId}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    medicalHistoryId: parseInt(e.target.value) || 0
                  }))}
                  disabled={isEditMode}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter medical history ID"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🧪 Laboratory Test ID
                </label>
                <input
                  type="number"
                  value={formData.laboratoryTestId}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    laboratoryTestId: parseInt(e.target.value) || 0
                  }))}
                  disabled={isEditMode}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter laboratory test ID"
                  required
                />
              </div>
            </div>

            {/* Test Result */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📋 Test Result
              </label>
              <textarea
                value={formData.result}
                onChange={(e) => setFormData(prev => ({ ...prev, result: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all resize-none"
                placeholder="Enter test result details..."
                rows={4}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter detailed test results, measurements, or observations
              </p>
            </div>

            {/* Technician (Doctor) Select */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                👨‍⚕️ Technician (Doctor)
              </label>
              <select
                value={formData.technicianId}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  technicianId: parseInt(e.target.value) || 1
                }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all"
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
                        Dr. {doctor.username} 
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            {/* Active Status (Edit mode only) */}
            {isEditMode && (
              <div className="bg-blue-50 p-4 rounded-xl">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                    className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    ✅ Report is active
                  </span>
                </label>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              {/* Save/Create Button */}
              <button
                type="submit"
                disabled={isLoading || isLoadingDoctors}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    {isEditMode ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {isEditMode ? '💾 Update Report' : '➕ Create Report'}
                  </div>
                )}
              </button>

              {/* Delete Button (Edit mode only) */}
              {isEditMode && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isLoading}
                  className="px-6 py-3 border-2 border-red-300 text-red-700 rounded-xl font-bold hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🗑️ Delete
                </button>
              )}

              {/* Cancel Button */}
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-60 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
            <div className="inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-red-100 rounded-full">
                    <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">🗑️ Delete Report</h3>
                    <p className="text-sm text-gray-600">This action cannot be undone</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete this laboratory test report?<br/>
                  <span className="font-semibold">Medical History ID: {medicalHistoryId}</span><br/>
                  <span className="font-semibold">Laboratory Test ID: {laboratoryTestId}</span>
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-xl font-bold hover:from-red-600 hover:to-pink-700 transition-all disabled:opacity-50"
                  >
                    {deleteMutation.isPending ? 'Deleting...' : '🗑️ Delete'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleteMutation.isPending}
                    className="flex-1 border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-xl font-bold hover:bg-gray-50 transition-all disabled:opacity-50"
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