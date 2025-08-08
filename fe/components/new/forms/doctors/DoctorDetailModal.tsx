"use client";

import { X } from "lucide-react";

import { DoctorDTO } from "@/types/doctor";

export default function DoctorDetailModal({
  doctor,
  onClose,
}: {
  doctor: DoctorDTO;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-xl rounded-xl bg-white p-6 shadow-lg">
        <button
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X className="size-5" />
        </button>

        <h2 className="mb-4 text-2xl font-semibold text-gray-800">
          Doctor Detail
        </h2>

        <div className="space-y-4 text-gray-700">
          <div>
            <span className="font-medium">Name: </span>
            Dr. {doctor.firstName} {doctor.lastName}
          </div>
          <div>
            <span className="font-medium">Department: </span>
            {doctor.department.name}
          </div>
          <div>
            <span className="font-medium">Certificate: </span>
            {doctor.certificate}
          </div>
          <div>
            <span className="font-medium">User ID: </span>
            {doctor.userId}
          </div>
          <div>
            <span className="font-medium">Status: </span>
            {doctor.active ? (
              <span className="font-medium text-green-600">Active</span>
            ) : (
              <span className="font-medium text-red-500">Inactive</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
