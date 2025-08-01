"use client";

import {
  Activity,
  TestTubes,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  DollarSign,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";

import RoleGuard from "@/components/auth/RoleGuard";
import InfiniteScroll from "@/components/InfiniteScroll";
import LaboratoryTestDeleteModal from "@/components/new/forms/laboratory-tests/laboratoryTestDetailDelete";
import LaboratoryTestModal from "@/components/new/forms/laboratory-tests/laboratoryTestDetailForm";
import LaboratoryTestEditModal from "@/components/new/forms/laboratory-tests/laboratoryTestEditForm";
// import { useEditLaboratoryTest } from "@/hooks/laboratory-tests/useEditLaboratoryTests";
import { useInfiniteLaboratoryTests } from "@/hooks/laboratory-tests/useLaboratoryTests";
import { LaboratoryTestReport } from "@/types/laboratoryTest";

// Format currency helper
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

function LaboratoryTestPageContent() {
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingTestId, setEditingTestId] = useState<number | undefined>(
    undefined
  );
  const [deletingTestId, setDeletingTestId] = useState<number | null>(null);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteLaboratoryTests(0);

  // const { remove } = useEditLaboratoryTest();

  // Extract data directly from ApiResponse structure
  const tests: LaboratoryTestReport[] =
    data?.pages.flatMap((page) => page.data || []) || [];

  // Handle test card click (for detail view)
  const handleTestClick = (testId: number) => {
    setSelectedTestId(testId);
    setIsDetailModalOpen(true);
  };

  // Handle detail modal close
  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false);
    setSelectedTestId(null);
  };

  // Handle create button
  const handleCreateTest = () => {
    setEditingTestId(undefined); // undefined = create mode
    setIsEditModalOpen(true);
  };

  // Handle edit button
  const handleEditTest = (e: React.MouseEvent, testId: number) => {
    e.stopPropagation();
    setEditingTestId(testId);
    setIsEditModalOpen(true);
  };

  // Handle delete button - open modal instead of confirm
  const handleDeleteTest = (e: React.MouseEvent, testId: number) => {
    e.stopPropagation();
    setDeletingTestId(testId);
    setIsDeleteModalOpen(true);
  };

  // Handle edit modal close
  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingTestId(undefined);
  };

  // Handle delete modal close
  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setDeletingTestId(null);
  };

  // Handle successful create/update
  const handleEditSuccess = () => {
    refetch(); // Refresh the list
  };

  // Handle successful delete
  const handleDeleteSuccess = () => {
    setIsDeleteModalOpen(false);
    setDeletingTestId(null);
    refetch(); // Refresh the list
  };

  // Get deleting test name for modal
  const getDeletingTestName = () => {
    if (!deletingTestId) return undefined;
    const test = tests.find((t) => t.id === deletingTestId);
    return test?.name;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto mb-4 size-12 animate-spin text-blue-600" />
              <p className="text-lg font-medium text-blue-600">
                Loading laboratory tests...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-lg">
              <AlertCircle className="mx-auto mb-4 size-12 text-red-500" />
              <h3 className="mb-2 text-xl font-semibold text-gray-800">
                Unable to Load Tests
              </h3>
              <p className="text-gray-600">
                Something went wrong while fetching laboratory tests.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        {/* Header Section */}
        <div className="border-b border-blue-100 bg-white shadow-sm">
          <div className="mx-auto max-w-6xl px-6 py-8">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-blue-600 p-3">
                  <TestTubes className="size-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    Laboratory Tests
                  </h1>
                  <p className="mt-1 text-gray-600">
                    Comprehensive medical testing services
                  </p>
                </div>
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreateTest}
                className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-white transition-all duration-200 hover:bg-green-700 hover:shadow-lg"
              >
                <Plus className="size-5" />
                Create New Test
              </button>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Activity className="size-4 text-green-500" />
                <span>{tests.length} tests available</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-blue-500" />
                <span>Fast & accurate results</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="mx-auto max-w-6xl p-6">
          <InfiniteScroll
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          >
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tests.map((test, index) => (
                <div
                  key={test.id || index}
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
                  onClick={() => handleTestClick(test.id)}
                >
                  <div className="p-6">
                    {/* Header with Action Buttons */}
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-blue-100 p-2 transition-colors group-hover:bg-blue-200">
                          <TestTubes className="size-5 text-blue-600" />
                        </div>
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
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={(e) => handleEditTest(e, test.id)}
                          className="rounded-lg p-2 transition-colors hover:bg-orange-100"
                          title="Edit test"
                        >
                          <Edit className="size-4 text-orange-600" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteTest(e, test.id)}
                          className="rounded-lg p-2 transition-colors hover:bg-red-100"
                          title="Delete test"
                        >
                          <Trash2 className="size-4 text-red-600" />
                        </button>
                      </div>
                    </div>

                    {/* Test ID */}
                    <div className="mb-4 flex gap-3">
                      <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-1">
                        <span className="text-xs font-medium text-blue-600">
                          Test ID: {test.id}
                        </span>
                      </div>
                    </div>

                    {/* Test Name */}
                    <h3 className="mb-3 line-clamp-2 text-lg font-semibold text-gray-800 transition-colors group-hover:text-blue-600">
                      {test.name}
                    </h3>

                    {/* Description */}
                    <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600">
                      {test.description}
                    </p>

                    {/* Price and Book Button */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="size-4 text-green-600" />
                        <span className="text-lg font-bold text-green-600">
                          {formatCurrency(test.price)}
                        </span>
                      </div>

                      <button
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                          test.active
                            ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
                            : "cursor-not-allowed bg-gray-200 text-gray-500"
                        }`}
                        disabled={!test.active}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (test.active) {
                            // Handle booking logic here
                            console.log("Book test:", test.id);
                          }
                        }}
                      >
                        {test.active ? "Book Test" : "Unavailable"}
                      </button>
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="h-1 origin-left scale-x-0 bg-gradient-to-r from-blue-500 to-green-500 transition-transform duration-300 group-hover:scale-x-100"></div>
                </div>
              ))}
            </div>

            {/* Loading More Indicator */}
            {isFetchingNextPage && (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-lg">
                  <Loader2 className="size-6 animate-spin text-blue-600" />
                  <span className="font-medium text-blue-600">
                    Loading more laboratory tests...
                  </span>
                </div>
              </div>
            )}
          </InfiniteScroll>

          {/* No More Results */}
          {!hasNextPage && tests.length > 0 && (
            <div className="py-12 text-center">
              <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-lg">
                <CheckCircle className="mx-auto mb-4 size-12 text-green-500" />
                <h3 className="mb-2 text-lg font-semibold text-gray-800">
                  All Tests Loaded
                </h3>
                <p className="text-gray-600">
                  You&apos;ve viewed all available laboratory tests.
                </p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {tests.length === 0 && !isLoading && (
            <div className="py-16 text-center">
              <div className="mx-auto max-w-md rounded-2xl bg-white p-12 shadow-lg">
                <TestTubes className="mx-auto mb-6 size-16 text-gray-400" />
                <h3 className="mb-3 text-xl font-semibold text-gray-800">
                  No Tests Available
                </h3>
                <p className="mb-6 text-gray-600">
                  Laboratory tests will appear here when available.
                </p>
                <button
                  onClick={handleCreateTest}
                  className="mx-auto flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-white transition-all duration-200 hover:bg-green-700"
                >
                  <Plus className="size-5" />
                  Create First Test
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedTestId && (
        <LaboratoryTestModal
          laboratoryTestId={selectedTestId}
          isOpen={isDetailModalOpen}
          onClose={handleDetailModalClose}
        />
      )}

      {/* Edit/Create Modal */}
      <LaboratoryTestEditModal
        testId={editingTestId}
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && deletingTestId && (
        <LaboratoryTestDeleteModal
          laboratoryTestId={deletingTestId}
          laboratoryTestName={getDeletingTestName()}
          isOpen={isDeleteModalOpen}
          onClose={handleDeleteModalClose}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </>
  );
}

export default function LaboratoryTestPage() {
  return (
    <RoleGuard allowedRoles={["Admin", "Doctor", "Staff"]}>
      <LaboratoryTestPageContent />
    </RoleGuard>
  );
}
