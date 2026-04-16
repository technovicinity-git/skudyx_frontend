import useOutsideClick from "@/hook/useOutsideClick";

const NotificationModal = ({
  isOpen,
  onClose,
  notifications = [],
  anchorRef,
}) => {
  useOutsideClick(anchorRef, onClose);

  if (!isOpen) return null;

  return (
    <div
      className="
        absolute right-0 mt-3 w-80
        bg-white border border-gray-100 rounded-xl shadow-lg z-50
        animate-in fade-in zoom-in-95 duration-150
        max-md:fixed max-md:inset-x-4 max-md:top-16 max-md:w-auto
      "
    >
      <div className="px-4 py-3 border-b border-gray-100 font-medium">
        Notifications
      </div>

      <div className="max-h-80 overflow-y-auto">
        {notifications.length ? (
          notifications.map((item, index) => (
            <div
              key={index}
              className="px-4 py-3 text-sm hover:bg-[#406DA41A]
              transition cursor-pointer"
            >
              {item.title}
            </div>
          ))
        ) : (
          <div className="px-4 py-10 text-sm text-gray-400 text-center">
            No notifications
          </div>
        )}
      </div>

      <div
        className="px-4 py-2 text-sm text-center border-t border-gray-100
        hover:bg-[#406DA41A] cursor-pointer"
      >
        View all
      </div>
    </div>
  );
};

export default NotificationModal;
