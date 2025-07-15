import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import { getUserInfo } from "@/lib/api/patient.actions";
import { patientsPath as ptPath, signInPath as siPath } from "@/paths";

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
  const role = userInfo?.roles?.[0];
  const signInPath = siPath();
  const patientsPath = ptPath();

  // TODO: keep for debugging, remove later

  console.log({ userInfo });

  if (response.status !== 200 || !userInfo) {
    redirect(signInPath);
  } else if (role === "User") {
    redirect(`${patientsPath}/${userInfo?.id}/new-appointment`);
  } else if (!["Staff", "Admin", "Doctor"].includes(role ?? "")) {
    redirect(signInPath);
  }

  return (
    <>
      <div className="mx-auto flex max-w-7xl flex-col space-y-14">
        <Navbar isAuthed userInfo={userInfo} />
        <main className="admin-main">{children}</main>
      </div>
    </>
  );
}
