"use client";

import { Edit } from "lucide-react";
import { useState } from "react";

import EditUserModal from "@/components/new/forms/admin/EditUserModal";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/user";

interface EditUserButtonProps {
  user: User;
  onSuccess?: () => void;
}

export default function EditUserButton({
  user,
  onSuccess,
}: EditUserButtonProps) {
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
  };

  const handleSuccess = () => {
    setShowEditModal(false);
    onSuccess?.();
  };

  return (
    <>
      <Button variant="secondary" size="sm" onClick={handleEditClick}>
        <Edit className="mr-2 size-4" />
        Edit
      </Button>

      <EditUserModal
        user={user}
        open={showEditModal}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
      />
    </>
  );
}
