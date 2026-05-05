"use client";

import Table from "@/components/admin/dashboard/Table";
import SearchInput from "@/components/search/SearchInput";
import { useAcceptCase, useGetCases } from "@/hook/case";
import { PlusCircleIcon } from "@/public/assets/icons/icons";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hook/debounce";
import { formatDateTime } from "@/utils/formatDateTime";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/Provider/toastProvider";
import { socket } from "@/lib/socket";
import { useQueryClient } from "@tanstack/react-query";
import { useGetMyProfile } from "@/hook/user";

const PendingCaseBody = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const limit = 15;
  const debouncedSearch = useDebounce(search, 500);
  const { cases, meta, isLoading } = useGetCases(
    page,
    "Pending",
    limit,
    debouncedSearch,
  );
  const { profile } = useGetMyProfile();

  const {
    acceptCase,
    isLoading: isAcceptingCase,
    errorMessage,
  } = useAcceptCase();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);

      // Join admin dashboard room
      socket.emit("join_admin_dashboard");

      // Join case room (optional but recommended)
      socket.emit("admin_room");
    });

    const handleUpdate = (data) => {
      console.log("Socket data pending cases:", data);
      queryClient.invalidateQueries({
        queryKey: ["cases"],
        exact: false,
      });
    };

    socket.on("new_emergency_alert", (data) => {
      handleUpdate(data);
    });

    socket.on("admin_notification", (data) => {
      handleUpdate(data);
    });

    socket.on("assign_case", (data) => {
      console.log("Case assigned data", data);
      console.log("Profile ID:", profile?._id);
      console.log("Data Agent ID:", data?.agent_id);

      if (profile?._id === data?.agent_id) {
        showToast("A case has been assigned to you", "info", "Info");
        router.push("/agent/active-case");
      }
    });

    return () => {
      socket.off("new_emergency_alert", handleUpdate);
      socket.off("admin_notification", handleUpdate);
      socket.off("join_admin_dashboard");
      socket.off("admin_room");
      socket.off("assign_case");
    };
  }, [profile, queryClient]);
  const handleAcceptCase = async (caseId) => {
    const data = { case_id: caseId };
    acceptCase(data, {
      onSuccess: () => {
        showToast("Case accepted successfully", "success", "Success");

        queryClient.invalidateQueries({
          queryKey: ["myProfile"],
        });
        router.push("/agent/active-case");
      },
      onError: () => {
        showToast(errorMessage || "Failed to accept case", "error", "Error");
      },
    });
  };

  const columns = [
    {
      label: "Case ID",
      accessor: "case_id",
      render: (row) => <p>{row.case_id}</p>,
    },

    {
      label: "Action",
      accessor: "assign_agent",
      render: (row) => (
        // <Link href={`/agent/active-case`}>
        <button
          className="flex items-center gap-2 text-accent cursor-pointer"
          onClick={() => handleAcceptCase(row.case_id)}
          disabled={isAcceptingCase}
        >
          {PlusCircleIcon} Accept
        </button>
        // </Link>
      ),
    },
    {
      label: "Date & Time",
      accessor: "createdAt",
      render: (row) => <p>{formatDateTime(row.createdAt)}</p>,
    },
  ];

  return (
    <div className="py-6 px-4 md:px-8">
      {/* Header */}
      <div className=" items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Pending Cases</h1>
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
        data={cases}
        showPagination={true}
        pagination={{
          page,
          onPageChange: (p) => setPage(p),
          totalPages: meta?.total_pages,
        }}
        isLoading={isLoading}
        limit={limit}
      />
    </div>
  );
};

export default PendingCaseBody;
