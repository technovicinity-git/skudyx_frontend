import Button from "@/components/common/Button";
import ProfileAvatar from "@/components/common/ImageViewer/ProfileAvatar";
import { useSidebar } from "@/components/common/SidebarContext";
import AvailabilityStatus from "@/components/modal/AvailabilityStatus";
import NotificationModal from "@/components/modal/NotificationModal";
import ProfileModal from "@/components/modal/ProfileModal";
import { useLogout } from "@/hook/auth";
import { useGetMyProfile } from "@/hook/user";
import { NotificationIcon } from "@/public/assets/icons/icons";
import { MenuIcon, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const Header = () => {
  const { logout, isLoading } = useLogout();
  const router = useRouter();

  const { profile } = useGetMyProfile();
  const { toggleSidebar, isSidebarOpen } = useSidebar();

  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const pathname = usePathname();
  const basePath = pathname.split("/")[1];

  const handleLogout = () => {
    logout();
    // Cookies.remove("accessToken");
    // Cookies.remove("refreshToken");
    // Cookies.remove("accessLevel");
    router.push(`/${basePath}/login`);
  };

  useEffect(() => {
    if (profile?.role !== basePath) {
      const timer = setTimeout(() => {
        router.push(`/${basePath}/login`);
      }, 2000); // 2 second delay

      return () => clearTimeout(timer); // cleanup
    }
  }, [profile, basePath]);

  return (
    <header className="w-full min-h-[64px] flex items-center justify-between bg-white px-4 md:px-8 py-2 border-b border-[#EAECF0] sticky top-0 z-50">
      {/* Left Side: Logo */}
      <div className="flex items-center gap-3 lg:hidden ">
        <Button
          variant="outline"
          className="!p-1 hover:bg-primary-1 hover:text-white"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <X size={24} /> : <MenuIcon />}
        </Button>
        <Link href="/admin/dashboard" className="w-[142px] inline-block">
          <Image
            src="/assets/images/logo-small.png"
            alt="Logo"
            fill
            className="object-contain !relative"
          />
        </Link>
      </div>
      {/* Right Side: Notification + User */}
      <div className="flex items-center gap-6 ml-auto">
        {/* Availibility Status */}
        {profile?.role === "agent" && (
          <div className="flex items-center gap-2">
            <AvailabilityStatus
              account_status={profile?.account_status}
              availability_status={profile?.availability_status}
            />
          </div>
        )}
        {/* Notification Icon */}
        <div ref={notificationRef} className="relative">
          <button
            className="relative p-0 text-[#141B34] transition hover:text-primary-1 cursor-pointer"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
          >
            {NotificationIcon}
          </button>
          <NotificationModal
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
            anchorRef={notificationRef}
            notifications={[]}
          />
        </div>

        {/* User Avatar and Name */}
        <div className="relative">
          <div
            ref={profileRef}
            className="flex items-center gap-3 cursor-pointer relative"
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
          >
            {/* <div className="w-10 h-10 rounded-full bg-gray-200" /> */}
            <ProfileAvatar src={profile?.profile_photo} size={40} />
            <span className="text-sm font-medium">{profile?.first_name}</span>
          </div>
          <ProfileModal
            profile={profile}
            isOpen={showProfile}
            onClose={() => setShowProfile(false)}
            onLogout={handleLogout}
            anchorRef={profileRef}
            isLoading={isLoading}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
