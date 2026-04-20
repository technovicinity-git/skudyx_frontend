"use client";

import Table from "@/components/admin/dashboard/Table";
import Button from "@/components/common/Button";
import ProfileAvatar from "@/components/common/ImageViewer/ProfileAvatar";
import AgentStatus from "@/components/common/status/AgentStatus";
import AddNewAgentModal from "@/components/modal/AddNewAgentModal";
import AgentStatusModal from "@/components/modal/AgentStatusUpdate";
import SearchInput from "@/components/search/SearchInput";
import { useDebounce } from "@/hook/debounce";
import { useGetAgents } from "@/hook/user";
import Link from "next/link";
import { useState } from "react";

const AgentBody = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const limit = 15;

  const debouncedSearch = useDebounce(search, 500);

  const { agents, isLoading, meta } = useGetAgents(
    page,
    limit,
    debouncedSearch,
  );

  const handleOpen = (e, row) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const POPUP_HEIGHT = 260;
    const POPUP_WIDTH = 280;
    const OFFSET = 8;

    const spaceBelow = window.innerHeight - rect.bottom - 100;
    const spaceAbove = rect.top;

    let top;

    if (spaceBelow < POPUP_HEIGHT && spaceAbove > POPUP_HEIGHT) {
      top = rect.top + window.scrollY - POPUP_HEIGHT - OFFSET;
    } else {
      top = rect.bottom + window.scrollY + OFFSET;
    }

    let left = rect.left + window.scrollX - 280;

    // Prevent right overflow
    if (left + POPUP_WIDTH > window.innerWidth) {
      left = window.innerWidth - POPUP_WIDTH - 10;
    }

    // Prevent top overflow
    top = Math.max(10, top);

    setPosition({ top, left });
    setSelectedAgent(row);
    setIsOpen(true);
  };

  const columns = [
    {
      label: "Support Agent",
      accessor: "name",
      render: (row) => (
        <Link href={`/admin/agents/${row.agent_id}`}>
          <span className="flex items-center gap-2 text-accent cursor-pointer">
            {<ProfileAvatar src={row.profile_photo} size={20} />}
            <span>{row.agent_id}</span>
            <div className="flex gap-1">
              <span>{row.first_name}</span>
              {/* <span>{row.middle_name}</span> */}
              <span>{row.last_name}</span>
            </div>
          </span>
        </Link>
      ),
    },

    {
      label: "Status",
      accessor: "availability_status",
      render: (row) => <AgentStatus status={row.availability_status} />,
    },
    {
      label: "Case ID",
      accessor: "id",
      render: (row) => (
        <div>
          {row.availability_status === "Occupied" ? (
            <span className="text-accent">{row.agent_id}</span>
          ) : (
            <span>N/A</span>
          )}
        </div>
      ),
    },
    {
      label: "Action",
      accessor: "action",
      render: (row) => (
        <>
          {" "}
          <button
            onClick={(e) => handleOpen(e, row)}
            className={`px-3 rounded-full hover:bg-gray-200 transition text-lg ${selectedAgent?._id === row._id ? "bg-gray-200" : ""}`}
          >
            ⋮
          </button>
        </>
      ),
    },
  ];

  return (
    <div className="py-6 px-4 md:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className=" items-center ">
          <h1 className="text-2xl font-semibold text-gray-800">
            Support Agents
          </h1>
        </div>
        <Button variant="solid" onClick={() => setOpen(true)}>
          Add New Agent
        </Button>
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
        data={agents}
        showPagination={true}
        pagination={{
          page,
          totalPages: meta?.total_pages,
          onPageChange: (p) => setPage(p),
        }}
        limit={limit}
        isLoading={isLoading}
      />
      <AddNewAgentModal isOpen={open} onClose={() => setOpen(false)} />
      <AgentStatusModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSelectedAgent(null);
        }}
        agentId={selectedAgent?._id}
        currentStatus={selectedAgent?.account_status || ""}
        agentName={`${selectedAgent?.first_name || ""} ${selectedAgent?.last_name || ""}`}
        setPosition={setPosition}
        position={position}
      />
    </div>
  );
};

export default AgentBody;
