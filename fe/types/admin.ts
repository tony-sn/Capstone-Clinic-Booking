export interface UserWithRoles {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface UsersWithRolesResponse {
  status: number;
  message: string;
  data: UserWithRoles[];
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface EditRolesRequest {
  username: string;
  roles: string[];
}
