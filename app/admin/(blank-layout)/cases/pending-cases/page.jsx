"use client";

import Table from "@/components/admin/dashboard/Table";
// import ProfileAvatar from "@/components/common/ImageViewer/ProfileAvatar";
import TableData from "@/components/common/Table/TableData";
import AgentSelectModal from "@/components/modal/AgentSelectModal";
import SearchInput from "@/components/search/SearchInput";
import { useGetCases } from "@/hook/case";
import { useDebounce } from "@/hook/debounce";
import { socket } from "@/lib/socket";
import { PlusCircleIcon } from "@/public/assets/icons/icons";
import { formatDateTime } from "@/utils/formatDateTime";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";

const PendingCaseBody = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState(null);

  const queryClient = useQueryClient();

  const limit = 15;

  const debouncedSearch = useDebounce(search, 500);
  const { cases, meta, isLoading } = useGetCases(
    page,
    "Pending",
    limit,
    debouncedSearch,
  );

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);

      // Join admin dashboard room
      socket.emit("join_admin_dashboard");

      // Join case room (optional but recommended)
      socket.emit("admin_room");
    });

    const handleUpdate = (data) => {
      console.log("Socket data", data);
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

    return () => {
      socket.off("new_emergency_alert", handleUpdate);
      socket.off("admin_notification", handleUpdate);
    };
  }, []);

  const columns = [
    {
      label: "Case ID",
      accessor: "case_id",
      render: (row) => (
        <Link href={`/admin/cases/pending-cases/${row.case_id}`}>
          <p className="text-accent">{row.case_id}</p>
        </Link>
      ),
    },
    {
      label: "User Name",
      accessor: "user.name",
      render: (row) => (
        <TableData
          path={`/admin/users/${row.user_id?.user_id}`}
          image={row.user_id?.image}
          id={row.user_id?.user_id}
          name={row.user_id?.first_name + " " + row.user_id?.last_name}
        />
      ),
    },
    {
      label: "Assign Agent",
      accessor: "assign_agent",
      render: (row) => (
        <span
          className="flex items-center gap-2 text-accent cursor-pointer"
          onClick={() => {
            setOpen(true);
            setSelectedCaseId(row.case_id);
          }}
        >
          {PlusCircleIcon} Assign
        </span>
      ),
    },
    {
      label: "Date and Time",
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
          placeholder="Search..."
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
          totalPages: meta?.total_pages,
          onPageChange: (p) => setPage(p),
        }}
        limit={limit}
        isLaoding={isLoading}
      />
      <AgentSelectModal
        isOpen={open}
        onClose={() => setOpen(false)}
        case_id={selectedCaseId}
      />
    </div>
  );
};

export default PendingCaseBody;
