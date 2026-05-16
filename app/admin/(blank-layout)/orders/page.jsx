"use client";
import React, { useState } from "react";
import Table from "@/components/admin/dashboard/Table";
import OrderStatus from "@/components/common/status/OrderStatus";
import SearchInput from "@/components/search/SearchInput";
import { useDebounce } from "@/hook/debounce";
import { getOrders } from "@/hook/order";
import { formatDateTime } from "@/utils/formatDateTime";
import Link from "next/link";

const OrderList = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 15;

  const debouncedSearch = useDebounce(search, 500);

  const { orders, isLoading, meta } = getOrders(page, limit, debouncedSearch);

  const columns = [
    {
      label: "Order ID",
      accessor: "orderId",
      render: (row) => (
        <Link href={`/admin/orders/${row.orderId}`}>
          <p className="text-accent">{row.orderId}</p>
        </Link>
      ),
    },
    {
      label: "User ID",
      accessor: "userId",
      render: (row) => (
        <span className="flex items-center gap-2">
          <div>{row?.userId?._id}</div>
        </span>
      ),
    },

    {
      label: "Status",
      accessor: "status",
      render: (row) => <OrderStatus status={row.status} />,
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
