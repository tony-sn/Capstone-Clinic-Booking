"use client";

import { AlertTriangle, Loader2, X } from "lucide-react";
import { useEffect } from "react";

import { MedicineInventoryEntry } from "@/types/medicines";

export default function MedicineInventoryEntryDeleteModal({
  entry,
  onClose,
  onConfirm,
  isDeleting,
}: {
  entry: MedicineInventoryEntry;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}) {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
          <button
            type="button"
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            onClick={onClose}
            disabled={isDeleting}
          >
            <X className="size-5" />
          </button>

          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-2">
              <AlertTriangle className="size-6 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Delete Inventory Entry
            </h2>
          </div>

          <div className="mb-6 text-gray-600">
            <p className="mb-2">
              Are you sure you want to delete this inventory entry?
            </p>
            <div className="rounded-md bg-gray-50 p-3">
              <p className="text-sm">
                <strong>Entry ID:</strong> #{entry.id}
              </p>
              <p className="text-sm">
                <strong>Medicine ID:</strong> {entry.medicineID}
              </p>
              <p className="text-sm">
                <strong>Company:</strong> {entry.companyName}
              </p>
              <p className="text-sm">
                <strong>Quantity:</strong>{" "}
                <span
                  className={
                    entry.changeType === 0 ? "text-green-600" : "text-red-600"
                  }
                >
                  {entry.changeType === 0 ? "+" : "-"}
                  {entry.quantity}
                </span>
              </p>
            </div>
            <p className="mt-3 text-sm text-red-600">
              This action cannot be undone.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting && <Loader2 className="size-4 animate-spin" />}
              Delete Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
