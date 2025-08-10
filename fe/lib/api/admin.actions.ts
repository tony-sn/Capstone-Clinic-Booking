"use server";

import { revalidatePath } from "next/cache";

import {
  CreateUserRequest,
  EditRolesRequest,
  EditUserRequest,
} from "@/types/admin";

const ADMIN_ENDPOINT = `${process.env.NEXT_PUBLIC_ENDPOINT}/api/Admin`;

export const getUsersWithRoles = async () => {
  try {
    const res = await fetch(`${ADMIN_ENDPOINT}/users-with-roles`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch users with roles");
    }

    return res.json();
  } catch (error) {
    console.error(
      "An error occurred while retrieving users with roles:",
      error
    );
    throw error;
  }
};

export const createUser = async (userData: CreateUserRequest) => {
  try {
    const res = await fetch(`${ADMIN_ENDPOINT}/create-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const errorData = await res.text();
      throw new Error(`Failed to create user: ${errorData}`);
    }

    revalidatePath("/admin");
    return res.json();
  } catch (error) {
    console.error("An error occurred while creating user:", error);
    throw error;
  }
};

export const editUserRoles = async (
  username: EditRolesRequest["username"],
  roles: EditRolesRequest["roles"]
) => {
  try {
    const res = await fetch(`${ADMIN_ENDPOINT}/edit-roles/${username}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, roles }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      throw new Error(`Failed to edit user roles: ${errorData}`);
    }

    revalidatePath("/admin");
    return res.json();
  } catch (error) {
    console.error("An error occurred while editing user roles:", error);
    throw error;
  }
};

export const updateUser = async (userData: EditUserRequest) => {
  try {
    const res = await fetch(`${ADMIN_ENDPOINT}/update-user/${userData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userData.id,
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        roles: userData.roles,
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      throw new Error(`Failed to update user: ${errorData}`);
    }

    revalidatePath("/admin");
    revalidatePath("/patients");
    return res.json();
  } catch (error) {
    console.error("An error occurred while updating user:", error);
    throw error;
  }
};
