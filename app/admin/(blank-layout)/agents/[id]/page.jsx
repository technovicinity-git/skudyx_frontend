"use client";

import Table from "@/components/admin/dashboard/Table";
import VictimInformationCard from "@/components/common/Card/VictimInformationCard";
import CaseStatus from "@/components/common/status/CaseStatus";
import AddNewAgentModal from "@/components/modal/AddNewAgentModal";
import { useGetAgentCaseHistoryByAdmin } from "@/hook/case";
import { useDebounce } from "@/hook/debounce";
import { useGetAgent } from "@/hook/user";
import { formatDateTime } from "@/utils/formatDateTime";
import { useParams } from "next/navigation";
import { useState } from "react";

const AgentBody = () => {
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const limit = 10;
  const { id } = useParams();

  const { agent, isLoading: isAgentLoading } = useGetAgent(id);

  const agentInfo = {
    name: `${agent?.first_name} ${agent?.last_name}`,
    status: agent?.availability_status,
    userCode: agent?.agent_id,
    email: agent?.email,
    phone: agent?.phone,
    profile_photo: agent?.profile_photo,
    address: agent?.address,
  };

  const debouncedSearch = useDebounce(search, 500);

  const { agentCases, isLoading, meta } = useGetAgentCaseHistoryByAdmin(
    id,
    page,
    limit,
    debouncedSearch,
  );

  console.log("agent cases", agentCases);

  const columns = [
    {
      label: "Case ID",
      accessor: "case_id",
      render: (row) => <span>{row.case_id}</span>,
    },

    {
      label: "Case Status",
      accessor: "status",
      render: (row) => <CaseStatus status={row.status} />,
    },

    {
      label: "Date",
      accessor: "createdAt",
      render: (row) => <p>{formatDateTime(row.createdAt)}</p>,
    },
  ];

  return (
    <div className="space-y-6 py-6 px-4 md:px-8">
      {/* Header */}
      <div className=" items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Support Agent Details
        </h1>
      </div>

      <div className="max-w-7xl mx-auto space-y-6 flex flex-col items-center justify-center gap-4">
        {/* Top Section */}
        {agentInfo?.email && !isAgentLoading ? (
          <VictimInformationCard
            title="Support Agent Information"
            name={agentInfo?.name}
            status={agentInfo?.status}
            statusColor="green"
            userCode={agentInfo?.userCode}
            email={agentInfo?.email}
            phone={agentInfo?.phone}
            address={agentInfo?.address}
            image={agentInfo?.profile_photo}
            onEdit={() => setOpen(true)}
          />
        ) : (
          <div className="w-full bg-white rounded-md p-4 border border-gray-200">
            <p className="text-gray-500 text-center py-10">
              No agent information available.
            </p>
          </div>
        )}

        <div className="w-full bg-white rounded-md p-4 border border-gray-200">
          <div className="font-semibold mt-2 mb-3">Case History</div>
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
      </div>
      <AddNewAgentModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Edit Agent Information"
        agent={agent}
      />
    </div>
  );
};

export default AgentBody;
