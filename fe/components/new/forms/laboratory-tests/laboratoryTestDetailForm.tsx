"use client";

import React from 'react';
import { X, TestTubes, DollarSign, CheckCircle, AlertCircle, Loader2, Activity, Clock } from 'lucide-react';
import { laboratoryTestDetail } from '@/hooks/laboratory-tests/useLaboratoryTests';
import { LaboratoryTestReport } from '@/types/laboratoryTest';

interface LaboratoryTestModalProps {
  laboratoryTestId: number;
  isOpen: boolean;
  onClose: () => void;
}

// Format currency helper
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export default function LaboratoryTestModal({ laboratoryTestId, isOpen, onClose }: LaboratoryTestModalProps) {
  const { data, isLoading, isError } = laboratoryTestDetail({ laboratoryTestId });
  
  // Extract test data from response
  const test: LaboratoryTestReport | undefined = data;

  if (!isOpen) return null;

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  React.useEffect(() => {
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

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <TestTubes className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Test Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                <p className="text-lg text-blue-600 font-medium">Loading test details...</p>
              </div>
            </div>
          ) : isError || !test ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Test Not Found</h3>
                <p className="text-gray-600">Unable to load test details. Please try again.</p>
              </div>
            </div>
          ) : (
            <div className="p-6">
              {/* Test Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">{test.name}</h1>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {test.active ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-gray-400" />
                        )}
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          test.active 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {test.active ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      <div className="bg-blue-50 px-2 py-1 rounded border border-blue-100">
                        <span className="text-xs text-blue-600 font-medium">ID: {test.id}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {formatCurrency(test.price)}
                    </div>
                    <p className="text-sm text-gray-500">Test fee</p>
                  </div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Description */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Activity className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-800">Description</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {test.description}
                    </p>
                  </div>

                  {/* Test Information Grid */}
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <TestTubes className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">Test ID</span>
                      </div>
                      <p className="text-lg font-semibold text-blue-800">{test.id}</p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">Status</span>
                      </div>
                      <p className="text-lg font-semibold text-green-800">
                        {test.active ? 'Available' : 'Unavailable'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                  {/* Booking Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-4 border border-blue-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Book This Test</h3>
                    
                    <button 
                      className={`w-full py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 mb-3 ${
                        test.active
                          ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!test.active}
                    >
                      {test.active ? 'Book Now' : 'Currently Unavailable'}
                    </button>

                    <div className="text-center text-xs text-gray-500">
                      Quick & easy booking process
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <h4 className="text-md font-semibold text-gray-800 mb-3">Quick Info</h4>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-3 w-3 text-blue-500" />
                        <span>Fast results</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Activity className="h-3 w-3 text-green-500" />
                        <span>Professional testing</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <TestTubes className="h-3 w-3 text-purple-500" />
                        <span>Advanced equipment</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}