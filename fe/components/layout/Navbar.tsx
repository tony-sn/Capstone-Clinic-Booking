"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import MobileMenu from "@/components/layout/MobileMenu";
import { Button } from "@/components/ui/button";
import { publicNav, privateNav } from "@/constants";
import { cn } from "@/lib/utils";

const Navbar = ({ isAuthed }: { isAuthed?: boolean }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navList = isAuthed ? privateNav : publicNav;
  const getHref = (item: string) =>
    isAuthed ? `/${item?.trim()}` : `#${item.toLowerCase()}`;

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
      <div className="container mx-auto flex items-center justify-between">
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
          {navList.map((item) => (
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
          <p className="text-16-semibold">Admin Dashboard</p>
        </nav>

        {!isAuthed && (
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
              <Link href="/sign-in">Login</Link>
            </Button>
          </div>
        )}

        <MobileMenu isScrolled={isScrolled} />
      </div>
    </header>
  );
};

export default Navbar;
