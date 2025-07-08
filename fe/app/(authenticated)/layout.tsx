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

  console.log({ userInfo });
  if (response.status !== 200 || userInfo === undefined) {
    redirect("/sign-in");
  } else if (userInfo?.roles[0] === "User") {
    redirect(`/patients/${userInfo?.id}/register`);
  }

  return (
    <>
      <Navbar isAuthed />
      <main>{children}</main>
    </>
  );
}
