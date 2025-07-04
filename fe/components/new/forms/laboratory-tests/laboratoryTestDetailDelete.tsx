"use client";

import { useEditLaboratoryTest } from "@/hooks/laboratory-tests/useEditLaboratoryTests";

interface LaboratoryTestDeleteModalProps {
  laboratoryTestId: number;
  laboratoryTestName?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const LaboratoryTestDeleteModal = ({
  laboratoryTestId,
  laboratoryTestName,
  isOpen,
  onClose,
  onSuccess,
}: LaboratoryTestDeleteModalProps) => {
  const { remove } = useEditLaboratoryTest();

  const handleDelete = async () => {
    try {
      await remove.mutateAsync(laboratoryTestId);
      onSuccess();
    } catch (error) {
      console.error("Error deleting laboratory test:", error);
      // Handle error (show toast, etc.)
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
            <svg 
              className="w-6 h-6 text-red-600" 
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
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Delete Laboratory Test
            </h3>
            <p className="text-sm text-gray-500">
              This action cannot be undone
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-700">
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {laboratoryTestName || `Laboratory Test #${laboratoryTestId}`}
            </span>
            ? This will permanently remove all associated data.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={remove.isPending}
            className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={remove.isPending}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {remove.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LaboratoryTestDeleteModal;