"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getUserInfo } from "@/lib/api/patient.actions";
import { signInPath } from "@/paths";

export type UserRole = "User" | "Admin" | "Doctor" | "Staff";

export async function requireAuth() {
  const headersList = await headers();
  const headersObj = Object.fromEntries(headersList.entries());
  const { response, data: userInfo } = await getUserInfo({
    headers: headersObj,
  });

  if (response.status !== 200 || !userInfo) {
    redirect(signInPath());
  }

  return userInfo;
}

export async function requireStaffRole() {
  const userInfo = await requireAuth();
  const role = userInfo?.roles?.[0] as UserRole;

  // Only allow Admin, Doctor, Staff roles
  if (!["Admin", "Doctor", "Staff"].includes(role)) {
    // Redirect patients to their dashboard
    redirect(`/patients/${userInfo.id}`);
  }

  return { userInfo, role };
}

export async function requirePatientRole() {
  const userInfo = await requireAuth();
  const role = userInfo?.roles?.[0] as UserRole;

  // Only allow User role
  if (role !== "User") {
    // Redirect staff to admin dashboard
    redirect("/admin");
  }

  return { userInfo, role };
}

export async function requireSpecificPatient(userId: string) {
  const { userInfo, role } = await requirePatientRole();

  // Ensure the user can only access their own data
  if (userInfo.id.toString() !== userId) {
    redirect(signInPath());
  }

  return { userInfo, role };
}
