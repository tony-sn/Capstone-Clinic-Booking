"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isScrolled: boolean;
}

const MobileMenu = ({ isScrolled }: MobileMenuProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0",
              isScrolled ? "text-gray-900" : "text-white"
            )}
          >
            <Menu className="size-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="pr-0">
          <div className="flex flex-col gap-4 px-4">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xl font-medium">
                Cyber Clinic
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                onClick={() => setOpen(false)}
              >
                <X className="size-6" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            <nav className="mt-4 flex flex-col gap-4">
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
                  className="text-base font-medium transition-colors hover:text-theme-600"
                  onClick={() => setOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </nav>
            <Button className="mt-4 w-full text-theme-600" asChild>
              <Link href="/sign-in">Login</Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileMenu;
