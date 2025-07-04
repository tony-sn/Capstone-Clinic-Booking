import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const res = await getAuthOrRedirect();
  const session = res?.session;

  return (
    <>
      {!session ? <div>Loading</div> : <div>Navbar</div>}
      <main>{children}</main>
    </>
  );
}
