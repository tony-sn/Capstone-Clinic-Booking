import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import MobileMenu from "@/components/layout/MobileMenu";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { postLogout } from "@/lib/api/patient.actions";
import { cn } from "@/lib/utils";
import {
  homePath as home,
  signInPath as signIn,
  adminPath as admin,
} from "@/paths";

interface NavigationItem {
  parent: string;
  children: Array<{
    label: string;
    href: string;
    desc: string;
  }>;
}

interface BaseHeaderProps {
  isAuthed?: boolean;
  navigationItems?: NavigationItem[];
  publicNavItems?: string[];
  showAuthButton?: boolean;
  displayName?: string;
  className?: string;
}

const BaseHeader = ({
  isAuthed = false,
  navigationItems = [],
  publicNavItems = [],
  showAuthButton = true,
  displayName,
  className = "",
}: BaseHeaderProps) => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  const homePath = home();
  const signInPath = signIn();
  const adminPath = admin();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await postLogout();
    router.push(homePath);
  };

  const getHref = (item: string) =>
    isAuthed ? `/${item?.trim()}` : `#${item.toLowerCase()}`;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
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
        isAuthed && "admin-header",
        className
      )}
    >
      <div
        className={cn(
          "relative mx-auto flex flex-1 items-center justify-between",
          isAuthed ? "!px-0" : "container px-4"
        )}
      >
        {/* Logo */}
        <Link
          href={isAuthed ? "/" : homePath}
          className="flex items-center gap-2"
        >
          <Image
            src="/assets/icons/logo-full.svg"
            height={isAuthed ? 32 : 1000}
            width={isAuthed ? 162 : 1000}
            alt="logo"
            className={cn("h-8 w-fit", !isAuthed && "ml-10 h-10")}
          />
        </Link>

        {/* Navigation Menu - Authenticated */}
        {isAuthed && navigationItems.length > 0 && (
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
        )}

        {/* Navigation Menu - Public */}
        {!isAuthed && publicNavItems.length > 0 && (
          <nav className="hidden items-center gap-8 md:flex">
            {publicNavItems.map((item) => (
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
        )}

        {/* Auth Actions */}
        <div className="hidden items-center justify-between gap-4 md:flex">
          {isAuthed && displayName && (
            <Link
              href={adminPath}
              className={cn(
                "text-16-semibold truncate font-medium transition-colors hover:text-theme-600",
                isScrolled ? "text-gray-700" : "text-white/90"
              )}
            >
              {displayName}
            </Link>
          )}

          {showAuthButton && (
            <Button
              variant={isScrolled ? "default" : "outline"}
              className={cn(
                "font-medium",
                !isScrolled &&
                  "text-theme border-theme-500 hover:bg-theme-600/20 hover:text-white"
              )}
              {...(isAuthed ? { onClick: handleLogout } : { asChild: true })}
            >
              {isAuthed ? (
                <>
                  <LogOut />
                  Logout
                </>
              ) : (
                <Link href={signInPath}>Login</Link>
              )}
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <MobileMenu
          isScrolled={isScrolled}
          isAuthed={isAuthed}
          fullname={displayName}
        />
      </div>
    </header>
  );
};

export { BaseHeader };
