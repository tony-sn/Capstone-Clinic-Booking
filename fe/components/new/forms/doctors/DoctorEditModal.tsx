"use client";

import { X, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { useEditDoctor } from "@/hooks/doctors/useEditDoctors";
import { DoctorDTO } from "@/types/doctor";

export default function DoctorEditModal({
  doctor,
  onClose,
  onSuccess,
}: {
  doctor: DoctorDTO;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    certificate: "",
    departmentID: 0,
    active: false,
  });

  const { mutate, isPending } = useEditDoctor();

  useEffect(() => {
    if (doctor) {
      setFormState({
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        certificate: doctor.certificate,
        departmentID: doctor.departmentID,
        active: doctor.active,
      });
    }
  }, [doctor]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement; // 👈 ép kiểu rõ ràng
    const { name, value, type, checked } = target;

    const val = type === "checkbox" ? checked : value;

    setFormState((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("FirstName", formState.firstName);
    formData.append("LastName", formState.lastName);
    formData.append("Certificate", formState.certificate);
    formData.append("DepartmentID", String(formState.departmentID));
    formData.append("Active", String(formState.active));

    mutate(
      { id: doctor.id, formData },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-xl space-y-4 rounded-xl bg-white p-6 shadow-lg"
      >
        <button
          type="button"
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X className="size-5" />
        </button>

        <h2 className="text-2xl font-semibold text-gray-800">Edit Doctor</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              name="firstName"
              value={formState.firstName}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              name="lastName"
              value={formState.lastName}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Certificate
            </label>
            <input
              name="certificate"
              value={formState.certificate}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div className="col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Department ID
            </label>
            <input
              name="departmentID"
              type="number"
              value={formState.departmentID}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div className="col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              name="active"
              checked={formState.active}
              onChange={handleChange}
              className="rounded border-gray-300"
            />
            <label className="text-sm text-gray-700">Active</label>
          </div>
        </div>

        <div className="pt-4 text-right">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
