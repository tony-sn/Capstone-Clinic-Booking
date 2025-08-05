"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu, X, Calendar, FileText, CreditCard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { postLogout } from "@/lib/api/patient.actions";
import { cn } from "@/lib/utils";
import { homePath as hPth } from "@/paths";
import { User } from "@/types/user";

interface PatientMobileMenuProps {
  isScrolled: boolean;
  userInfo: User;
}

const PatientMobileMenu = ({
  isScrolled,
  userInfo,
}: PatientMobileMenuProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const homePath = hPth();
  const userEmail = userInfo?.email;
  const fullname = `${userInfo?.firstName} ${userInfo?.lastName}`;

  const handleLinkClick = () => {
    setOpen(false);
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await postLogout();
    router.push(homePath);
    setOpen(false);
  };

  const patientNavItems = [
    {
      label: "My Appointments",
      href: `/patients/${userInfo.id}`,
      icon: Calendar,
    },
    {
      label: "Medical History",
      href: `/patients/${userInfo.id}/medical-history`,
      icon: FileText,
    },
    {
      label: "Transactions",
      href: `/patients/${userInfo.id}/transactions`,
      icon: CreditCard,
    },
  ];

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
        <SheetContent side="right" showClose={false} className="pr-0">
          <div className="flex h-full flex-col gap-4 px-4">
            <div className="flex items-center justify-between">
              <SheetHeader className="font-sans text-xl font-medium">
                Cyber Clinic
              </SheetHeader>
              <Button
                variant="ghost"
                size="sm"
                className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                onClick={() => setOpen(false)}
              >
                <X className="size-6" />
                <VisuallyHidden>
                  <SheetTitle className="sr-only">Close menu</SheetTitle>
                </VisuallyHidden>
              </Button>
            </div>

            <nav className="mt-6 flex-1">
              <div className="flex flex-col gap-2">
                {patientNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-md p-3 text-base font-medium transition-colors hover:bg-gray-100"
                    onClick={handleLinkClick}
                  >
                    <item.icon className="size-5" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>

            <div className="mt-auto border-t pt-4">
              <div className="flex flex-col gap-3">
                <span className="truncate text-base font-semibold text-gray-700">
                  {userEmail || fullname}
                </span>
                <Button
                  variant="outline"
                  className="w-full border-theme-500 font-medium text-theme-600 hover:bg-theme-600 hover:text-white"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default PatientMobileMenu;
