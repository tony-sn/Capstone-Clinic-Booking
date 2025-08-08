"use client";

import { X, Loader2, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

import { useAdminActions } from "@/hooks/admin/useAdminUsers";
import { mappedRole } from "@/lib/utils";

// Backend roles that the API expects
const BACKEND_ROLES = ["Admin", "Doctor", "User", "Staff"];

// Frontend display roles (User -> Patient)
const DISPLAY_ROLES = BACKEND_ROLES.map((role) => mappedRole(role));

// Helper function to convert display role back to backend role
const getBackendRole = (displayRole: string) => {
  return displayRole === "Patient" ? "User" : displayRole;
};

export default function CreateUserModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    displayRoles: [] as string[],
  });

  const { createUser } = useAdminActions();

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (displayRole: string, checked: boolean) => {
    if (checked) {
      setFormState((prev) => ({
        ...prev,
        displayRoles: [...prev.displayRoles, displayRole],
      }));
    } else {
      setFormState((prev) => ({
        ...prev,
        displayRoles: prev.displayRoles.filter((r) => r !== displayRole),
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert display roles back to backend roles before sending to API
    const backendRoles = formState.displayRoles.map((displayRole) =>
      getBackendRole(displayRole)
    );

    const userData = {
      email: formState.email,
      password: formState.password,
      firstName: formState.firstName,
      lastName: formState.lastName,
      roles: backendRoles,
    };

    createUser.mutate(userData, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  };

  const isFormValid =
    formState.email &&
    formState.password &&
    formState.firstName &&
    formState.lastName &&
    formState.displayRoles.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4">
      <div className="flex min-h-full items-center justify-center p-4">
        <form
          onSubmit={handleSubmit}
          className="relative w-full max-w-lg space-y-4 rounded-xl bg-white p-6 shadow-lg"
        >
          <button
            type="button"
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <X className="size-5" />
          </button>

          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-2">
              <UserPlus className="size-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Create New User
              </h2>
              <p className="text-sm text-gray-600">
                Add a new user to the system
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                First Name *
              </label>
              <input
                name="firstName"
                type="text"
                value={formState.firstName}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Last Name *
              </label>
              <input
                name="lastName"
                type="text"
                value={formState.lastName}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                name="email"
                type="email"
                value={formState.email}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Password *
              </label>
              <input
                name="password"
                type="password"
                value={formState.password}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
                minLength={6}
              />
              <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Assign Roles: *
            </label>

            <div className="max-h-32 space-y-2 overflow-y-auto rounded-md border bg-gray-50 p-3">
              {DISPLAY_ROLES.map((displayRole) => (
                <label
                  key={displayRole}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <input
                    type="checkbox"
                    checked={formState.displayRoles.includes(displayRole)}
                    onChange={(e) =>
                      handleRoleChange(displayRole, e.target.checked)
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{displayRole}</span>
                </label>
              ))}
            </div>

            {formState.displayRoles.length > 0 && (
              <div className="mt-2">
                <p className="mb-1 text-sm text-gray-600">Selected roles:</p>
                <div className="flex flex-wrap gap-1">
                  {formState.displayRoles.map((displayRole) => (
                    <span
                      key={displayRole}
                      className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
                    >
                      {displayRole}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={createUser.isPending}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createUser.isPending || !isFormValid}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {createUser.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
