"use client";
import React, { useState } from "react";
import Button from "@/components/common/Button";
import Table from "../Table";
import UpdateTypeModal from "@/components/common/UpdateTypeModal";

const UpdatesBody = () => {
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pageSize = 6;

  // Example data for updates
  const updates = [
    {
      delivered: "All customers",
      type: "SMS",
      date: "22 Jan 2022, 5:42AM",
    },
    {
      delivered: "Investors",
      type: "Email, SMS",
      date: "22 Jan 2022, 5:42AM",
    },
    {
      delivered: "Corporate Investors",
      type: "Email",
      date: "22 Jan 2022, 5:42AM",
    },
    {
      delivered: "Farmers",
      type: "Email",
      date: "22 Jan 2022, 5:42AM",
    },
    {
      delivered: "Farmers",
      type: "SMS",
      date: "22 Jan 2022, 5:42AM",
    },
    {
      delivered: "Corporate Investors",
      type: "Email, SMS",
      date: "22 Jan 2022, 5:42AM",
    },
    {
      delivered: "Corporate Investors",
      type: "Email",
      date: "22 Jan 2022, 5:42AM",
    },
    {
      delivered: "All customers",
      type: "Email",
      date: "22 Jan 2022, 5:42AM",
    },
  ];

  // Filtering logic
  const filteredUpdates = updates.filter(
    (u) =>
      u.delivered.toLowerCase().includes(filter.toLowerCase()) ||
      u.type.toLowerCase().includes(filter.toLowerCase()) ||
      u.date.toLowerCase().includes(filter.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredUpdates.length / pageSize) || 1;
  const paginatedUpdates = filteredUpdates.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Table columns
  const columns = [
    { label: "Delivered to", accessor: "delivered" },
    { label: "Type", accessor: "type" },
    { label: "Date", accessor: "date" },
    {
      label: "Status",
      accessor: "action",
      render: (row) => (
        <Button
          variant="outline"
          className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 inline-block"
        >
          View Details
        </Button>
      ),
    },
  ];

  const handleNewUpdate = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectUpdateType = (type) => {
    console.log("Selected update type:", type);
    // The Link components in the modal will handle navigation
    // This function is now mainly for logging purposes
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-5 md:mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Updates</h1>
        <Button
          type="button"
          variant="solid"
          className="hover:!bg-green-800 text-white px-6 py-2.5"
          onClick={handleNewUpdate}
        >
          New update
        </Button>
      </div>

      <Table
        columns={columns}
        data={paginatedUpdates}
        showFilter={true}
        filterValue={filter}
        onFilterChange={(val) => {
          setFilter(val);
          setPage(1);
        }}
        showPagination={true}
        pagination={{
          page,
          totalPages,
          onPageChange: (p) => setPage(p),
        }}
        wrapperText={"Recent Update"}
      />

      {/* Update Type Selection Modal */}
      <UpdateTypeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSelectType={handleSelectUpdateType}
      />
    </div>
  );
};

export default UpdatesBody;
