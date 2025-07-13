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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-full bg-red-100">
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
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={remove.isPending}
            className="rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={remove.isPending}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {remove.isPending ? (
              <>
                <div className="size-4 animate-spin rounded-full border-b-2 border-white"></div>
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
