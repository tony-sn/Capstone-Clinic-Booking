"use client";

import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import MobileMenu from "@/components/layout/MobileMenu";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { publicNav, navigationItems as navItems, userItems } from "@/constants";
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
  const isUser = userInfo?.roles.includes("User");
  const userEmail = userInfo?.email;
  const navigationItems = isUser ? userItems : navItems;

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
        <div className="relative mx-auto flex flex-1 items-center justify-between !px-0">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/assets/icons/logo-full.svg"
              height={32}
              width={162}
              alt="logo"
              className="h-8 w-fit"
            />
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="flex items-center gap-2">
              {navigationItems.map((item, index) => (
                <NavigationMenuItem key={`${item.parent}-${index}`}>
                  <NavigationMenuTrigger
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-theme-600",
                      isScrolled ? "text-gray-700" : "text-white/90"
                    )}
                  >
                    {item.parent}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[300px] p-4">
                      <div className="grid gap-3">
                        {item.children.map(({ label, href, desc }) => (
                          <NavigationMenuLink key={label} asChild>
                            <Link
                              href={href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">
                                {label}
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {desc}
                              </p>
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

          <div className="hidden items-center justify-between gap-4 md:flex">
            <Link
              href={adminPath}
              className={cn(
                "text-16-semibold truncate font-medium transition-colors hover:text-theme-600",
                isScrolled ? "text-gray-700" : "text-white/90"
              )}
            >
              {isUser ? userEmail : fullname}
            </Link>
            <Button
              variant={isScrolled ? "default" : "outline"}
              className={cn(
                "font-medium",
                !isScrolled &&
                  "text-theme border-theme-500 hover:bg-theme-600/20 hover:text-white"
              )}
              onClick={handleLogout}
            >
              <LogOut />
              Logout
            </Button>
          </div>
          <MobileMenu isScrolled={isScrolled} isAuthed fullname={fullname} />
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
