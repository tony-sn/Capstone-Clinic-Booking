"use client";

import { useEffect, useState } from "react";
import { getAllMedicalHistory, updateMedicalHistory, createMedicalHistory } from "@/lib/api/medical-history.action";
import { useDoctors, usePatients } from "@/hooks/users/useUsers"; // Add correct import path
import type { MedicalHistory } from "@/types/medicalHistory";

interface MedicalHistoryFormModalProps {
    medicalHistoryId?: number; // Optional - if provided, it's edit mode
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void; // Callback after successful create/update
}

const MedicalHistoryFormModal = ({
    medicalHistoryId,
    isOpen,
    onClose,
    onSuccess,
}: MedicalHistoryFormModalProps) => {
    const [history, setHistory] = useState<MedicalHistory | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Fetch doctors and patients using custom hooks
    const { data: doctors, isLoading: doctorsLoading } = useDoctors();
    const { data: patients, isLoading: patientsLoading } = usePatients();

    // Determine if this is create or edit mode
    const isEditMode = !!medicalHistoryId;
    const modalTitle = isEditMode ? 'Edit Medical History' : 'Create New Medical History';

    // Form state
    const [formData, setFormData] = useState({
        symptoms: "",
        diagnosis: "",
        treatmentInstructions: "",
        totalAmount: 0,
        active: true,
        patientId: 0,
        doctorId: 0,
    });

    // Fetch existing data for edit mode
    useEffect(() => {
        if (!isOpen) return;

        if (isEditMode && medicalHistoryId) {
            const fetchDetail = async () => {
                try {
                    setLoading(true);
                    setError(null);

                    const res = await getAllMedicalHistory({ pageSize: 0, pageNumber: 1 });
                    const found = res.data.find(
                        (item) => item.medicalHistoryId === medicalHistoryId
                    );

                    if (found) {
                        setHistory(found);
                        setFormData({
                            symptoms: found.symptoms || "",
                            diagnosis: found.diagnosis || "",
                            treatmentInstructions: found.treatmentInstructions || "",
                            totalAmount: found.totalAmount || 0,
                            active: found.active,
                            patientId: found.patientId,
                            doctorId: found.doctorId,
                        });
                    } else {
                        setError("Medical history not found.");
                    }
                } catch (err) {
                    setError("Failed to load medical history details.");
                    console.error("Error fetching medical history:", err);
                } finally {
                    setLoading(false);
                }
            };

            fetchDetail();
        } else {
            // Create mode - reset form
            setFormData({
                symptoms: "",
                diagnosis: "",
                treatmentInstructions: "",
                totalAmount: 0,
                active: true,
                patientId: 0,
                doctorId: 0,
            });
            setHistory(null);
            setLoading(false);
        }
    }, [isOpen, isEditMode, medicalHistoryId]);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setError(null);
            setFormData({
                symptoms: "",
                diagnosis: "",
                treatmentInstructions: "",
                totalAmount: 0,
                active: true,
                patientId: 0,
                doctorId: 0,
            });
        }
    }, [isOpen]);

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : 
                   (name === 'patientId' || name === 'doctorId') ? parseInt(value) || 0 : value
        }));
    };

    // Handle checkbox change
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setSubmitting(true);
            setError(null);

            // Create FormData object
            const formDataToSend = new FormData();
            formDataToSend.append('symptoms', formData.symptoms);
            formDataToSend.append('diagnosis', formData.diagnosis);
            formDataToSend.append('treatmentInstructions', formData.treatmentInstructions);
            formDataToSend.append('totalAmount', formData.totalAmount.toString());
            formDataToSend.append('active', formData.active.toString());
            formDataToSend.append('patientId', formData.patientId.toString());
            formDataToSend.append('doctorId', formData.doctorId.toString());

            if (isEditMode && medicalHistoryId) {
                // Update existing record - add ID to FormData
                formDataToSend.append('MedicalHistoryId', medicalHistoryId.toString());
                await updateMedicalHistory(medicalHistoryId, formDataToSend);
            } else {
                // Create new record
                await createMedicalHistory(formDataToSend);
            }

            onSuccess?.();
            onClose();
        } catch (err) {
            setError(isEditMode ? "Failed to update medical history." : "Failed to create medical history.");
            console.error("Error submitting medical history:", err);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle backdrop click
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Handle escape key
    useEffect(() => {
        const handleEscapeKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="form-modal-title"
        >
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                    <h2 id="form-modal-title" className="text-2xl font-bold text-gray-900">
                        {modalTitle}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Close modal"
                    >
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600">Loading medical history...</span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Record Info Header (Edit Mode Only) */}
                        {isEditMode && history && (
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Medical Record #{history.medicalHistoryId}
                                </h3>
                            </div>
                        )}

                        {/* Error Display */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-red-800 font-medium">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Patient Dropdown */}
                            <div>
                                <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-2">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Patient *
                                    </div>
                                </label>
                                <select
                                    id="patientId"
                                    name="patientId"
                                    value={formData.patientId}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                    disabled={patientsLoading}
                                >
                                    <option value={0}>
                                        {patientsLoading ? "Loading patients..." : "Select a patient"}
                                    </option>
                                    {patients?.map((patient) => (
                                        <option key={patient.id} value={patient.id}>
                                            {patient.username} (ID: {patient.id})
                                        </option>
                                    ))}
                                </select>
                                {patientsLoading && (
                                    <p className="text-sm text-gray-500 mt-1">Loading patients...</p>
                                )}
                            </div>

                            {/* Doctor Dropdown */}
                            <div>
                                <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700 mb-2">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                        Doctor *
                                    </div>
                                </label>
                                <select
                                    id="doctorId"
                                    name="doctorId"
                                    value={formData.doctorId}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                    disabled={doctorsLoading}
                                >
                                    <option value={0}>
                                        {doctorsLoading ? "Loading doctors..." : "Select a doctor"}
                                    </option>
                                    {doctors?.map((doctor) => (
                                        <option key={doctor.id} value={doctor.id}>
                                            Dr. {doctor.username} (ID: {doctor.id})
                                        </option>
                                    ))}
                                </select>
                                {doctorsLoading && (
                                    <p className="text-sm text-gray-500 mt-1">Loading doctors...</p>
                                )}
                            </div>
                        </div>

                        {/* Symptoms */}
                        <div>
                            <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    Reported Symptoms
                                </div>
                            </label>
                            <textarea
                                id="symptoms"
                                name="symptoms"
                                value={formData.symptoms}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Describe the patient's symptoms..."
                            />
                        </div>

                        {/* Diagnosis */}
                        <div>
                            <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    Medical Diagnosis
                                </div>
                            </label>
                            <textarea
                                id="diagnosis"
                                name="diagnosis"
                                value={formData.diagnosis}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter the medical diagnosis..."
                            />
                        </div>

                        {/* Treatment Instructions */}
                        <div>
                            <label htmlFor="treatmentInstructions" className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                    Treatment Plan
                                </div>
                            </label>
                            <textarea
                                id="treatmentInstructions"
                                name="treatmentInstructions"
                                value={formData.treatmentInstructions}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter treatment instructions and plan..."
                            />
                        </div>

                        {/* Total Amount and Active Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700 mb-2">
                                    Total Amount ($) *
                                </label>
                                <input
                                    type="number"
                                    id="totalAmount"
                                    name="totalAmount"
                                    value={formData.totalAmount}
                                    onChange={handleInputChange}
                                    step="0.01"
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div className="flex items-center">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="active"
                                        name="active"
                                        checked={formData.active}
                                        onChange={handleCheckboxChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="active" className="ml-2 text-sm text-gray-700">
                                        Active Treatment
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        {isEditMode ? 'Updating...' : 'Creating...'}
                                    </div>
                                ) : (
                                    isEditMode ? 'Update Record' : 'Create Record'
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default MedicalHistoryFormModal;