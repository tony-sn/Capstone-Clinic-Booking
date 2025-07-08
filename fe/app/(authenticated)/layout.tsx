import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import { getUserInfo } from "@/lib/api/patient.actions";

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

  console.log({ userInfo });
  if (response.status !== 200 || !userInfo) {
    redirect("/sign-in");
  } else if (role === "User") {
    redirect(`/patients/${userInfo?.id}/new-appointment`);
  } else if (!["Staff", "Admin", "Doctor"].includes(role ?? "")) {
    redirect("/sign-in");
  }

  return (
    <>
      <Navbar isAuthed />
      <main>{children}</main>
    </>
  );
}
