"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navigationItems } from "@/constants";
import { postLogout } from "@/lib/api/patient.actions";
import { cn } from "@/lib/utils";
import { adminPath as amPath, homePath as hPth } from "@/paths";

interface MobileMenuProps {
  isScrolled: boolean;
  isAuthed?: boolean;
  fullname?: string;
}

const MobileMenu = ({
  isScrolled,
  isAuthed = false,
  fullname,
}: MobileMenuProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const adminPath = amPath();
  const homePath = hPth();

  const handleLinkClick = () => {
    setOpen(false);
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await postLogout();
    router.push(homePath);
  };
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
          <div className="flex flex-col gap-4 px-4">
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
            {isAuthed ? (
              <>
                {/* Navigation Menu */}
                <div className="flex-1">
                  <NavigationMenu
                    orientation="vertical"
                    className="w-full max-w-none"
                  >
                    <NavigationMenuList className="w-full flex-col items-start space-x-0 space-y-2">
                      {navigationItems.map((item, index) => (
                        <NavigationMenuItem
                          key={`${item.parent}-${index}`}
                          className="w-full"
                        >
                          <NavigationMenuTrigger
                            // className="w-full justify-between bg-transparent px-0 py-3 text-left text-base font-medium hover:bg-gray-100 data-[state=open]:bg-gray-100"
                            className="w-full border-theme-500 font-medium text-theme-600 hover:bg-theme-600 hover:text-white data-[state=open]:bg-gray-100"
                          >
                            {item.parent}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent className="w-full">
                            <div className="w-full p-0">
                              <div className="flex flex-col space-y-0">
                                {item.children.map(({ label, href }) => (
                                  <NavigationMenuLink key={label} asChild>
                                    <Link
                                      href={href}
                                      className="block w-full border-l-2 border-transparent px-4 py-3 text-left text-sm font-medium transition-colors hover:border-theme-600 hover:bg-gray-50"
                                      onClick={handleLinkClick}
                                    >
                                      {label}
                                    </Link>
                                  </NavigationMenuLink>
                                ))}
                              </div>
                            </div>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      ))}
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>
                <div className="mt-auto border-t pt-4">
                  <div className="flex flex-col gap-3">
                    <Link
                      href={adminPath}
                      className="truncate text-base font-semibold text-gray-700"
                      onClick={handleLinkClick}
                    >
                      {fullname}
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full border-theme-500 font-medium text-theme-600 hover:bg-theme-600 hover:text-white"
                      onClick={(e) => {
                        handleLogout(e);
                        setOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileMenu;
