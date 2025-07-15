import { headers } from "next/headers";
// import Image from "next/image";
// import Link from "next/link";
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
      {/* <Navbar isAuthed /> */}
      {/* <main>{children}</main> */}
      <div className="mx-auto flex max-w-7xl flex-col space-y-14">
        {/* <header className="admin-header"> */}
        {/*   <Link href="/" className="cursor-pointer"> */}
        {/*     <Image */}
        {/*       src="/assets/icons/logo-full.svg" */}
        {/*       height={32} */}
        {/*       width={162} */}
        {/*       alt="logo" */}
        {/*       className="h-8 w-fit" */}
        {/*     /> */}
        {/*   </Link> */}
        {/**/}
        {/*   <p className="text-16-semibold">Admin Dashboard</p> */}
        {/* </header> */}
        <Navbar isAuthed />
        <main className="admin-main">{children}</main>
      </div>
    </>
  );
}
