"use client";

import { X, Loader2, Shield } from "lucide-react";
import { useEffect, useState } from "react";

import { useAdminActions } from "@/hooks/admin/useAdminUsers";
import { mappedRole } from "@/lib/utils";
import { User } from "@/types/user";

// Backend roles that the API expects
const BACKEND_ROLES = ["Admin", "Doctor", "User", "Staff"];

// Frontend display roles (User -> Patient)
const DISPLAY_ROLES = BACKEND_ROLES.map((role) => mappedRole(role));

// Helper function to convert display role back to backend role
const getBackendRole = (displayRole: string) => {
  return displayRole === "Patient" ? "User" : displayRole;
};

export default function EditUserRolesModal({
  user,
  onClose,
  onSuccess,
}: {
  user: User;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [selectedDisplayRoles, setSelectedDisplayRoles] = useState<string[]>(
    []
  );
  const { editRoles } = useAdminActions();

  useEffect(() => {
    if (user) {
      // Convert backend roles to display roles for the UI
      const displayRoles = (user.roles || []).map((role) => mappedRole(role));
      setSelectedDisplayRoles(displayRoles);
    }
  }, [user]);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleRoleChange = (displayRole: string, checked: boolean) => {
    if (checked) {
      setSelectedDisplayRoles((prev) => [...prev, displayRole]);
    } else {
      setSelectedDisplayRoles((prev) => prev.filter((r) => r !== displayRole));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert display roles back to backend roles before sending to API
    const backendRoles = selectedDisplayRoles.map((displayRole) =>
      getBackendRole(displayRole)
    );

    editRoles.mutate(
      { username: user.username, roles: backendRoles },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4">
      <div className="flex min-h-full items-center justify-center p-4">
        <form
          onSubmit={handleSubmit}
          className="relative w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow-lg"
        >
          <button
            type="button"
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <X className="size-5" />
          </button>

          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2">
              <Shield className="size-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Edit User Roles
              </h2>
              <p className="text-sm text-gray-600">
                {user.firstName} {user.lastName}
              </p>
            </div>
          </div>

          <div className="mb-4 rounded-md bg-gray-50 p-3">
            <p className="text-sm text-gray-600">
              <strong>User ID:</strong> {user.id}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Email:</strong> {user.username}
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Assign Roles:
            </label>

            <div className="max-h-40 space-y-2 overflow-y-auto rounded-md border p-3">
              {DISPLAY_ROLES.map((displayRole) => (
                <label
                  key={displayRole}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <input
                    type="checkbox"
                    checked={selectedDisplayRoles.includes(displayRole)}
                    onChange={(e) =>
                      handleRoleChange(displayRole, e.target.checked)
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{displayRole}</span>
                </label>
              ))}
            </div>

            {selectedDisplayRoles.length > 0 && (
              <div className="mt-2">
                <p className="mb-1 text-sm text-gray-600">Selected roles:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedDisplayRoles.map((displayRole) => (
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
              disabled={editRoles.isPending}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                editRoles.isPending || selectedDisplayRoles.length === 0
              }
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {editRoles.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
