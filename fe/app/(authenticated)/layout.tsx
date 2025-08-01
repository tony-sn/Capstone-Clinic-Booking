import { headers } from "next/headers";
import { redirect } from "next/navigation";

import PatientLayout from "@/components/layout/PatientLayout";
import StaffLayout from "@/components/layout/StaffLayout";
import { getUserInfo } from "@/lib/api/patient.actions";
import { signInPath as siPath } from "@/paths";

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const headersObj = Object.fromEntries(headersList.entries());
  const { response, data: userInfo } = await getUserInfo({
    headers: headersObj,
  });

  const signInPath = siPath();

  if (response.status !== 200 || !userInfo) {
    redirect(signInPath);
  }

  const role = userInfo?.roles?.[0];

  // Patient layout for User role
  if (role === "User") {
    return <PatientLayout userInfo={userInfo}>{children}</PatientLayout>;
  }

  // Staff layout for Admin, Doctor, Staff roles
  if (["Staff", "Admin", "Doctor"].includes(role)) {
    return <StaffLayout userInfo={userInfo}>{children}</StaffLayout>;
  }

  // All other cases, or new role - go back to sign-in
  redirect(signInPath);
}
