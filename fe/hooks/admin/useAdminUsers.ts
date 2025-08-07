import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createUser, editUserRoles } from "@/lib/api/admin.actions";
import { CreateUserRequest } from "@/types/admin";

export const useAdminActions = () => {
  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: (userData: CreateUserRequest) => createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const editRolesMutation = useMutation({
    mutationFn: ({ username, roles }: { username: string; roles: string[] }) =>
      editUserRoles(username, roles),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    createUser: createUserMutation,
    editRoles: editRolesMutation,
  };
};
