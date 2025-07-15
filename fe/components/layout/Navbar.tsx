"use client";

import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import MobileMenu from "@/components/layout/MobileMenu";
import { Button } from "@/components/ui/button";
import { privateNav, publicNav } from "@/constants";
import { postLogout } from "@/lib/api/patient.actions";
import { cn } from "@/lib/utils";
import {
  signInPath as signIn,
  homePath as home,
  adminPath as admin,
} from "@/paths";

const Navbar = ({
  isAuthed,
  userInfo,
}: {
  isAuthed?: boolean;
  // eslint-disable-next-line
  userInfo?: any;
}) => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  const fullname =
    userInfo?.firstName + " " + userInfo?.lastName || "Admin Dashboard";
  const getHref = (item: string) =>
    isAuthed ? `/${item?.trim()}` : `#${item.toLowerCase()}`;
  const signInPath = signIn();
  const homePath = home();
  const adminPath = admin();

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

  // authed navbar
  if (isAuthed) {
    return (
      <header
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm py-3"
            : "bg-transparent py-5",
          "admin-header"
        )}
      >
        <div className="container mx-auto flex items-center justify-between !px-0">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/assets/icons/logo-full.svg"
              height={32}
              width={162}
              alt="logo"
              className="h-8 w-fit"
            />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {privateNav.map((item) => (
              <Link
                key={item}
                href={getHref(item)}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-theme-600",
                  isScrolled ? "text-gray-700" : "text-white/90"
                )}
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center justify-between gap-4 md:flex">
            <Link href={adminPath} className="text-16-semibold truncate">
              {fullname}
            </Link>
            <Button
              variant={isScrolled ? "default" : "outline"}
              className={cn(
                "font-medium",
                !isScrolled &&
                  "text-theme border-theme-500 hover:bg-theme-600/20 hover:text-white"
              )}
            >
              <LogOut />
              <Link href="#" onClick={handleLogout}>
                Logout
              </Link>
            </Button>
          </div>
          <MobileMenu isScrolled={isScrolled} />
        </div>
      </header>
    );
  }

  // public navbar
  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href={homePath} className="flex items-center gap-2">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="ml-10 h-10 w-fit"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {publicNav.map((item) => (
            <Link
              key={item}
              href={getHref(item)}
              className={cn(
                "text-sm font-medium transition-colors hover:text-theme-600",
                isScrolled ? "text-gray-700" : "text-white/90"
              )}
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button
            variant={isScrolled ? "default" : "outline"}
            className={cn(
              "font-medium",
              !isScrolled &&
                "text-theme border-theme-500 hover:bg-theme-600/20 hover:text-white"
            )}
            asChild
          >
            <Link href={signInPath}>Login</Link>
          </Button>
        </div>

        <MobileMenu isScrolled={isScrolled} />
      </div>
    </header>
  );
};

export default Navbar;
