"use client";

import {
  X,
  TestTubes,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Loader2,
  Activity,
  Clock,
} from "lucide-react";
import React from "react";

import { laboratoryTestDetail } from "@/hooks/laboratory-tests/useLaboratoryTests";
import { LaboratoryTestReport } from "@/types/laboratoryTest";

interface LaboratoryTestModalProps {
  laboratoryTestId: number;
  isOpen: boolean;
  onClose: () => void;
}

// Format currency helper
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export default function LaboratoryTestModal({
  laboratoryTestId,
  isOpen,
  onClose,
}: LaboratoryTestModalProps) {
  const { data, isLoading, isError } = laboratoryTestDetail({
    laboratoryTestId,
  });

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-600 p-2">
              <TestTubes className="size-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Test Details</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
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
                  Loading test details...
                </p>
              </div>
            </div>
          ) : isError || !test ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <AlertCircle className="mx-auto mb-4 size-12 text-red-500" />
                <h3 className="mb-2 text-xl font-semibold text-gray-800">
                  Test Not Found
                </h3>
                <p className="text-gray-600">
                  Unable to load test details. Please try again.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6">
              {/* Test Header */}
              <div className="mb-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="mb-2 text-2xl font-bold text-gray-800">
                      {test.name}
                    </h1>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {test.active ? (
                          <CheckCircle className="size-4 text-green-500" />
                        ) : (
                          <AlertCircle className="size-4 text-gray-400" />
                        )}
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            test.active
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {test.active ? "Available" : "Unavailable"}
                        </span>
                      </div>
                      <div className="rounded border border-blue-100 bg-blue-50 px-2 py-1">
                        <span className="text-xs font-medium text-blue-600">
                          ID: {test.id}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="mb-1 text-2xl font-bold text-green-600">
                      {formatCurrency(test.price)}
                    </div>
                    <p className="text-sm text-gray-500">Test fee</p>
                  </div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="space-y-4 lg:col-span-2">
                  {/* Description */}
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Activity className="size-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-800">
                        Description
                      </h3>
                    </div>
                    <p className="leading-relaxed text-gray-600">
                      {test.description}
                    </p>
                  </div>

                  {/* Test Information Grid */}
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <TestTubes className="size-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">
                          Test ID
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-blue-800">
                        {test.id}
                      </p>
                    </div>

                    <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Activity className="size-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">
                          Status
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-green-800">
                        {test.active ? "Available" : "Unavailable"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                  {/* Booking Card */}
                  <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-green-50 p-4">
                    <h3 className="mb-4 text-lg font-semibold text-gray-800">
                      Book This Test
                    </h3>

                    <button
                      className={`mb-3 w-full rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                        test.active
                          ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"
                          : "cursor-not-allowed bg-gray-200 text-gray-500"
                      }`}
                      disabled={!test.active}
                    >
                      {test.active ? "Book Now" : "Currently Unavailable"}
                    </button>

                    <div className="text-center text-xs text-gray-500">
                      Quick & easy booking process
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <h4 className="text-md mb-3 font-semibold text-gray-800">
                      Quick Info
                    </h4>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="size-3 text-blue-500" />
                        <span>Fast results</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Activity className="size-3 text-green-500" />
                        <span>Professional testing</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <TestTubes className="size-3 text-purple-500" />
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
