"use client";

import { X, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { useEditMedicineInventoryEntry } from "@/hooks/medicine-inventory-entries/useEditMedicineInventoryEntry";
import { MedicineInventoryEntry } from "@/types/medicines";

export default function MedicineInventoryEntryEditModal({
  entry,
  onClose,
  onSuccess,
}: {
  entry: MedicineInventoryEntry;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [formState, setFormState] = useState({
    medicineID: 0,
    changeType: 0,
    quantity: 0,
    companyName: "",
    note: "",
    prescriptionID: null as number | null,
  });

  const { update } = useEditMedicineInventoryEntry();

  useEffect(() => {
    if (entry) {
      setFormState({
        medicineID: entry.medicineID,
        changeType: entry.changeType,
        quantity: entry.quantity,
        companyName: entry.companyName,
        note: entry.note,
        prescriptionID: entry.prescriptionID,
      });
    }
  }, [entry]);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const target = e.target;
    const { name, value, type } = target;

    let val: string | number | null = value;

    if (type === "number") {
      val = value === "" ? 0 : Number(value);
    } else if (name === "prescriptionID") {
      val = value === "" ? null : Number(value);
    }

    setFormState((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("medicineID", String(formState.medicineID));
    formData.append("changeType", String(formState.changeType));
    formData.append("quantity", String(formState.quantity));
    formData.append("companyName", formState.companyName);
    formData.append("note", formState.note);
    if (formState.prescriptionID !== null) {
      formData.append("prescriptionID", String(formState.prescriptionID));
    }

    update.mutate(
      { id: entry.id, formData },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4">
      <div className="flex min-h-full items-center justify-center p-4">
        <form
          onSubmit={handleSubmit}
          className="relative w-full max-w-xl space-y-4 rounded-xl bg-white p-6 shadow-lg"
        >
          <button
            type="button"
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <X className="size-5" />
          </button>

          <h2 className="text-2xl font-semibold text-gray-800">
            Edit Medicine Inventory Entry
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Medicine ID
              </label>
              <input
                name="medicineID"
                type="number"
                value={formState.medicineID}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Change Type
              </label>
              <select
                name="changeType"
                value={formState.changeType}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                required
              >
                <option value={0}>Inbound</option>
                <option value={1}>Outbound</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                name="quantity"
                type="number"
                value={formState.quantity}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                required
                min="0"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Prescription ID
              </label>
              <input
                name="prescriptionID"
                type="number"
                value={formState.prescriptionID || ""}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Optional"
              />
            </div>

            <div className="col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                name="companyName"
                value={formState.companyName}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Note
              </label>
              <textarea
                name="note"
                value={formState.note}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                rows={3}
                placeholder="Optional note"
              />
            </div>
          </div>

          <div className="pt-4 text-right">
            <button
              type="submit"
              disabled={update.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {update.isPending && <Loader2 className="size-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
