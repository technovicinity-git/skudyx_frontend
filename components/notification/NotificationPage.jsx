"use client";
import { useState } from "react";
import moment from "moment";
import clsx from "clsx";

import {
  Bell,
  Search,
  // CheckCheck,
  AlertTriangle,
  ShieldAlert,
  UserCheck,
  Radio,
} from "lucide-react";

import {
  useGetCaseActivities,
  useMarkActivityAsRead,
} from "@/hook/caseActivity";
import { LeftArrowIcon, RightArrowIcon } from "@/public/assets/icons/icons";
import { useQueryClient } from "@tanstack/react-query";

// ---------------------------------------------------
// NOTIFICATION PAGE
// ---------------------------------------------------

const NotificationPage = () => {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  const [selectedType, setSelectedType] = useState("");
  const queryClient = useQueryClient();

  const { activities, isLoading, meta } = useGetCaseActivities({
    page,
    limit: 10,
    search,
    type: selectedType,
  });

  const { markAsRead, isLoading: isMarkingAsRead } = useMarkActivityAsRead();

  const totalPages = meta?.total_pages || 1;

  // ---------------------------------------------------
  // PAGINATION
  // ---------------------------------------------------

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (page > 3) {
        pages.push("ellipsis-start");
      }

      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(totalPages - 1, page + 1);
        i++
      ) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push("ellipsis-end");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  // ---------------------------------------------------
  // ICONS
  // ---------------------------------------------------

  const getNotificationIcon = (type) => {
    switch (type) {
      case "CASE_CREATED":
        return (
          <div className="bg-red-100 text-red-600 p-3 rounded-2xl">
            <Radio size={18} />
          </div>
        );

      case "CASE_ASSIGNED":
        return (
          <div className="bg-blue-100 text-blue-600 p-3 rounded-2xl">
            <ShieldAlert size={18} />
          </div>
        );

      case "CASE_ACCEPTED":
        return (
          <div className="bg-green-100 text-green-600 p-3 rounded-2xl">
            <UserCheck size={18} />
          </div>
        );

      case "CASE_STATUS_UPDATED":
        return (
          <div className="bg-yellow-100 text-yellow-600 p-3 rounded-2xl">
            <AlertTriangle size={18} />
          </div>
        );

      default:
        return (
          <div className="bg-gray-100 text-gray-600 p-3 rounded-2xl">
            <Bell size={18} />
          </div>
        );
    }
  };

  // ---------------------------------------------------
  // MARK READ
  // ---------------------------------------------------

  const handleRead = (id) => {
    markAsRead(id, {
      onSuccess: () => {
        queryClient.invalidateQueries(["caseActivities"]);
      },
    });
  };

  // ---------------------------------------------------
  // UI
  // ---------------------------------------------------

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-6">
      {/* HEADER */}

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          {/* LEFT */}

          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>

            <p className="text-sm text-gray-500 mt-1">
              View all emergency case activities and updates
            </p>
          </div>

          {/* RIGHT */}

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* SEARCH */}

            <div
              className="
                flex items-center gap-2
                bg-[#F8FAFC]
                border border-gray-200
                rounded-2xl px-4 h-12
                w-full sm:w-[280px]
              "
            >
              <Search size={18} className="text-gray-400" />

              <input
                type="text"
                placeholder="Search notifications..."
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
                className="
                  bg-transparent flex-1 outline-none
                  text-sm text-gray-700
                  placeholder:text-gray-400
                "
              />
            </div>

            {/* FILTER */}

            <select
              value={selectedType}
              onChange={(e) => {
                setPage(1);
                setSelectedType(e.target.value);
              }}
              className="
                h-12 px-4 rounded-2xl
                border border-gray-200
                bg-white text-sm text-gray-700
                outline-none
              "
            >
              <option value="">All Types</option>

              <option value="CASE_CREATED">Case Created</option>

              <option value="CASE_ASSIGNED">Case Assigned</option>

              <option value="CASE_ACCEPTED">Case Accepted</option>

              <option value="CASE_STATUS_UPDATED">Status Updated</option>
            </select>
          </div>
        </div>
      </div>

      {/* CONTENT */}

      <div className="mt-6 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* TOP BAR */}

        <div
          className="
            px-5 py-4 border-b border-gray-100
            flex items-center justify-between
          "
        >
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Recent Activities
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {meta?.total_records || 0} notifications found
            </p>
          </div>

          {/* <button
            className="
              h-11 px-4 rounded-2xl
              bg-[#406DA4] text-white
              text-sm font-medium
              hover:opacity-90 transition
              flex items-center gap-2
            "
          >
            <CheckCheck size={16} />
            Mark all read
          </button> */}
        </div>

        {/* LIST */}

        {isLoading ? (
          <div className="p-6 space-y-5">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="animate-pulse flex gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gray-200" />

                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-40 mb-3" />

                  <div className="h-3 bg-gray-100 rounded w-72 mb-2" />

                  <div className="h-3 bg-gray-100 rounded w-52" />
                </div>
              </div>
            ))}
          </div>
        ) : activities?.length ? (
          <div className="divide-y divide-gray-100">
            {activities.map((item) => {
              const isUnread = !item?.is_read_by?.length;

              return (
                <div
                  key={item._id}
                  onClick={() => handleRead(item._id)}
                  className={clsx(
                    `
                      p-5 cursor-pointer transition-all
                      hover:bg-[#406DA4]/5
                    `,
                    isUnread && "bg-blue-50/40 border-l-4 border-[#406DA4]",
                  )}
                >
                  <div className="flex gap-4">
                    {/* ICON */}

                    {getNotificationIcon(item.type)}

                    {/* CONTENT */}

                    <div className="flex-1 min-w-0">
                      {/* TOP */}

                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4
                              className={clsx(
                                "text-sm",
                                isUnread
                                  ? "font-semibold text-gray-900"
                                  : "font-medium text-gray-700",
                              )}
                            >
                              {item.title}
                            </h4>

                            {isUnread && (
                              <span
                                className="
                                  h-2 w-2 rounded-full
                                  bg-[#406DA4]
                                "
                              />
                            )}
                          </div>

                          {/* <p className="text-xs text-[#406DA4] mt-1 font-medium">
                            {item.case_code}
                          </p> */}
                        </div>

                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {moment(item.createdAt).fromNow()}
                        </span>
                      </div>

                      {/* MESSAGE */}

                      <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                        {item.message}
                      </p>

                      {/* USER */}

                      <div className="mt-4 flex items-center gap-3">
                        {item.sender_id?.profile_photo ? (
                          <img
                            src={item.sender_id.profile_photo}
                            alt="profile"
                            className="
                              h-9 w-9 rounded-full
                              object-cover border border-gray-200
                            "
                          />
                        ) : (
                          <div
                            className="
                              h-9 w-9 rounded-full bg-gray-200
                            "
                          />
                        )}

                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {item.sender_id?.first_name}{" "}
                            {item.sender_id?.last_name}
                          </p>

                          {/* <p className="text-xs text-gray-500">
                            {item.type.replaceAll("_", " ")}
                          </p> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-24 text-center">
            <div
              className="
                h-20 w-20 rounded-full mx-auto
                bg-gray-100 flex items-center justify-center
              "
            >
              <Bell size={34} className="text-gray-400" />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-gray-800">
              No notifications found
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              There are no notifications matching your search.
            </p>
          </div>
        )}

        {/* PAGINATION */}

        {totalPages > 1 && (
          <div className="px-4 py-4 border-t border-gray-100">
            <div
              className="
                flex flex-col md:flex-row
                items-center justify-between gap-4
              "
            >
              <nav className="flex items-center gap-2" aria-label="Pagination">
                {/* PREV */}

                <button
                  className="
                    rounded-xl px-2 py-2
                    text-gray-700 hover:bg-gray-100
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                  "
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  {LeftArrowIcon}
                </button>

                {/* PAGES */}

                <div className="flex items-center gap-1">
                  {getPageNumbers().map((p, idx) =>
                    typeof p === "string" ? (
                      <span key={idx} className="px-2 text-gray-400">
                        ...
                      </span>
                    ) : (
                      <button
                        key={p}
                        className={clsx(
                          `
                            min-w-[40px] h-10 rounded-xl
                            text-sm font-medium transition
                          `,
                          p === page
                            ? "bg-[#406DA4] text-white"
                            : "text-gray-700 hover:bg-gray-100",
                        )}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    ),
                  )}
                </div>

                {/* NEXT */}

                <button
                  className="
                    rounded-xl px-2 py-2
                    text-gray-700 hover:bg-gray-100
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                  "
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  {RightArrowIcon}
                </button>
              </nav>

              {/* PAGE INFO */}

              <div className="text-sm text-gray-500">
                Page <span className="font-semibold text-gray-700">{page}</span>{" "}
                of{" "}
                <span className="font-semibold text-gray-700">
                  {totalPages}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
