"use client";

import { useEffect } from "react";
import { useEditMedicalHistory } from "@/hooks/medicalhistories/useEditMedicalHistories";

interface MedicalHistoryDeleteModalProps {
    medicalHistoryId: number;
    medicalHistoryTitle?: string; // Optional title for display
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void; // Callback after successful delete
}
                                                                                                                                                 
const MedicalHistoryDeleteModal = ({
    medicalHistoryId,
    medicalHistoryTitle,
    isOpen,
    onClose,
    onSuccess,
}: MedicalHistoryDeleteModalProps) => {
    const { remove } = useEditMedicalHistory();

    // Handle delete submission
    const handleDelete = async () => {
        try {
            await remove.mutateAsync(medicalHistoryId);
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error("Error deleting medical history:", error);
            // Error is handled by the mutation hook
        }
    };

    // Handle backdrop click
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget && !remove.isPending) {
            onClose();
        }
    };

    // Handle escape key
    useEffect(() => {
        const handleEscapeKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen && !remove.isPending) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose, remove.isPending]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
        >
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mr-4">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <div>
                        <h2 id="delete-modal-title" className="text-lg font-semibold text-gray-900">
                            Delete Medical History
                        </h2>
                        <p className="text-sm text-gray-500">This action cannot be undone</p>
                    </div>
                </div>

                {/* Content */}
                <div className="mb-6">
                    <p className="text-gray-700 mb-2">
                        Are you sure you want to delete this medical history record?
                    </p>
                    <div className="bg-gray-50 rounded-lg p-3">
                        <p className="font-medium text-gray-900">
                            {medicalHistoryTitle || `Medical Record #${medicalHistoryId}`}
                        </p>
                    </div>
                    <p className="text-sm text-red-600 mt-3 font-medium">
                        ⚠️ This will permanently delete all associated data including symptoms, diagnosis, and treatment information.
                    </p>
                </div>

                {/* Error Display */}
                {remove.isError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-red-800 font-medium">
                                {remove.error?.message || "Failed to delete medical history"}
                            </p>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={remove.isPending}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={remove.isPending}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {remove.isPending ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Deleting...
                            </div>
                        ) : (
                            "Delete Record"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MedicalHistoryDeleteModal;