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
      <div className="mx-3 min-h-screen w-full rounded-2xl bg-gradient-to-br from-blue-50 to-white">
        <main className="admin-main py-6">{children}</main>
      </div>
    </div>
  );
};

export default StaffLayout;
