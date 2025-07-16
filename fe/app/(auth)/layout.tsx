import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getUserInfo } from "@/lib/api/patient.actions";
import { patientsPath as ptPath } from "@/paths";

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
  const patientsPath = ptPath();
  console.log({ response, userInfo });

  const role = userInfo?.roles?.[0];

  if (role === "User") {
    redirect(`${patientsPath}/${userInfo?.id}/new-appointment`);
  }

  return <>{children}</>;
}
