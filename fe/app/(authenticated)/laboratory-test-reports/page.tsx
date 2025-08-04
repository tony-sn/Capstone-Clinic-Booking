"use client";

import { useState, useCallback, useMemo } from "react";

import RoleGuard from "@/components/auth/RoleGuard";
import MedicalHistoryReportDetail from "@/components/new/forms/laboratory-test-reports/laboratoryTestReportDetail";
import LaboratoryTestReportEdit from "@/components/new/forms/laboratory-test-reports/laboratoryTestReportEdit";
import { useMedicalHistoryReports } from "@/hooks/laboratory-test-report/useLaboratoryTestReport";
import { LaboratoryTestReportResult } from "@/types/laboratoryTestReport";

interface MedicalHistoryLayoutProps {
  showFilters?: boolean;
}

function MedicalHistoryLayoutContent({
  showFilters = true,
}: MedicalHistoryLayoutProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<{
    medicalHistoryId: number;
    laboratoryTestId: number;
  } | null>(null);
  const [editingReport, setEditingReport] = useState<{
    medicalHistoryId?: number;
    laboratoryTestId?: number;
  } | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    data: reports = [],
    isLoading,
    error,
    refetch,
  } = useMedicalHistoryReports();

  // Client-side filtering with search
  const filteredReports = useMemo(() => {
    if (!searchQuery.trim()) return reports;

    const query = searchQuery.toLowerCase().trim();
    return reports.filter(
      (report) =>
        report.result?.toLowerCase().includes(query) ||
        report.laboratoryTestId.toString().includes(query) ||
        report.medicalHistoryId.toString().includes(query) ||
        `${report.technician.firstName} ${report.technician.lastName}`
          .toLowerCase()
          .includes(query) ||
        report.technician.email.toLowerCase().includes(query)
    );
  }, [reports, searchQuery]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  // Handle view detail
  const handleReportSelect = useCallback(
    (medicalHistoryId: number, laboratoryTestId: number) => {
      setSelectedReport({ medicalHistoryId, laboratoryTestId });
      setIsDetailModalOpen(true);
    },
    []
  );

  // Handle edit report
  const handleEditReport = useCallback(
    (medicalHistoryId: number, laboratoryTestId: number) => {
      setEditingReport({ medicalHistoryId, laboratoryTestId });
      setIsEditModalOpen(true);
    },
    []
  );

  // Handle create new report
  const handleCreateReport = useCallback(() => {
    setEditingReport({});
    setIsEditModalOpen(true);
  }, []);

  // Close modals
  const handleCloseDetailModal = useCallback(() => {
    setIsDetailModalOpen(false);
    setSelectedReport(null);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingReport(null);
  }, []);

  // Handle success (refresh data)
  const handleSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  if (error) {
    return (
      <div className="rounded-2xl border-2 border-red-300 bg-gradient-to-r from-red-50 to-pink-50 p-6 shadow-lg">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-red-100 p-2">
            <svg
              className="size-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-700">
              ❌ Error loading medical history
            </h3>
            <p className="text-red-600">
              Please try again or contact support if the issue persists
            </p>
          </div>
        </div>
        <button
          onClick={() => refetch()}
          className="rounded-xl bg-gradient-to-r from-red-500 to-pink-600 px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 hover:from-red-600 hover:to-pink-700 hover:shadow-xl"
        >
          🔄 Retry Loading
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-8 bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between rounded-2xl border border-blue-100 bg-white p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 p-3 shadow-lg">
            <svg
              className="size-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
              Medical History Reports
            </h1>
            <p className="mt-1 text-gray-600">
              🏥 Comprehensive lab test results and analysis
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Reports Count */}
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-blue-50 px-4 py-3">
            <div className="rounded-lg bg-emerald-100 p-2">
              <svg
                className="size-5 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div className="text-sm font-semibold text-emerald-700">
              <span className="text-2xl">{filteredReports.length}</span>
              <span className="mx-1">of</span>
              <span className="text-xl">{reports.length}</span>
              <div className="text-xs text-emerald-600">reports available</div>
            </div>
          </div>

          {/* Create Button */}
          <button
            onClick={handleCreateReport}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl"
          >
            <svg
              className="size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            ➕ Create Report
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      {showFilters && (
        <div className="space-y-6 rounded-2xl border border-blue-100 bg-white p-6 shadow-lg">
          {/* Search Bar */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
              <div className="rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 p-1">
                <svg
                  className="size-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <input
              type="text"
              placeholder="🔍 Search by result, test ID, medical history ID, technician name or email..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="block w-full rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50/50 to-purple-50/50 py-5 pl-16 pr-14 text-lg font-medium text-gray-700 transition-all placeholder:text-gray-500 focus:border-blue-400 focus:ring-4 focus:ring-blue-200"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="group absolute inset-y-0 right-0 flex items-center pr-5"
              >
                <div className="rounded-xl bg-red-100 p-2 transition-colors hover:bg-red-200">
                  <svg
                    className="size-4 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-4 rounded-2xl border-2 border-emerald-100 bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 p-5">
            {/* Search Stats */}
            {searchQuery && (
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-2 text-blue-700 shadow-sm">
                  <div className="rounded-lg bg-blue-100 p-1">
                    <svg
                      className="size-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                      />
                    </svg>
                  </div>
                  <span className="font-bold">
                    Search: &quot;{searchQuery}&quot;
                  </span>
                </div>
                <span className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 px-4 py-2 text-sm font-bold text-white shadow-lg">
                  <div className="rounded-full bg-white/20 p-1">
                    <svg
                      className="size-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  {filteredReports.length} found
                </span>
              </div>
            )}
            {!searchQuery && (
              <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-2 text-sm text-blue-700 shadow-sm">
                <div className="rounded-lg bg-blue-100 p-1">
                  <svg
                    className="size-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="font-medium">
                  💡 Use search to filter reports by test ID, result, or
                  technician
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-blue-100 bg-white py-16 shadow-lg">
          <div className="relative mb-6">
            <div className="size-16 animate-spin rounded-full border-4 border-blue-200"></div>
            <div className="absolute top-0 size-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-2">
                <svg
                  className="size-6 animate-pulse text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="text-center">
            <h3 className="mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
              Loading Medical Reports
            </h3>
            <p className="text-gray-600">
              🔄 Fetching the latest laboratory test results...
            </p>
          </div>
        </div>
      )}

      {/* Reports List */}
      {!isLoading && (
        <div className="space-y-6">
          {filteredReports.map((report, index) => (
            <ReportCard
              key={`${report.medicalHistoryId}-${index}`}
              report={report}
              searchQuery={searchQuery}
              onSelect={handleReportSelect}
              onEdit={handleEditReport}
            />
          ))}

          {/* Empty State */}
          {filteredReports.length === 0 && reports.length > 0 && (
            <div className="rounded-2xl border-2 border-dashed border-yellow-300 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 py-16 text-center shadow-lg">
              <div className="mx-auto mb-6 w-fit rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 p-4 shadow-lg">
                <svg
                  className="size-12 animate-bounce text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-2xl font-bold text-transparent">
                🔍 No reports found
              </h3>
              <p className="mb-6 text-lg text-gray-600">
                No reports match your current search criteria
              </p>
              <button
                onClick={clearSearch}
                className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
              >
                <div className="rounded-lg bg-white/20 p-1">
                  <svg
                    className="size-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
                🔄 Clear search
              </button>
            </div>
          )}

          {/* No Data State */}
          {reports.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-blue-300 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20 text-center shadow-lg">
              <div className="mx-auto mb-8 w-fit rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-6 shadow-xl">
                <svg
                  className="size-16 animate-pulse text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
                📋 No medical reports available
              </h3>
              <p className="text-lg text-gray-600">
                Medical history reports will appear here when available
              </p>
              <div className="mt-6">
                <button
                  onClick={handleCreateReport}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl"
                >
                  <svg
                    className="size-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Create Your First Report
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal for Report Detail */}
      {isDetailModalOpen && selectedReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-gray-500/75 transition-opacity"
              onClick={handleCloseDetailModal}
            />

            {/* Modal Content */}
            <div className="my-8 inline-block w-full max-w-4xl overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
              <MedicalHistoryReportDetail
                medicalHistoryId={selectedReport.medicalHistoryId}
                laboratoryTestId={selectedReport.laboratoryTestId}
                showBackButton={true}
                onBack={handleCloseDetailModal}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal for Edit/Create Report */}
      {isEditModalOpen && (
        <LaboratoryTestReportEdit
          medicalHistoryId={editingReport?.medicalHistoryId}
          laboratoryTestId={editingReport?.laboratoryTestId}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

export default function MedicalHistoryLayout({
  showFilters = true,
}: MedicalHistoryLayoutProps) {
  return (
    <RoleGuard allowedRoles={["Admin", "Doctor", "Staff"]}>
      <MedicalHistoryLayoutContent showFilters={showFilters} />
    </RoleGuard>
  );
}

// Report Card Component with action buttons
function ReportCard({
  report,
  searchQuery,
  onSelect,
  onEdit,
}: {
  report: LaboratoryTestReportResult;
  searchQuery: string;
  onSelect: (medicalHistoryId: number, laboratoryTestId: number) => void;
  onEdit: (medicalHistoryId: number, laboratoryTestId: number) => void;
}) {
  // Helper function to highlight search matches
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="rounded bg-yellow-200 px-1">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const technicianName = `${report.technician.firstName} ${report.technician.lastName}`;

  return (
    <div className="group rounded-2xl border-2 border-transparent bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 p-8 shadow-xl transition-all duration-300 hover:scale-[1.01] hover:border-blue-300 hover:shadow-2xl">
      {/* Header Section */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex flex-1 items-start gap-4">
          <div
            className={`rounded-2xl p-3 shadow-lg ${
              report.active
                ? "bg-gradient-to-r from-emerald-400 to-green-500"
                : "bg-gradient-to-r from-gray-400 to-gray-500"
            }`}
          >
            <svg
              className="size-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="mb-2 flex items-center gap-3 text-xl font-bold text-gray-900">
              <div className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 p-1">
                <svg
                  className="size-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                  />
                </svg>
              </div>
              🧪 Test ID:{" "}
              {highlightText(report.laboratoryTestId.toString(), searchQuery)}
            </h3>
            <p className="flex items-center gap-3 rounded-xl bg-blue-50 px-3 py-2 text-sm text-gray-600">
              <div className="rounded-lg bg-blue-100 p-1">
                <svg
                  className="size-3 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <span className="font-semibold">📋 Medical History:</span>
              {highlightText(report.medicalHistoryId.toString(), searchQuery)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold shadow-lg ${
              report.active
                ? "bg-gradient-to-r from-emerald-400 to-green-500 text-white"
                : "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700"
            }`}
          >
            <div
              className={`size-3 animate-pulse rounded-full ${
                report.active ? "bg-white" : "bg-gray-600"
              }`}
            ></div>
            {report.active ? "✅ Active" : "⏸️ Inactive"}
          </span>
        </div>
      </div>

      {/* Test Result Section */}
      <div className="mb-6 rounded-2xl border-l-4 border-blue-400 bg-gradient-to-r from-blue-50 to-purple-50 p-5 shadow-inner">
        <div className="mb-3 flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 p-2">
            <svg
              className="size-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-lg font-bold text-transparent">
            🧪 Test Result:
          </span>
        </div>
        <div
          className={`flex items-center gap-2 rounded-xl px-4 py-3 text-xl font-bold shadow-lg ${
            report.result?.toLowerCase() === "positive"
              ? "bg-gradient-to-r from-red-400 to-pink-500 text-white"
              : report.result?.toLowerCase() === "negative"
                ? "bg-gradient-to-r from-emerald-400 to-green-500 text-white"
                : "bg-gradient-to-r from-amber-400 to-orange-500 text-white"
          }`}
        >
          <span className="text-2xl">
            {report.result?.toLowerCase() === "positive"
              ? "🔴"
              : report.result?.toLowerCase() === "negative"
                ? "🟢"
                : "🟡"}
          </span>
          {highlightText(report.result || "Pending", searchQuery)}
        </div>
      </div>

      {/* Technician Section */}
      <div className="mb-6 border-t-2 border-blue-100 pt-4">
        <div className="flex items-center gap-4 rounded-xl bg-gradient-to-r from-emerald-50 to-blue-50 p-4 text-sm">
          <div className="rounded-xl bg-gradient-to-r from-emerald-400 to-blue-500 p-2 shadow-lg">
            <svg
              className="size-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <span className="font-bold text-gray-700">👨‍⚕️ Lab Technician:</span>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="text-lg font-bold text-gray-900">
                {highlightText(technicianName, searchQuery)}
              </span>
              <span className="rounded-lg bg-blue-100 px-3 py-1 font-semibold text-blue-600">
                📧 {highlightText(report.technician.email, searchQuery)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() =>
            onSelect(report.medicalHistoryId, report.laboratoryTestId)
          }
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
        >
          <svg
            className="size-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          👁️ View Details
        </button>

        <button
          onClick={() =>
            onEdit(report.medicalHistoryId, report.laboratoryTestId)
          }
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 px-4 py-3 font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:from-orange-600 hover:to-amber-700 hover:shadow-xl"
        >
          <svg
            className="size-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          ✏️ Edit Report
        </button>
      </div>
    </div>
  );
}
