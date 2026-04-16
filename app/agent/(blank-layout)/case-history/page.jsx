"use client";

import Table from "@/components/admin/dashboard/Table";
import CaseStatus from "@/components/common/status/CaseStatus";
import SearchInput from "@/components/search/SearchInput";
import { useGetAGentCaseHistory } from "@/hook/case";
import { useDebounce } from "@/hook/debounce";
import { useGetMyProfile } from "@/hook/user";
import { useToast } from "@/lib/Provider/toastProvider";
import { socket } from "@/lib/socket";
import { formatDateTime } from "@/utils/formatDateTime";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

const BasicCaseBody = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 10;
  const debouncedSearch = useDebounce(search, 500);
  const { agentCases, isLoading, meta } = useGetAGentCaseHistory(
    page,
    limit,
    debouncedSearch,
  );
  const { showToast } = useToast();
  const router = useRouter();
  const { profile } = useGetMyProfile();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);

      // Join admin dashboard room
      socket.emit("join_admin_dashboard");

      // Join case room (optional but recommended)
      socket.emit("admin_room");
    });

    socket.on("assign_case", (data) => {
      console.log("Case assigned data", data);

      if (profile?._id === data?.agent_id) {
        showToast("A case has been assigned to you", "info", "Info");
        router.push("/agent/active-case");
      }
    });

    return () => {
      socket.off("join_admin_dashboard");
      socket.off("admin_room");
      socket.off("assign_case");
    };
  }, [profile]);

  const columns = [
    {
      label: "Case ID",
      accessor: "case_id",
      render: (row) => <p>{row.case_id}</p>,
    },
    {
      label: "Date & Time",
      accessor: "createdAt",
      render: (row) => <p>{formatDateTime(row.createdAt)}</p>,
    },
    {
      label: "Status",
      accessor: "status",
      render: (row) => <CaseStatus status={row.status} />,
    },
  ];

  return (
    <div className="py-6 px-4 md:px-8">
      {/* Header */}
      <div className=" items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Case History</h1>
      </div>

      {/* Search */}
      <div className="py-2 px-3 bg-white rounded-t-xl border-t border-l border-r border-gray-200 flex items-center">
        <SearchInput
          placeholder="Search by Case ID..."
          value={search}
          onChange={setSearch}
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={agentCases}
        showPagination={true}
        pagination={{
          page,
          totalPages: meta?.total_pages,
          onPageChange: (p) => setPage(p),
        }}
        limit={limit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default BasicCaseBody;
