"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { postLogout } from "@/lib/api/patient.actions";
import { homePath } from "@/paths";

export const LogoutLink = () => {
  const router = useRouter();
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await postLogout();
    router.push(homePath());
  };

  return (
    <Link href={homePath()} onClick={handleLogout} className="text-green-500">
      Logout
    </Link>
  );
};
