"use client";

import Table from "@/components/admin/dashboard/Table";
import SearchInput from "@/components/search/SearchInput";
import { useDebounce } from "@/hook/debounce";
import { useGetUsers } from "@/hook/user";
import { formatDateTime } from "@/utils/formatDateTime";
import { useState } from "react";

const UsersBody = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 15;
  const debouncedSearch = useDebounce(search, 500);

  const { users, isLoading, meta } = useGetUsers(page, limit, debouncedSearch);

  const columns = [
    {
      label: "User ID",
      accessor: "id",
      render: (row) => (
        <div className="flex gap-2">
          <div>{row.user_id}</div>
          <div className="flex gap-1">
            <div>{row.first_name}</div>
            {/* <div>{row?.middle_name}</div> */}
            <div>{row.last_name}</div>
          </div>
        </div>
      ),
    },
    {
      label: "Registration Date",
      accessor: "createdAt",
      render: (row) => <span>{formatDateTime(row.createdAt)}</span>,
    },
    {
      label: "Device ID",
      accessor: "currentDeviceId",
    },
    {
      label: "Subscription Plan",
      accessor: "subscriptionPlan",
      render: (row) => <span>{row.subscriptionPlan}</span>,
    },
    {
      label: "Status",
      accessor: "status",
      render: (row) => (
        <span
          className={`px-3 py-1 text-sm rounded-full ${
            row.account_status === "Active"
              ? "bg-green-200 text-green-700"
              : row.account_status === "Suspended"
                ? "bg-yellow-200 text-yellow-700"
                : row.account_status === "Pending"
                  ? "bg-gray-200 text-gray-700"
                  : "bg-red-200 text-red-700"
          }`}
        >
          {row.account_status}
        </span>
      ),
    },
    {
      label: "Action",
      accessor: "action",
      render: () => (
        <button
          className={`px-3 rounded-full hover:bg-gray-200 transition text-lg`}
        >
          ⋮
        </button>
      ),
    },
  ];

  return (
    <div className="py-6 px-4 md:px-8">
      {/* Header */}
      <div className=" items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Users</h1>
      </div>

      {/* Search */}
      <div className="py-2 px-3 bg-white rounded-t-xl border-t border-l border-r border-gray-200 flex items-center">
        <SearchInput
          placeholder="Search..."
          value={search}
          onChange={setSearch}
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={users}
        showPagination={true}
        pagination={{
          page,
          totalPages: meta.total_pages,
          onPageChange: (p) => setPage(p),
        }}
        limit={limit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default UsersBody;
