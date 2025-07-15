import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { getAllDoctor, getAllUsers, getUsersByRole } from "@/lib/api/user.action"; // Import client functions
import type {User} from "@/types/user";
// Hook to get all doctors only
export const useDoctors = () => {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: getAllDoctor, // Use client function
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook to get all users
export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers, // Use client function
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook to get users by specific role
export const useUsersByRole = (role: string) => {
  return useQuery({
    queryKey: ["users", "role", role],
    queryFn: async () => {
      const users = await getAllUsers();
      return getUsersByRole(users, role);
    },
    enabled: !!role, // Only run if role is provided
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Hook to get multiple roles at once
export const useUsersWithRoles = (roles: string[]) => {
  return useQuery({
    queryKey: ["users", "roles", roles],
    queryFn: async () => {
      const users = await getAllUsers();
      const result: Record<string, User[]> = {};
      
      roles.forEach(role => {
        result[role] = getUsersByRole(users, role);
      });
      
      return result;
    },
    enabled: roles.length > 0,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Advanced hook with filtering and searching
export const useFilteredUsers = (filters?: {
  role?: string;
  searchTerm?: string;
}) => {
  return useQuery({
    queryKey: ["users", "filtered", filters],
    queryFn: async () => {
      let users = await getAllUsers();
      
      // Filter by role if provided
      if (filters?.role) {
        users = getUsersByRole(users, filters.role);
      }
      
      // Filter by search term if provided
      if (filters?.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        users = users.filter(user => 
          user.username.toLowerCase().includes(searchLower) ||
          user.id.toString().includes(searchLower)
        );
      }
      
      return users;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Specific hooks for common use cases
export const useAdmins = () => useUsersByRole("Admin");
export const usePatients = () => useUsersByRole("User"); // Hook for patients (assuming "User" role)

// Hook with refetch function for after mutations
export const useDoctorsWithRefetch = () => {
  const query = useDoctors();
  
  return {
    ...query,
    refetchDoctors: query.refetch,
  };
};