"use client";

import Table from "@/components/admin/dashboard/Table";
import SearchInput from "@/components/search/SearchInput";
import { useGetCases } from "@/hook/case";
import { useDebounce } from "@/hook/debounce";
import { formatDateTime } from "@/utils/formatDateTime";
import { useState } from "react";

const BasicCaseBody = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 15;
  const debouncedSearch = useDebounce(search, 500);
  const { cases, meta, isLoading } = useGetCases(
    page,
    "Basic",
    limit,
    debouncedSearch,
  );

  const columns = [
    {
      label: "Case ID",
      accessor: "case_id",
      render: (row) => <p>{row.case_id}</p>,
    },
    {
      label: "User Name",
      accessor: "user.name",
      render: (row) => (
        <span className="flex items-center gap-2">
          <div>{row.user_id?.user_id}</div>
          <div className="flex gap-1">
            <div>{row.user_id?.first_name}</div>
            <div>{row.user_id?.last_name}</div>
          </div>
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
        <h1 className="text-2xl font-semibold text-gray-800">Basic Cases</h1>
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
