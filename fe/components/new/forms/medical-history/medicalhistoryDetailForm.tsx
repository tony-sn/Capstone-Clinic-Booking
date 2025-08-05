"use client";

import { useEffect } from "react";

import { useMedicalDetail } from "@/hooks/medicalhistories/useMedicalhistories";
import { useDoctors, usePatients } from "@/hooks/users/useUsers";
import type { MedicalHistory } from "@/types/medicalHistory";

interface MedicalHistoryDetailModalProps {
  medicalHistoryId: number;
  isOpen: boolean;
  onClose: () => void;
}

const MedicalHistoryDetailModal = ({
  medicalHistoryId,
  isOpen,
  onClose,
}: MedicalHistoryDetailModalProps) => {
  // Fetch medical detail using custom hook with react-query
  // API returns MedicalHistoryResponse with data: MedicalHistory
  const {
    data: apiResponse,
    isLoading: loading,
    error,
  } = useMedicalDetail({ medicalHistoryId });
  const medicalHistory: MedicalHistory | undefined = apiResponse?.data;

  // Fetch doctors and patients for display names
  const { data: doctors } = useDoctors();
  const { data: patients } = usePatients();

  // Get doctor and patient names
  const doctor = doctors?.find((doc) => doc.id === medicalHistory?.doctorId);
  const patient = patients?.find((pat) => pat.id === medicalHistory?.patientId);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
    >
      <div className="mx-4 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
          <h2
            id="detail-modal-title"
            className="text-2xl font-bold text-gray-900"
          >
            Medical History Detail
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
            aria-label="Close modal"
          >
            <svg
              className="size-6 text-gray-500"
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

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="size-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              Loading medical history...
            </span>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-center">
              <svg
                className="mr-2 size-5 text-red-500"
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
              <p className="font-medium text-red-800">
                {error?.message || "Failed to load medical history"}
              </p>
            </div>
          </div>
        ) : medicalHistory ? (
          <div className="space-y-6">
            {/* Record Info Header */}
            <div className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Medical Record #{medicalHistory.medicalHistoryId}
              </h3>
            </div>

            {/* Patient and Doctor Info */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Patient Info */}
              <div className="rounded-lg bg-blue-50 p-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2">
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
                    Patient Information
                  </div>
                </label>
                <div className="font-medium text-gray-900">
                  {patient
                    ? patient.username
                    : `Patient ID: ${medicalHistory.patientId}`}
                </div>
                <div className="text-sm text-gray-600">
                  ID: {medicalHistory.patientId}
                </div>
              </div>

              {/* Doctor Info */}
              <div className="rounded-lg bg-purple-50 p-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2">
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
                    Doctor Information
                  </div>
                </label>
                <div className="font-medium text-gray-900">
                  {doctor
                    ? `Dr. ${doctor.username}`
                    : `Doctor ID: ${medicalHistory.doctorId}`}
                </div>
                <div className="text-sm text-gray-600">
                  ID: {medicalHistory.doctorId}
                </div>
              </div>
            </div>

            {/* Symptoms */}
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700">
                <div className="flex items-center gap-2">
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
                  Reported Symptoms
                </div>
              </label>
              <div className="min-h-[80px] w-full rounded-lg border border-gray-200 bg-red-50/50 p-4">
                <p className="whitespace-pre-wrap text-gray-800">
                  {medicalHistory.symptoms || "No symptoms recorded"}
                </p>
              </div>
            </div>

            {/* Diagnosis */}
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700">
                <div className="flex items-center gap-2">
                  <svg
                    className="size-4 text-yellow-600"
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
                  Medical Diagnosis
                </div>
              </label>
              <div className="min-h-[80px] w-full rounded-lg border border-gray-200 bg-yellow-50/50 p-4">
                <p className="whitespace-pre-wrap text-gray-800">
                  {medicalHistory.diagnosis || "No diagnosis recorded"}
                </p>
              </div>
            </div>

            {/* Treatment Instructions */}
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700">
                <div className="flex items-center gap-2">
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
                  Treatment Plan
                </div>
              </label>
              <div className="min-h-[100px] w-full rounded-lg border border-gray-200 bg-green-50/50 p-4">
                <p className="whitespace-pre-wrap text-gray-800">
                  {medicalHistory.treatmentInstructions ||
                    "No treatment plan recorded"}
                </p>
              </div>
            </div>

            {/* Total Amount and Status */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg bg-green-50 p-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2">
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
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                    Total Amount
                  </div>
                </label>
                <div className="text-2xl font-bold text-green-600">
                  ${medicalHistory.totalAmount?.toFixed(2) || "0.00"}
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
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
                    Treatment Status
                  </div>
                </label>
                <div className="flex items-center">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                      medicalHistory.active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    <span
                      className={`mr-2 size-2 rounded-full ${
                        medicalHistory.active ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></span>
                    {medicalHistory.active
                      ? "Active Treatment"
                      : "Inactive Treatment"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-end border-t border-gray-200 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <svg
              className="mx-auto size-12 text-gray-400"
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
            <p className="mt-2 text-gray-500">Medical history not found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalHistoryDetailModal;
