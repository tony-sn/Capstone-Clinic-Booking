import { redirect } from "next/navigation";

import { getUserInfoWithHeaders } from "@/lib/server-utils";
import { patientsPath as ptPath } from "@/paths";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { response, data: userInfo } = await getUserInfoWithHeaders();
  const patientsPath = ptPath();
  console.log({ response, userInfo });

  const role = userInfo?.roles?.[0];

  if (role === "User") {
    redirect(`${patientsPath}/${userInfo?.id}`);
  }

  return <>{children}</>;
}
