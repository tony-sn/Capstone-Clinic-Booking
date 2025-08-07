"use client";

import { ColumnDef } from "@tanstack/react-table";

import PatientDetailsDialog from "@/components/patient/PatientDetailsDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/user";

export const patientColumns: ColumnDef<User>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      return <p className="text-14-medium">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "id",
    header: "Patient ID",
    cell: ({ row }) => {
      const user = row.original;
      return <p className="text-14-medium">#{user.id}</p>;
    },
  },
  {
    accessorKey: "firstName",
    header: "Name",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <p className="text-14-medium">
          {user.firstName} {user.lastName}
        </p>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const user = row.original;
      return <p className="text-14-regular">{user.username}</p>;
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const user = row.original;
      const isActive = user.roles && user.roles.length > 0;
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    id: "roles",
    header: "Roles",
    accessorKey: "roles",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex flex-wrap gap-1">
          {user.roles && user.roles.length > 0 ? (
            user.roles.map((role, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {role}
              </Badge>
            ))
          ) : (
            <Badge variant="secondary" className="text-xs">
              No roles
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }) => {
      const user = row.original;
      const isPatient = user.roles && user.roles.includes("User");

      return (
        <div className="flex gap-2">
          {isPatient && <PatientDetailsDialog patient={user} />}
          <Button variant="secondary" size="sm">
            Edit
          </Button>
        </div>
      );
    },
  },
];
