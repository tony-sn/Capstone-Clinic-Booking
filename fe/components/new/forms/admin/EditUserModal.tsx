"use client";

import { Loader2, Edit } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminActions } from "@/hooks/admin/useAdminUsers";
import { mappedRole } from "@/lib/utils";
import { User as UserType } from "@/types/user";

// Backend roles that the API expects
// const BACKEND_ROLES = ["Admin", "Doctor", "User", "Staff"];

// Frontend display roles (User -> Patient)
// const DISPLAY_ROLES = BACKEND_ROLES.map((role) => mappedRole(role));

// Helper function to convert display role back to backend role
const getBackendRole = (displayRole: string) => {
  return displayRole === "Patient" ? "User" : displayRole;
};

export default function EditUserModal({
  user,
  open,
  onClose,
  onSuccess,
}: {
  user: UserType;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [formState, setFormState] = useState({
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    displayRoles: user.roles.map((role) => mappedRole(role)),
  });

  const { updateUser } = useAdminActions();

  useEffect(() => {
    // Reset form state when user changes
    setFormState({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      displayRoles: user.roles.map((role) => mappedRole(role)),
    });
  }, [user]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleRoleChange = (displayRole: string, checked: boolean) => {
  //   if (checked) {
  //     setFormState((prev) => ({
  //       ...prev,
  //       displayRoles: [...prev.displayRoles, displayRole],
  //     }));
  //   } else {
  //     setFormState((prev) => ({
  //       ...prev,
  //       displayRoles: prev.displayRoles.filter((r) => r !== displayRole),
  //     }));
  //   }
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert display roles back to backend roles before sending to API
    const backendRoles = formState.displayRoles.map((displayRole) =>
      getBackendRole(displayRole)
    );

    const userData = {
      id: user.id,
      username: formState.username,
      firstName: formState.firstName,
      lastName: formState.lastName,
      roles: backendRoles,
    };

    updateUser.mutate(userData, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  };

  const isFormValid =
    formState.username &&
    formState.firstName &&
    formState.lastName &&
    formState.displayRoles.length > 0;

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2">
              <Edit className="size-6 text-blue-600" />
            </div>
            <div>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information and roles
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                value={formState.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                value={formState.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Email *</Label>
            <Input
              id="username"
              name="username"
              type="email"
              value={formState.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-3">
            {/* <Label>Assign Roles: *</Label> */}
            {/**/}
            {/* <div className="max-h-32 space-y-2 overflow-y-auto rounded-md border bg-gray-50 p-3"> */}
            {/*   {DISPLAY_ROLES.map((displayRole) => ( */}
            {/*     <label */}
            {/*       key={displayRole} */}
            {/*       className="flex cursor-pointer items-center gap-2" */}
            {/*     > */}
            {/*       <input */}
            {/*         type="checkbox" */}
            {/*         checked={formState.displayRoles.includes(displayRole)} */}
            {/*         onChange={(e) => */}
            {/*           handleRoleChange(displayRole, e.target.checked) */}
            {/*         } */}
            {/*         className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" */}
            {/*       /> */}
            {/*       <span className="text-sm text-gray-700">{displayRole}</span> */}
            {/*     </label> */}
            {/*   ))} */}
            {/* </div> */}

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
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updateUser.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateUser.isPending || !isFormValid}
            >
              {updateUser.isPending && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              Update
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
