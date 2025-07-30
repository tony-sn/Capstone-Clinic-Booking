import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
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
  // const patientsPath = ptPath();

  if (response.status !== 200 || !userInfo) {
    redirect(signInPath);
  }
  // const role = userInfo?.roles?.[0];

  // TODO: keep for debugging, remove later

  console.log({ userInfo });

  // if user login, go to new appointment
  // if (role === "User") {
  //   redirect(`${patientsPath}/${userInfo?.id}`);
  // }

  // if staff login, go to admin layout
  // if (["Staff", "Admin", "Doctor"].includes(role)) {
  return (
    <>
      <div className="mx-auto flex max-w-7xl flex-col space-y-14">
        <Navbar isAuthed userInfo={userInfo} />
        <main className="admin-main">{children}</main>
      </div>
    </>
  );
  // }

  // all other cases, or new role - go back to sign-in
  // redirect(signInPath);
}
