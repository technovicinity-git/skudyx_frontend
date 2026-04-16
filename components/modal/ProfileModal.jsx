import { LogOut } from "lucide-react";
import useOutsideClick from "@/hook/useOutsideClick";
import ProfileAvatar from "../common/ImageViewer/ProfileAvatar";

const ProfileModal = ({
  profile,
  isOpen,
  onClose,
  onLogout,
  anchorRef,
  isLoading,
}) => {
  useOutsideClick(anchorRef, onClose);

  if (!isOpen) return null;

  return (
    <div
      ref={anchorRef}
      className="
        absolute right-0 mt-3 w-64
        bg-white border border-gray-100 rounded-xl shadow-lg z-50
        animate-in fade-in zoom-in-95 duration-150
        max-md:fixed max-md:inset-x-4 max-md:top-16 max-md:w-auto
      "
    >
      {/* User Info */}
      <div className=" px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <ProfileAvatar src={profile.profile_photo} size={40} />

          <div>
            <p className="text-sm font-medium">
              {profile?.first_name} {profile?.last_name}
            </p>
            <p className="text-xs text-gray-500">{profile?.email}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-2">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm rounded-md text-gray-700
          hover:bg-[#406DA41A] transition text-left"
          disabled={isLoading}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;
