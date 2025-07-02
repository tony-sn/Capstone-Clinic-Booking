"use client";

import React, { useState } from 'react';
import { Activity, TestTubes, Clock, CheckCircle, AlertCircle, Loader2, DollarSign, Plus, Edit, Trash2 } from 'lucide-react';
import InfiniteScroll from "@/components/InfiniteScroll";
import { useInfiniteLaboratoryTests } from "@/hooks/laboratory-tests/useLaboratoryTests";
import { useEditLaboratoryTest } from '@/hooks/laboratory-tests/useEditLaboratoryTests';
import { LaboratoryTestReport } from '@/types/laboratoryTest';
import LaboratoryTestModal from '@/components/new/forms/laboratory-tests/laboratoryTestDetailForm';
import LaboratoryTestEditModal from '@/components/new/forms/laboratory-tests/laboratoryTestEditForm';
import LaboratoryTestDeleteModal from '@/components/new/forms/laboratory-tests/laboratoryTestDetailDelete';

// Format currency helper
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export default function LaboratoryTestPage() {
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingTestId, setEditingTestId] = useState<number | undefined>(undefined);
  const [deletingTestId, setDeletingTestId] = useState<number | null>(null);
  
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useInfiniteLaboratoryTests(0);

  const { remove } = useEditLaboratoryTest();

  // Extract data directly from ApiResponse structure
  const tests: LaboratoryTestReport[] = data?.pages.flatMap(page => page.data || []) || [];

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
    const test = tests.find(t => t.id === deletingTestId);
    return test?.name;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-lg text-blue-600 font-medium">Loading laboratory tests...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-red-100">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Tests</h3>
              <p className="text-gray-600">Something went wrong while fetching laboratory tests.</p>
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
        <div className="bg-white shadow-sm border-b border-blue-100">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 p-3 rounded-xl">
                  <TestTubes className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Laboratory Tests</h1>
                  <p className="text-gray-600 mt-1">Comprehensive medical testing services</p>
                </div>
              </div>
              
              {/* Create Button */}
              <button
                onClick={handleCreateTest}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 hover:shadow-lg"
              >
                <Plus className="h-5 w-5" />
                Create New Test
              </button>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" />
                <span>{tests.length} tests available</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>Fast & accurate results</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-6xl mx-auto p-6">
          <InfiniteScroll
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          >
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tests.map((test, index) => (
                <div
                  key={test.id || index}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group cursor-pointer"
                  onClick={() => handleTestClick(test.id)}
                >
                  <div className="p-6">
                    {/* Header with Action Buttons */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                          <TestTubes className="h-5 w-5 text-blue-600" />
                        </div>
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
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleEditTest(e, test.id)}
                          className="p-2 hover:bg-orange-100 rounded-lg transition-colors"
                          title="Edit test"
                        >
                          <Edit className="h-4 w-4 text-orange-600" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteTest(e, test.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete test"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </div>

                    {/* Test ID */}
                    <div className="flex gap-3 mb-4">
                      <div className="bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                        <span className="text-xs text-blue-600 font-medium">Test ID: {test.id}</span>
                      </div>
                    </div>

                    {/* Test Name */}
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {test.name}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {test.description}
                    </p>

                    {/* Price and Book Button */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-lg font-bold text-green-600">
                          {formatCurrency(test.price)}
                        </span>
                      </div>
                      
                      <button 
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          test.active
                            ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!test.active}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (test.active) {
                            // Handle booking logic here
                            console.log('Book test:', test.id);
                          }
                        }}
                      >
                        {test.active ? 'Book Test' : 'Unavailable'}
                      </button>
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="h-1 bg-gradient-to-r from-blue-500 to-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </div>
              ))}
            </div>

            {/* Loading More Indicator */}
            {isFetchingNextPage && (
              <div className="flex items-center justify-center py-12">
                <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="text-blue-600 font-medium">Loading more laboratory tests...</span>
                </div>
              </div>
            )}
          </InfiniteScroll>

          {/* No More Results */}
          {!hasNextPage && tests.length > 0 && (
            <div className="text-center py-12">
              <div className="bg-white rounded-2xl shadow-lg p-8 mx-auto max-w-md">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">All Tests Loaded</h3>
                <p className="text-gray-600">You've viewed all available laboratory tests.</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {tests.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-lg p-12 mx-auto max-w-md">
                <TestTubes className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-800 mb-3">No Tests Available</h3>
                <p className="text-gray-600 mb-6">Laboratory tests will appear here when available.</p>
                <button
                  onClick={handleCreateTest}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 mx-auto transition-all duration-200"
                >
                  <Plus className="h-5 w-5" />
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