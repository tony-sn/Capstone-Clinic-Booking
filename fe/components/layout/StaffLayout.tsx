import Navbar from "@/components/layout/Navbar";
import { User } from "@/types/user";

interface StaffLayoutProps {
  userInfo: User;
  children: React.ReactNode;
}

const StaffLayout = ({ userInfo, children }: StaffLayoutProps) => {
  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <Navbar isAuthed userInfo={userInfo} />
      <main className="admin-main">{children}</main>
    </div>
  );
};

export default StaffLayout;
