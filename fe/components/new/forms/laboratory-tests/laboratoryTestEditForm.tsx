"use client";

import { useQuery } from "@tanstack/react-query";
import {
  X,
  TestTubes,
  Save,
  Loader2,
  AlertCircle,
  Plus,
  Edit,
} from "lucide-react";
import React, { useState, useEffect } from "react";

import { useEditLaboratoryTest } from "@/hooks/laboratory-tests/useEditLaboratoryTests";
import { getLaboratoryTestById } from "@/lib/api/laboratory-test.actions";
import { LaboratoryTestReport } from "@/types/laboratoryTest";

interface LaboratoryTestEditModalProps {
  testId?: number; // undefined = create mode, number = edit mode
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormData {
  name: string;
  description: string;
  price: string;
  active: boolean;
}

export default function LaboratoryTestEditModal({
  testId,
  isOpen,
  onClose,
  onSuccess,
}: LaboratoryTestEditModalProps) {
  const isEditMode = testId !== undefined;
  const { create, update } = useEditLaboratoryTest();

  // Get existing test data for edit mode
  const { data: existingTest, isLoading: isLoadingTest } = useQuery({
    queryKey: ["laboratoryTest", testId],
    queryFn: () => getLaboratoryTestById(testId!),
    enabled: isEditMode && testId !== undefined, // Only run query in edit mode
  });

  // Skip hook execution if not in edit mode
  const shouldSkipQuery = !isEditMode || testId === undefined;

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: "",
    active: true,
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Load existing data when in edit mode
  useEffect(() => {
    if (isEditMode && existingTest) {
      setFormData({
        name: existingTest.name || "",
        description: existingTest.description || "",
        price: existingTest.price?.toString() || "",
        active: existingTest.active ?? true,
      });
    } else if (!isEditMode) {
      // Reset form for create mode
      setFormData({
        name: "",
        description: "",
        price: "",
        active: true,
      });
    }
  }, [isEditMode, existingTest]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setErrors({});
      if (!isEditMode) {
        setFormData({
          name: "",
          description: "",
          price: "",
          active: true,
        });
      }
    }
  }, [isOpen, isEditMode]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Test name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a valid positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Create FormData object
    const submitFormData = new FormData();
    submitFormData.append("name", formData.name.trim());
    submitFormData.append("description", formData.description.trim());
    submitFormData.append("price", formData.price);
    submitFormData.append("active", formData.active.toString());

    try {
      if (isEditMode) {
        await update.mutateAsync({ id: testId, formData: submitFormData });
      } else {
        await create.mutateAsync(submitFormData);
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error saving laboratory test:", error);
    }
  };

  // Handle input changes
  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  const isLoading =
    create.isPending || update.isPending || (isEditMode && isLoadingTest);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white p-6">
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
              {isEditMode
                ? "Edit Laboratory Test"
                : "Create New Laboratory Test"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
            disabled={isLoading}
          >
            <X className="size-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="max-h-[calc(90vh-80px)] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="mx-auto mb-4 size-12 animate-spin text-blue-600" />
                <p className="text-lg font-medium text-blue-600">
                  {isEditMode ? "Loading test data..." : "Saving test..."}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              {/* Test Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Test Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full rounded-lg border px-4 py-3 ${
                    errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
                  } transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter test name"
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="size-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={4}
                  className={`w-full rounded-lg border px-4 py-3 ${
                    errors.description
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  } resize-none transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter test description"
                  disabled={isLoading}
                />
                {errors.description && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="size-4" />
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Price (VND) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  className={`w-full rounded-lg border px-4 py-3 ${
                    errors.price
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  } transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter price"
                  min="0"
                  step="1000"
                  disabled={isLoading}
                />
                {errors.price && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="size-4" />
                    {errors.price}
                  </p>
                )}
              </div>

              {/* Active Status */}
              <div>
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) =>
                      handleInputChange("active", e.target.checked)
                    }
                    className="size-5 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Test is active and available for booking
                  </span>
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg bg-gray-100 px-6 py-2 text-gray-600 transition-colors hover:bg-gray-200"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex items-center gap-2 rounded-lg px-6 py-2 text-white transition-all duration-200 ${
                    isEditMode
                      ? "bg-orange-600 hover:bg-orange-700"
                      : "bg-green-600 hover:bg-green-700"
                  } hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {isLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Save className="size-4" />
                  )}
                  {isEditMode ? "Update Test" : "Create Test"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
