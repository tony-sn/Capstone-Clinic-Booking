"use client";

import { BaseHeader } from "@/components/layout/BaseHeader";
import { navigationItems as navItems, publicNav, userItems } from "@/constants";
import { User } from "@/types/user";

interface NavbarProps {
  isAuthed?: boolean;
  userInfo?: User;
}
const Navbar = ({ isAuthed = false, userInfo }: NavbarProps) => {
  const isUser = userInfo?.roles.includes("User");
  const userEmail = userInfo?.email;
  const navigationItems = isUser ? userItems : navItems;
  const fullname =
    userInfo?.firstName + " " + userInfo?.lastName || "Admin Dashboard";
  const displayName = isUser ? userEmail : fullname;

  // authed navbar
  if (isAuthed) {
    return (
      <BaseHeader
        isAuthed
        showAuthButton
        navigationItems={navigationItems}
        displayName={displayName}
      />
    );
  }

  // public navbar
  return (
    <BaseHeader isAuthed={false} showAuthButton publicNavItems={publicNav} />
  );
};

export default Navbar;
