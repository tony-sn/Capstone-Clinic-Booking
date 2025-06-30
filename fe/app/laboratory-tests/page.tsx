"use client";

import React from 'react';
import { Activity, TestTubes, Clock, CheckCircle, AlertCircle, Loader2, DollarSign } from 'lucide-react';
import InfiniteScroll from "@/components/InfiniteScroll";
import { useInfiniteLaboratoryTests } from "@/hooks/laboratory-tests/useLaboratoryTests";
import { LaboratoryTestReport } from '@/types/laboratoryTest';


// Format currency helper
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export default function LaboratoryTestPage() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteLaboratoryTests(0);

  // Extract data directly from ApiResponse structure
  const tests: LaboratoryTestReport[] = data?.pages.flatMap(page => page.data || []) || [];

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-600 p-3 rounded-xl">
              <TestTubes className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Laboratory Tests</h1>
              <p className="text-gray-600 mt-1">Comprehensive medical testing services</p>
            </div>
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
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
              >
                <div className="p-6">
                  {/* Header */}
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
                  </div>

                  {/* IDs Section */}
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

                  {/* Price */}
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
              <p className="text-gray-600">Laboratory tests will appear here when available.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}