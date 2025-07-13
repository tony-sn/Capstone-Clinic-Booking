"use client";

import { X, Pill, Save, Loader2, AlertCircle, Plus, Edit } from "lucide-react";
import React, { useState, useEffect } from "react";

import { useEditMedicine } from "@/hooks/medicines/useEditMedicine";
import { getMedicineById } from "@/lib/api/medicine.actions";

interface Props {
  medicineId?: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function MedicineEditModal({
  medicineId,
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const isEditMode = medicineId !== undefined;
  const { create, update } = useEditMedicine();

  const [formData, setFormData] = useState({
    medicineName: "",
    description: "",
    quantity: "",
    unitPrice: "",
    companyName: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load medicine when editing
  useEffect(() => {
    const fetchMedicine = async () => {
      if (!medicineId) return;
      setIsLoading(true);
      try {
        const res = await getMedicineById(medicineId);
        setFormData({
          medicineName: res.data.medicineName || "",
          description: res.data.description || "",
          quantity: res.data.quantity.toString(),
          unitPrice: res.data.unitPrice.toString(),
          companyName: "", // không prefill
        });
      } catch (error) {
        console.error("Error loading medicine", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isEditMode) fetchMedicine();
    else {
      setFormData({
        medicineName: "",
        description: "",
        quantity: "",
        unitPrice: "",
        companyName: "",
      });
    }
  }, [medicineId, isEditMode]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.medicineName.trim())
      newErrors.medicineName = "Medicine name is required.";
    if (!formData.description.trim())
      newErrors.description = "Description is required.";
    if (!formData.quantity.trim() || +formData.quantity <= 0)
      newErrors.quantity = "Quantity must be greater than 0.";
    if (!formData.unitPrice.trim() || +formData.unitPrice <= 0)
      newErrors.unitPrice = "Unit price must be greater than 0.";
    if (!isEditMode && !formData.companyName.trim())
      newErrors.companyName = "Company name is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const form = new FormData();
    form.append("medicineName", formData.medicineName);
    form.append("description", formData.description);
    form.append("quantity", formData.quantity);
    form.append("unitPrice", formData.unitPrice);
    if (!isEditMode) form.append("companyName", formData.companyName);

    try {
      if (isEditMode && medicineId) {
        await update.mutateAsync({ id: medicineId, formData: form });
      } else {
        await create.mutateAsync(form);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Error saving medicine", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-green-50 to-white p-6">
          <div className="flex items-center gap-3">
            <div
              className={`rounded-lg p-2 ${isEditMode ? "bg-orange-600" : "bg-green-600"}`}
            >
              {isEditMode ? (
                <Edit className="size-6 text-white" />
              ) : (
                <Plus className="size-6 text-white" />
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {isEditMode ? "Edit Medicine" : "Create New Medicine"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-gray-100"
          >
            <X className="size-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="max-h-[calc(90vh-80px)] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="size-12 animate-spin text-green-600" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              {[
                { label: "Medicine Name", field: "medicineName" },
                { label: "Description", field: "description" },
                { label: "Quantity", field: "quantity", type: "number" },
                {
                  label: "Unit Price (VND)",
                  field: "unitPrice",
                  type: "number",
                },
                ...(!isEditMode
                  ? [{ label: "Company Name", field: "companyName" }]
                  : []),
              ].map(({ label, field, type }) => (
                <div key={field}>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {label} *
                  </label>
                  <input
                    type={type || "text"}
                    value={(formData as any)[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className={`w-full rounded-lg border px-4 py-3 ${
                      errors[field]
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    } transition focus:ring-2 focus:ring-green-500`}
                    placeholder={`Enter ${label.toLowerCase()}`}
                  />
                  {errors[field] && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle className="size-4" />
                      {errors[field]}
                    </p>
                  )}
                </div>
              ))}

              <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg bg-gray-100 px-6 py-2 text-gray-600 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={create.isPending || update.isPending}
                  className={`flex items-center gap-2 rounded-lg px-6 py-2 text-white transition-all duration-200 ${
                    isEditMode
                      ? "bg-orange-600 hover:bg-orange-700"
                      : "bg-green-600 hover:bg-green-700"
                  } disabled:opacity-50`}
                >
                  {create.isPending || update.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Save className="size-4" />
                  )}
                  {isEditMode ? "Update Medicine" : "Create Medicine"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
