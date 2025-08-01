"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getUserInfo } from "@/lib/api/patient.actions";

type UserRole = "User" | "Admin" | "Doctor" | "Staff";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallbackPath?: string;
}

export default function RoleGuard({
  allowedRoles,
  children,
  fallbackPath,
}: RoleGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const { response, data: userInfo } = await getUserInfo({});

        if (response.status !== 200 || !userInfo) {
          router.push("/sign-in");
          return;
        }

        const role = userInfo.roles?.[0] as UserRole;
        setUserRole(role);

        if (allowedRoles.includes(role)) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          // Redirect based on role
          if (role === "User") {
            router.push(fallbackPath || `/patients/${userInfo.id}`);
          } else {
            router.push(fallbackPath || "/admin");
          }
        }
      } catch (error) {
        console.error("Role check failed:", error);
        router.push("/sign-in");
      }
    };

    checkRole();
  }, [allowedRoles, router, fallbackPath]);

  // Show loading state while checking
  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render children if not authorized (redirect is in progress)
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
