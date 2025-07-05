"use client";

import { useMedicalHistoryReport } from "@/hooks/laboratory-test-report/useLaboratoryTestReport";
import { LaboratoryTestReportResult } from "@/types/laboratoryTestReport";

interface MedicalHistoryReportDetailProps {
  medicalHistoryId: number;
  laboratoryTestId: number;
  showBackButton?: boolean;
  onBack?: () => void;
}

export default function MedicalHistoryReportDetail({
  medicalHistoryId,
  laboratoryTestId,
  showBackButton = true,
  onBack
}: MedicalHistoryReportDetailProps) {
  const {
    data: report,
    isLoading,
    error,
    refetch
  } = useMedicalHistoryReport(medicalHistoryId, laboratoryTestId);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <p className="text-red-600">Error loading report details</p>
          <button 
            onClick={() => refetch()} 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-6">
        <div className="text-center py-8 text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>Report not found</p>
          {showBackButton && onBack && (
            <button 
              onClick={onBack}
              className="mt-2 text-blue-600 hover:text-blue-800"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <h1 className="text-2xl font-bold">Laboratory Test Report</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 text-sm rounded-full ${
            report.active 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {report.active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Report Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Information */}
        <ReportInfoCard title="Test Information" report={report} />
        
        {/* Technician Information */}
        <TechnicianInfoCard title="Technician Information" technician={report.technician} />
      </div>

      {/* Test Result */}
      <TestResultCard result={report.result} />
    </div>
  );
}

// Report Information Card
function ReportInfoCard({ title, report }: { title: string; report: LaboratoryTestReportResult }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">{title}</h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-600">Medical History ID:</span>
          <span className="text-sm text-gray-900 font-mono">{report.medicalHistoryId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-600">Laboratory Test ID:</span>
          <span className="text-sm text-gray-900 font-mono">{report.laboratoryTestId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-600">Status:</span>
          <span className={`text-sm font-medium ${
            report.active ? 'text-green-600' : 'text-gray-600'
          }`}>
            {report.active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </div>
  );
}

// Technician Information Card
function TechnicianInfoCard({ title, technician }: { title: string; technician: any }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">{title}</h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-600">Name:</span>
          <span className="text-sm text-gray-900">{technician.firstName} {technician.lastName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-600">Username:</span>
          <span className="text-sm text-gray-900 font-mono">{technician.userName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-600">Email:</span>
          <span className="text-sm text-blue-600">{technician.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-600">Phone:</span>
          <span className="text-sm text-gray-900">{technician.phoneNumber || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-600">ID:</span>
          <span className="text-sm text-gray-900 font-mono">{technician.id}</span>
        </div>
      </div>
    </div>
  );
}

// Test Result Card
function TestResultCard({ result }: { result: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">Test Result</h2>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
          {result}
        </pre>
      </div>
    </div>
  );
}