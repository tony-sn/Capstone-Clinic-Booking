"use client";

import {
  AlertCircle,
  Edit,
  Eye,
  FileText,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import DoctorDetailModal from "@/components/new/forms/doctors/DoctorDetailModal";
import DoctorEditModal from "@/components/new/forms/doctors/DoctorEditModal";
import { useDoctors } from "@/hooks/doctors/useDoctors";
import { DoctorDTO } from "@/types/doctor";

export default function DoctorPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorDTO | null>(null);
  const [editingDoctor, setEditingDoctor] = useState<DoctorDTO | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const {
    data: doctors = [],
    isLoading,
    refetch,
    error,
  } = useDoctors({
    pageSize: 100,
    pageNumber: 1,
  });

  const filteredDoctors = useMemo(() => {
    const doctorList = Array.isArray(doctors) ? doctors : (doctors?.data ?? []);

    if (!searchQuery.trim()) return doctorList;

    const query = searchQuery.toLowerCase().trim();
    return doctorList.filter(
      (doctor) =>
        doctor.firstName.toLowerCase().includes(query) ||
        doctor.lastName.toLowerCase().includes(query) ||
        doctor.certificate.toLowerCase().includes(query) ||
        doctor.department.name.toLowerCase().includes(query)
    );
  }, [doctors, searchQuery]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleView = useCallback((doctor: DoctorDTO) => {
    setSelectedDoctor(doctor);
    setShowDetailModal(true);
  }, []);

  const handleEdit = useCallback((doctor: DoctorDTO) => {
    setEditingDoctor(doctor);
    setShowEditModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedDoctor(null);
    setEditingDoctor(null);
    setShowDetailModal(false);
    setShowEditModal(false);
  }, []);

  const handleSuccess = useCallback(() => {
    handleCloseModal();
    refetch();
  }, [refetch, handleCloseModal]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-2 animate-spin text-blue-500">
            <FileText className="size-10" />
          </div>
          <p className="text-gray-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 size-12 text-red-500" />
          <p className="mb-4 text-gray-700">Failed to load doctor list.</p>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white"
          >
            <RotateCcw className="size-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-blue-600 p-3">
                <FileText className="size-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Doctor</h1>
                <p className="text-gray-600">
                  List of doctors in the clinic system
                </p>
              </div>
            </div>
          </div>

          <div className="relative mb-4">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="size-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, certificate or department..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-12 py-3 text-gray-700 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-4"
              >
                <X className="size-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {filteredDoctors.map((doctor: DoctorDTO) => (
            <div
              key={doctor.id}
              className="flex items-center justify-between rounded-xl bg-white p-6 shadow-md hover:shadow-lg"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Dr. {doctor.firstName} {doctor.lastName}
                </h2>
                <p className="text-sm text-gray-600">
                  Department: {doctor.department.name}
                </p>
                <p className="text-sm text-gray-600">
                  Certificate: {doctor.certificate}
                </p>
                <p className="text-sm text-gray-600">
                  Status:{" "}
                  {doctor.active ? (
                    <span className="font-medium text-green-600">Active</span>
                  ) : (
                    <span className="font-medium text-red-500">Inactive</span>
                  )}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleView(doctor)}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <Eye className="size-4" />
                  View
                </button>
                {/* <button
                  onClick={() => handleEdit(doctor)}
                  className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                >
                  <Edit className="size-4" />
                  Edit
                </button> */}
              </div>
            </div>
          ))}

          {filteredDoctors.length === 0 && (
            <div className="py-16 text-center text-gray-600">
              <Search className="mx-auto mb-4 size-12 text-gray-400" />
              No doctors found.
            </div>
          )}
        </div>
      </div>

      {showDetailModal && selectedDoctor && (
        <DoctorDetailModal doctor={selectedDoctor} onClose={handleCloseModal} />
      )}

      {showEditModal && editingDoctor && (
        <DoctorEditModal
          doctor={editingDoctor}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
