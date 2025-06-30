"use client";

import InfiniteScroll from "@/components/InfiniteScroll";
import { useInfiniteMedicalHistories } from "@/hooks/medicalhistories/useMedicalhistories";
import { MedicalHistory } from "@/types/medicalHistory";
import MedicalHistoryDetailModal from "@/components/new/forms/medical-history/medicalhistoryDetailForm";
import MedicalHistoryFormModal from "@/components/new/forms/medical-history/medicalhistoryEditForm";

import Link from "next/link";
import { useState } from "react";

const MedicalHistoriesPage = () => {
    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
    } = useInfiniteMedicalHistories(0);

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Flatten all pages' data into a single array
    const histories: MedicalHistory[] = data?.pages
        ?.flatMap((page) => page?.data || []) || [];

    // Handler để mở detail modal
    const handleViewRecord = (medicalHistoryId: number) => {
        setSelectedId(medicalHistoryId);
        setIsDetailModalOpen(true);
    };

    // Handler để mở form modal (create)
    const handleCreateRecord = () => {
        setEditingId(null); // No ID = create mode
        setIsFormModalOpen(true);
    };

    // Handler để mở form modal (edit)
    const handleEditRecord = (medicalHistoryId: number) => {
        setEditingId(medicalHistoryId);
        setIsFormModalOpen(true);
    };

    // Handler để đóng detail modal
    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedId(null);
    };

    // Handler để đóng form modal
    const handleCloseFormModal = () => {
        setIsFormModalOpen(false);
        setEditingId(null);
    };

    // Handler sau khi create/update thành công
    const handleFormSuccess = () => {
        setIsFormModalOpen(false);
        setEditingId(null);
        refetch(); // Refresh data
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <h1 className="mb-4 text-2xl font-semibold">Medical Histories</h1>
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2">Loading medical histories...</span>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6">
                <h1 className="mb-4 text-2xl font-semibold">Medical Histories</h1>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">Failed to load medical histories. Please try again.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header with Create Button */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Medical Histories</h1>
                <button
                    onClick={handleCreateRecord}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Record
                </button>
            </div>

            {histories.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">No medical histories found.</p>
                    <button
                        onClick={handleCreateRecord}
                        className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                        Create First Record
                    </button>
                </div>
            ) : (
                <InfiniteScroll
                    fetchNextPage={fetchNextPage}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                >
                    <div className="space-y-4">
                        {histories.map((history) => (
                            <div
                                key={history.medicalHistoryId}
                                className={`bg-white rounded-xl border-l-4 shadow-sm hover:shadow-md transition-all duration-200 p-6 ${history.active
                                    ? 'border-l-emerald-500 hover:border-l-emerald-600'
                                    : 'border-l-slate-400 hover:border-l-slate-500'
                                    }`}
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-full">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 text-lg">
                                                Medical Record #{history.medicalHistoryId}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${history.active
                                                    ? 'bg-emerald-100 text-emerald-800'
                                                    : 'bg-slate-100 text-slate-800'
                                                    }`}>
                                                    <span className={`w-2 h-2 rounded-full mr-1.5 ${history.active ? 'bg-emerald-400' : 'bg-slate-400'
                                                        }`}></span>
                                                    {history.active ? 'Active Treatment' : 'Completed'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-slate-500 font-medium">Total Cost</p>
                                        <p className="text-2xl font-bold text-slate-900">
                                            ${history.totalAmount.toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                {/* Patient & Doctor Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <p className="text-sm font-medium text-blue-800">Patient Information</p>
                                        </div>
                                        <p className="text-lg font-semibold text-blue-900">ID: {history.patientId}</p>
                                    </div>
                                    <div className="bg-purple-50 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                            <p className="text-sm font-medium text-purple-800">Attending Physician</p>
                                        </div>
                                        <p className="text-lg font-semibold text-purple-900">Dr. ID: {history.doctorId}</p>
                                    </div>
                                </div>

                                {/* Medical Details */}
                                <div className="space-y-4">
                                    {history.symptoms && (
                                        <div className="border-l-4 border-red-200 pl-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                                                </svg>
                                                <h4 className="font-medium text-red-800">Reported Symptoms</h4>
                                            </div>
                                            <p className="text-sm text-slate-700 leading-relaxed">{history.symptoms}</p>
                                        </div>
                                    )}

                                    {history.diagnosis && (
                                        <div className="border-l-4 border-amber-200 pl-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                                <h4 className="font-medium text-amber-800">Medical Diagnosis</h4>
                                            </div>
                                            <p className="text-sm text-slate-700 leading-relaxed">{history.diagnosis}</p>
                                        </div>
                                    )}

                                    {history.treatmentInstructions && (
                                        <div className="border-l-4 border-green-200 pl-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                                </svg>
                                                <h4 className="font-medium text-green-800">Treatment Plan</h4>
                                            </div>
                                            <p className="text-sm text-slate-700 leading-relaxed">{history.treatmentInstructions}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-6 pt-4 border-t border-slate-200">
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleViewRecord(history.medicalHistoryId)}
                                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                                        >
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => handleEditRecord(history.medicalHistoryId)}
                                            className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors text-sm"
                                        >
                                            Edit Record
                                        </button>
                                        <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors text-sm">
                                            Print
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </InfiniteScroll>
            )}

            {/* Detail Modal */}
            {isDetailModalOpen && selectedId && (
                <MedicalHistoryDetailModal
                    medicalHistoryId={selectedId}
                    isOpen={isDetailModalOpen}
                    onClose={handleCloseDetailModal}
                />
            )}

            {/* Form Modal (Create/Edit) */}
            <MedicalHistoryFormModal
                medicalHistoryId={editingId}
                isOpen={isFormModalOpen}
                onClose={handleCloseFormModal}
                onSuccess={handleFormSuccess}
            />
        </div>
    );
};

export default MedicalHistoriesPage;