"use client";
import Table from "@/components/admin/dashboard/Table";
import SearchInput from "@/components/search/SearchInput";
import { useDebounce } from "@/hook/debounce";
import { getOrders } from "@/hook/order";
import { formatDateTime } from "@/utils/formatDateTime";
import Link from "next/link";
import React, { useState } from "react";

const OrderList = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 15;

  const debouncedSearch = useDebounce(search, 500);

  const { orders, isLoading, meta } = getOrders(page, limit, debouncedSearch);

  const columns = [
    {
      label: "Order ID",
      accessor: "order_id",
      render: (row) => (
        <Link href={`/admin/orders/${row.order_id}`}>
          <p className="text-accent">{row.order_id}</p>
        </Link>
      ),
    },
    {
      label: "User",
      accessor: "user.name",
      render: (row) => <p>{row.user.name}</p>,
    },

    {
      label: "Date and Time",
      accessor: "createdAt",
      render: (row) => <p>{formatDateTime(row.createdAt)}</p>,
    },

    {
      label: "Status",
      accessor: "status",
      render: (row) => <p>{row.status}</p>,
    },
  ];
  return (
    <div className="py-6 px-4 md:px-8">
      {/* Header */}
      <div className=" items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Order List</h1>
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
        data={orders}
        showPagination={true}
        pagination={{
          page,
          totalPages: meta?.total_pages,
          onPageChange: (p) => setPage(p),
        }}
        limit={limit}
        isLaoding={isLoading}
      />
    </div>
  );
};

export default OrderList;
