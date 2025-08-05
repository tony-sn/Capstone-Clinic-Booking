"use client";

import {
  TestTubes,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
  Edit,
  Activity,
  AlertTriangle,
} from "lucide-react";
import { useState, useCallback, useMemo } from "react";

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

  // Close modals
  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingReport(null);
  }, []);

  // Handle success (refresh data)
  const handleSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto mb-4 size-12 animate-spin text-blue-600" />
              <p className="text-lg font-medium text-blue-600">
                Loading medical history reports...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-lg">
              <AlertCircle className="mx-auto mb-4 size-12 text-red-500" />
              <h3 className="mb-2 text-xl font-semibold text-gray-800">
                Unable to Load Reports
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
                  Laboratory Test Reports
                </h1>
                <p className="mt-1 text-gray-600">
                  Comprehensive medical testing and analysis
                </p>
              </div>
            </div>

            {/* Create Button */}
            <button
              onClick={handleCreateReport}
              className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-white transition-all duration-200 hover:bg-green-700 hover:shadow-lg"
            >
              <Plus className="size-5" />
              New
            </button>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-green-500" />
              <span>{reports.length} reports available</span>
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
        {showFilters && (
          <div className="mb-6 flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Loader2 className="size-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by result, test ID, medical history ID, technician name or email..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <AlertCircle className="size-4 text-gray-500" />
                </button>
              )}
            </div>
            <span className="text-sm text-gray-600">
              Found: {filteredReports.length}
            </span>
          </div>
        )}

        {filteredReports.length > 0 && (
          <div className="flex flex-col gap-6">
            {filteredReports.map((report, index) => (
              <ReportCard
                key={`${report.medicalHistoryId}-${index}`}
                report={report}
                searchQuery={searchQuery}
                onSelect={handleReportSelect}
                onEdit={handleEditReport}
              />
            ))}
          </div>
        )}

        {/* Empty State after search */}
        {filteredReports.length === 0 && reports.length > 0 && (
          <div className="py-16 text-center">
            <div className="mx-auto max-w-md rounded-2xl bg-white p-12 shadow-lg">
              <AlertTriangle className="mx-auto mb-6 size-16 text-yellow-500" />
              <h3 className="mb-3 text-xl font-semibold text-gray-800">
                No Reports Found
              </h3>
              <p className="mb-6 text-gray-600">
                No reports match your search criteria.
              </p>
              <button
                onClick={clearSearch}
                className="mx-auto flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-white transition-all duration-200 hover:bg-blue-700"
              >
                <Plus className="size-5" />
                Clear Search
              </button>
            </div>
          </div>
        )}

        {/* No Data State */}
        {reports.length === 0 && (
          <div className="py-16 text-center">
            <div className="mx-auto max-w-md rounded-2xl bg-white p-12 shadow-lg">
              <TestTubes className="mx-auto mb-6 size-16 text-gray-400" />
              <h3 className="mb-3 text-xl font-semibold text-gray-800">
                No Medical History Reports
              </h3>
              <p className="mb-6 text-gray-600">
                Medical history reports will appear here when available.
              </p>
              <button
                onClick={handleCreateReport}
                className="mx-auto flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-white transition-all duration-200 hover:bg-green-700"
              >
                <Plus className="size-5" />
                Create First Report
              </button>
            </div>
          </div>
        )}
      </div>

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
            <div className="relative z-10 my-8 inline-block w-full max-w-4xl overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
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

export default function MedicalHistoryLayoutClient({
  showFilters = true,
}: MedicalHistoryLayoutProps) {
  return <MedicalHistoryLayoutContent showFilters={showFilters} />;
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
    <div
      className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
      onClick={() => onSelect(report.medicalHistoryId, report.laboratoryTestId)}
    >
      <div className="p-6">
        {/* Header with Status and Action Buttons */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 transition-colors group-hover:bg-blue-200">
              <TestTubes className="size-5 text-blue-600" />
            </div>
            <div className="flex items-center gap-2">
              {report.active ? (
                <CheckCircle className="size-4 text-green-500" />
              ) : (
                <AlertCircle className="size-4 text-gray-400" />
              )}
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  report.active
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {report.active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(report.medicalHistoryId, report.laboratoryTestId);
              }}
              className="rounded-lg p-2 transition-colors hover:bg-orange-100"
              title="Edit report"
            >
              <Edit className="size-4 text-orange-600" />
            </button>
            {/* Delete button (example, not implemented in this file) */}
            {/* <button
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="rounded-lg p-2 transition-colors hover:bg-red-100"
              title="Delete report"
            >
              <Trash2 className="size-4 text-red-600" />
            </button> */}
          </div>
        </div>

        {/* Report ID and Medical History ID */}
        <div className="mb-4 flex gap-3">
          <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-1">
            <span className="text-xs font-medium text-blue-600">
              Test ID:{" "}
              {highlightText(report.laboratoryTestId.toString(), searchQuery)}
            </span>
          </div>
          <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-1">
            <span className="text-xs font-medium text-blue-600">
              Medical History ID:{" "}
              {highlightText(report.medicalHistoryId.toString(), searchQuery)}
            </span>
          </div>
        </div>

        {/* Test Result */}
        <h3
          className={`mb-3 line-clamp-2 text-lg font-semibold transition-colors group-hover:text-blue-600 ${
            report.result?.toLowerCase() === "positive"
              ? "text-red-600"
              : report.result?.toLowerCase() === "negative"
                ? "text-green-600"
                : "text-gray-800"
          }`}
        >
          Result:{" "}
          {report.result ? (
            highlightText(report.result, searchQuery)
          ) : (
            <span className="text-gray-500">Pending</span>
          )}
        </h3>

        {/* Technician Info */}
        <p className="mb-4 text-sm leading-relaxed text-gray-600">
          Technician:{" "}
          <span className="font-medium text-gray-800">
            {highlightText(technicianName, searchQuery)}
          </span>
          <br />
          Email:{" "}
          <span className="font-medium text-gray-800">
            {highlightText(report.technician.email, searchQuery)}
          </span>
        </p>

        {/* Call to Action Button */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <button
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(report.medicalHistoryId, report.laboratoryTestId);
            }}
          >
            View Details
          </button>
        </div>
      </div>
      {/* Hover Effect Overlay */}
      <div className="h-1 origin-left scale-x-0 bg-gradient-to-r from-blue-500 to-green-500 transition-transform duration-300 group-hover:scale-x-100"></div>
    </div>
  );
}
