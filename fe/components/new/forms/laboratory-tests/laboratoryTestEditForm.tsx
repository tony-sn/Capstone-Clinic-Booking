"use client";

import React, { useState, useEffect } from 'react';
import { X, TestTubes, Save, Loader2, AlertCircle, Plus, Edit } from 'lucide-react';
import { useEditLaboratoryTest } from '@/hooks/laboratory-tests/useEditLaboratoryTests';
import { useQuery } from '@tanstack/react-query';
import { getLaboratoryTestById } from '@/lib/api/laboratory-test.actions';
import { LaboratoryTestReport } from '@/types/laboratoryTest';

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
  onSuccess 
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
    name: '',
    description: '',
    price: '',
    active: true
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Load existing data when in edit mode
  useEffect(() => {
    if (isEditMode && existingTest) {
      setFormData({
        name: existingTest.name || '',
        description: existingTest.description || '',
        price: existingTest.price?.toString() || '',
        active: existingTest.active ?? true
      });
    } else if (!isEditMode) {
      // Reset form for create mode
      setFormData({
        name: '',
        description: '',
        price: '',
        active: true
      });
    }
  }, [isEditMode, existingTest]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setErrors({});
      if (!isEditMode) {
        setFormData({
          name: '',
          description: '',
          price: '',
          active: true
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
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Test name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a valid positive number';
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
    submitFormData.append('name', formData.name.trim());
    submitFormData.append('description', formData.description.trim());
    submitFormData.append('price', formData.price);
    submitFormData.append('active', formData.active.toString());

    try {
      if (isEditMode) {
        await update.mutateAsync({ id: testId, formData: submitFormData });
      } else {
        await create.mutateAsync(submitFormData);
      }
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving laboratory test:', error);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  const isLoading = create.isPending || update.isPending || (isEditMode && isLoadingTest);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isEditMode ? 'bg-orange-600' : 'bg-green-600'}`}>
              {isEditMode ? (
                <Edit className="h-6 w-6 text-white" />
              ) : (
                <Plus className="h-6 w-6 text-white" />
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {isEditMode ? 'Edit Laboratory Test' : 'Create New Laboratory Test'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-lg text-blue-600 font-medium">
                  {isEditMode ? 'Loading test data...' : 'Saving test...'}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Test Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="Enter test name"
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none`}
                  placeholder="Enter test description"
                  disabled={isLoading}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (VND) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.price ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="Enter price"
                  min="0"
                  step="1000"
                  disabled={isLoading}
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.price}
                  </p>
                )}
              </div>

              {/* Active Status */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => handleInputChange('active', e.target.checked)}
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    disabled={isLoading}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Test is active and available for booking
                  </span>
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-2 text-white rounded-lg transition-all duration-200 flex items-center gap-2 ${
                    isEditMode 
                      ? 'bg-orange-600 hover:bg-orange-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg`}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {isEditMode ? 'Update Test' : 'Create Test'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}