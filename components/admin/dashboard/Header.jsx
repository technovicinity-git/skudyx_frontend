import Button from "@/components/common/Button";
import ProfileAvatar from "@/components/common/ImageViewer/ProfileAvatar";
import { useSidebar } from "@/components/common/SidebarContext";
import AvailabilityStatus from "@/components/modal/AvailabilityStatus";
import NotificationModal from "@/components/modal/NotificationModal";
import ProfileModal from "@/components/modal/ProfileModal";
import { useLogout } from "@/hook/auth";
import { useGetCaseActivities } from "@/hook/caseActivity";
import { useGetMyProfile } from "@/hook/user";
import { useToast } from "@/lib/Provider/toastProvider";
import { socket } from "@/lib/socket";
import { NotificationIcon } from "@/public/assets/icons/icons";
import { useQueryClient } from "@tanstack/react-query";
import { MenuIcon, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

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

  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { activities } = useGetCaseActivities({
    page: 1,
    limit: 20,
  });
  // Unread count for notifications
  const unreadCount = useMemo(() => {
    return activities?.filter((item) => !item?.is_read_by?.length)?.length || 0;
  }, [activities]);

  const playNotificationSound = () => {
    const audio = new Audio("/assets/sounds/notification.mp3");

    audio.volume = 0.7;

    audio.play().catch(() => {});
  };

  useEffect(() => {
    if (!profile?._id) return;

    socket.on("connect", () => {
      console.log("✅ Notification socket connected:", socket.id);

      // Join rooms
      socket.emit("join", {
        userId: profile?._id,
        role: profile?.role,
      });
    });

    // ----------------------------------------
    // NEW NOTIFICATION
    // ----------------------------------------

    const handleNewNotification = (notification) => {
      console.log("🔔 New notification:", notification);

      // PLAY SOUND
      playNotificationSound();

      // SHOW TOAST
      showToast(notification?.message, "info", notification?.title);

      // UPDATE CACHE
      queryClient.setQueryData(
        [
          "caseActivities",
          {
            page: 1,
            limit: 20,
          },
        ],
        (old) => {
          if (!old) return old;

          return {
            ...old,

            data: {
              ...old.data,

              meta: {
                ...old.data.meta,
                total_records: (old?.data?.meta?.total_records || 0) + 1,
              },

              data: [notification, ...(old?.data?.data || [])],
            },
          };
        },
      );
    };

    socket.on("new_notification", handleNewNotification);

    return () => {
      socket.off("connect");

      socket.off("new_notification", handleNewNotification);
    };
  }, [profile]);

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
            {/* UNREAD DOT */}

            {unreadCount > 0 && (
              <>
                <span
                  className="
                    absolute -top-1 -right-1
                    h-3 w-3 rounded-full
                    bg-red-500 border-2 border-white
                    animate-pulse
                  "
                />

                {/* COUNT */}

                <span
                  className="
                    absolute -top-2 -right-2
                    min-w-[18px] h-[18px]
                    px-1 rounded-full
                    bg-red-500 text-white
                    text-[10px] font-semibold
                    flex items-center justify-center
                  "
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              </>
            )}
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
