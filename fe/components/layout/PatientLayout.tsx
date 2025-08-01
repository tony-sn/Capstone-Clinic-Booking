"use client";

import { LogOut, Calendar, FileText, CreditCard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import PatientMobileMenu from "@/components/layout/PatientMobileMenu";
import { Button } from "@/components/ui/button";
import { postLogout } from "@/lib/api/patient.actions";
import { cn } from "@/lib/utils";
import { homePath as home } from "@/paths";
import { User } from "@/types/user";

const PatientLayout = ({
  userInfo,
  children,
}: {
  userInfo: User;
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const userEmail = userInfo?.email;
  const fullname = `${userInfo?.firstName} ${userInfo?.lastName}`;
  const homePath = home();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await postLogout();
    router.push(homePath);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const patientNavItems = [
    {
      label: "My Appointments",
      href: `/patients/${userInfo.id}`,
      icon: Calendar,
      desc: "View and manage your appointments",
    },
    {
      label: "Medical History",
      href: `/patients/${userInfo.id}/medical-history`,
      icon: FileText,
      desc: "View your medical records",
    },
    {
      label: "Transactions",
      href: `/patients/${userInfo.id}/transactions`,
      icon: CreditCard,
      desc: "View your payment history",
    },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm py-3"
            : "bg-transparent py-5"
        )}
      >
        <div className="container mx-auto flex items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/assets/icons/logo-full.svg"
              height={32}
              width={162}
              alt="logo"
              className="h-8 w-fit"
            />
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {patientNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-theme-600",
                  isScrolled ? "text-gray-700" : "text-white/90"
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center justify-between gap-4 md:flex">
            <span
              className={cn(
                "text-16-semibold font-medium truncate",
                isScrolled ? "text-gray-700" : "text-white/90"
              )}
            >
              {userEmail || fullname}
            </span>
            <Button
              variant={isScrolled ? "default" : "outline"}
              className={cn(
                "font-medium",
                !isScrolled &&
                  "text-theme border-theme-500 hover:bg-theme-600/20 hover:text-white"
              )}
              onClick={handleLogout}
            >
              <LogOut className="size-4" />
              Logout
            </Button>
          </div>

          <PatientMobileMenu isScrolled={isScrolled} userInfo={userInfo} />
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col space-y-14">
        <main className="pt-20 px-4">{children}</main>
      </div>
    </>
  );
};

export default PatientLayout;
