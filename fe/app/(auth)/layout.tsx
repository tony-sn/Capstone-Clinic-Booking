import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getUserInfo } from "@/lib/api/patient.actions";
import {
  patientsPath as ptPath,
  signInPath as siPath,
  adminPath as amPath,
} from "@/paths";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const headersObj = Object.fromEntries(headersList.entries());
  const { response, data: userInfo } = await getUserInfo({
    headers: headersObj,
  });
  const role = userInfo?.roles?.[0];
  const signInPath = siPath();
  const patientsPath = ptPath();
  const adminPath = amPath();
  console.log({ response, userInfo });

  if (response.status === 200) {
    if (role === "User") {
      redirect(`${patientsPath}/${userInfo?.id}/new-appointment`);
    } else if (["Staff", "Admin", "Doctor"].includes(role)) {
      redirect(adminPath);
    } else {
      redirect(signInPath);
    }
  }

  return <>{children}</>;
}
