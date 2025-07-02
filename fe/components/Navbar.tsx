"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import MobileMenu from "@/components/MobileMenu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

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
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="ml-10 h-10 w-fit"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {[
            "Home",
            "Benefits",
            "Process",
            "Testimonials",
            "Services",
            "FAQ",
          ].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className={cn(
                "text-sm font-medium transition-colors hover:text-theme-600",
                isScrolled ? "text-gray-700" : "text-white/90",
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
                "text-theme border-theme-500 hover:bg-theme-600/20 hover:text-white",
            )}
          >
            Book Consultation
          </Button>
        </div>

        <MobileMenu isScrolled={isScrolled} />
      </div>
    </header>
  );
};

export default Navbar;
