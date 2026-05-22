import {
  Bell,
  AlertTriangle,
  ShieldAlert,
  UserCheck,
  Radio,
} from "lucide-react";

import {
  useGetCaseActivities,
  useMarkActivityAsRead,
} from "@/hook/caseActivity";

import useOutsideClick from "@/hook/useOutsideClick";
import moment from "moment";
import clsx from "clsx";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NotificationModal = ({ isOpen, onClose, anchorRef }) => {
  useOutsideClick(anchorRef, onClose);

  const queryClient = useQueryClient();
  const pathname = usePathname();
  const basePath = pathname.split("/")[1];

  const { activities, isLoading, meta } = useGetCaseActivities({
    page: 1,
    limit: 20,
  });

  const { markAsRead, isLoading: isMarkingAsRead } = useMarkActivityAsRead();

  if (!isOpen) return null;

  // ----------------------------------------
  // Helpers
  // ----------------------------------------

  const getNotificationIcon = (type) => {
    switch (type) {
      case "CASE_CREATED":
        return (
          <div className="bg-red-100 text-red-600 p-2 rounded-full">
            <Radio size={16} />
          </div>
        );

      case "CASE_ASSIGNED":
        return (
          <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
            <ShieldAlert size={16} />
          </div>
        );

      case "CASE_ACCEPTED":
        return (
          <div className="bg-green-100 text-green-600 p-2 rounded-full">
            <UserCheck size={16} />
          </div>
        );

      case "CASE_STATUS_UPDATED":
        return (
          <div className="bg-yellow-100 text-yellow-600 p-2 rounded-full">
            <AlertTriangle size={16} />
          </div>
        );

      default:
        return (
          <div className="bg-gray-100 text-gray-600 p-2 rounded-full">
            <Bell size={16} />
          </div>
        );
    }
  };

  const isUnread = (item) => {
    return !item?.is_read_by?.length;
  };

  const handleRead = (id) => {
    markAsRead(id, {
      onSuccess: () => {
        queryClient.invalidateQueries(["caseActivities"]);
      },
    });
  };

  // ----------------------------------------
  // UI
  // ----------------------------------------

  return (
    <div
      className="
        absolute right-0 mt-3 w-[390px]
        bg-white rounded-2xl shadow-2xl border border-gray-100
        overflow-hidden z-50

        max-md:fixed
        max-md:top-16
        max-md:left-4
        max-md:right-4
        max-md:w-auto
      "
    >
      {/* HEADER */}

      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Notifications
          </h3>

          <p className="text-xs text-gray-500 mt-0.5">
            {meta?.total_records || 0} total notifications
          </p>
        </div>

        <div
          className="
            h-9 w-9 rounded-full flex items-center justify-center
            bg-[#406DA4]/10 text-[#406DA4]
          "
        >
          <Bell size={18} />
        </div>
      </div>

      {/* BODY */}

      <div className="max-h-[500px] overflow-y-auto">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="animate-pulse flex gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200" />

                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-40 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-56" />
                </div>
              </div>
            ))}
          </div>
        ) : activities?.length ? (
          <div className="divide-y divide-gray-100">
            {activities.map((item) => (
              <div
                key={item._id}
                onClick={() => handleRead(item._id)}
                className={clsx(
                  `
                    group px-5 py-4 transition-all cursor-pointer
                    hover:bg-[#406DA4]/5
                  `,
                  isUnread(item) && "bg-blue-50/40 border-l-4 border-[#406DA4]",
                )}
              >
                <div className="flex gap-3">
                  {/* ICON */}

                  {getNotificationIcon(item.type)}

                  {/* CONTENT */}

                  <div className="flex-1 min-w-0">
                    {/* TOP */}

                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4
                          className={clsx(
                            "text-sm",
                            isUnread(item)
                              ? "font-semibold text-gray-900"
                              : "font-medium text-gray-700",
                          )}
                        >
                          {item.title}
                        </h4>

                        <p className="text-xs text-gray-500 mt-1">
                          {item.case_code}
                        </p>
                      </div>

                      {isUnread(item) && (
                        <div className="h-2 w-2 rounded-full bg-[#406DA4] mt-2 shrink-0" />
                      )}
                    </div>

                    {/* MESSAGE */}

                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                      {item.message}
                    </p>

                    {/* FOOTER */}

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        {item.sender_id?.profile_photo ? (
                          <img
                            src={item.sender_id.profile_photo}
                            alt="profile"
                            className="
                              h-6 w-6 rounded-full object-cover
                              border border-gray-200
                            "
                          />
                        ) : (
                          <div
                            className="
                              h-6 w-6 rounded-full bg-gray-200
                            "
                          />
                        )}

                        <span className="text-xs text-gray-500">
                          {item.sender_id?.first_name}{" "}
                          {item.sender_id?.last_name}
                        </span>
                      </div>

                      <span className="text-xs text-gray-400">
                        {moment(item.createdAt).fromNow()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-14 px-6 text-center">
            <div
              className="
                h-16 w-16 rounded-full mx-auto
                bg-gray-100 flex items-center justify-center
              "
            >
              <Bell className="text-gray-400" size={28} />
            </div>

            <h4 className="mt-4 text-sm font-semibold text-gray-700">
              No notifications yet
            </h4>

            <p className="text-xs text-gray-500 mt-1">
              You’ll see all emergency case activities here.
            </p>
          </div>
        )}
      </div>

      {/* FOOTER */}

      {!!activities?.length && (
        <div className="border-t border-gray-100 p-3 bg-gray-50">
          <Link href={`/${basePath}/notifications`}>
            <button
              className="
              w-full h-11 rounded-xl
              bg-[#406DA4] text-white text-sm font-medium
              hover:opacity-90 transition
              flex items-center justify-center gap-2
            "
            >
              View All Notifications
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationModal;
