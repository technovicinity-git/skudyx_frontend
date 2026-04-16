"use client";

import Table from "@/components/admin/dashboard/Table";
import ProfileAvatar from "@/components/common/ImageViewer/ProfileAvatar";
import SearchInput from "@/components/search/SearchInput";
import { useGetCases } from "@/hook/case";
import { useDebounce } from "@/hook/debounce";
import { formatDateTime } from "@/utils/formatDateTime";
import Link from "next/link";
import { useState } from "react";

const ResolvedCaseBody = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 15;

  const debouncedSearch = useDebounce(search, 500);
  const { cases, meta, isLoading } = useGetCases(
    page,
    "Resolved",
    limit,
    debouncedSearch,
  );

  const columns = [
    {
      label: "Case ID",
      accessor: "case_id",
      render: (row) => (
        <Link href={`/admin/cases/resolved-cases/${row.case_id}`}>
          <p className="text-accent">{row.case_id}</p>
        </Link>
      ),
    },
    {
      label: "User Name",
      accessor: "user_id",
      render: (row) => (
        // <Link href={`/admin/users/${row.user_id?.user_id}`}>
        <span className="flex items-center gap-2 ">
          {<ProfileAvatar src={row.user_id?.profile_photo} />}
          <div>{row.user_id?.user_id}</div>
          <div>{row.user_id?.first_name}</div>
          <div>{row.user_id?.last_name}</div>
        </span>
        // </Link>
      ),
    },
    {
      label: "Support Agent",
      accessor: "agent_id",
      render: (row) => (
        <div>
          {row.agent_id?.agent_id && (
            <Link href={`/admin/agents/${row.agent_id?.agent_id}`}>
              <span className="flex items-center gap-2 text-accent cursor-pointer">
                {<ProfileAvatar src={row.agent_id?.profile_photo} />}
                <div>{row?.agent_id?.agent_id}</div>
                <div>{row?.agent_id?.first_name}</div>
                <div>{row?.agent_id?.last_name}</div>
              </span>
            </Link>
          )}
        </div>
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
        <h1 className="text-2xl font-semibold text-gray-800">Resolved Cases</h1>
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
        isLoading={isLoading}
      />
    </div>
  );
};

export default ResolvedCaseBody;
