"use client";

import Table from "@/components/admin/dashboard/Table";
import EmergencyContactCard from "@/components/common/Card/EmergencyContactCard";
import VictimInformationCard from "@/components/common/Card/VictimInformationCard";
import ProfileAvatar from "@/components/common/ImageViewer/ProfileAvatar";
import CaseStatus from "@/components/common/status/CaseStatus";
import { useGetUserCases } from "@/hook/case";
import { useGetUser } from "@/hook/user";
import { formatDateTime } from "@/utils/formatDateTime";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

const UserBody = () => {
  const [page, setPage] = useState(1);

  const limit = 10;

  const { id } = useParams();

  const { user } = useGetUser(id);
  const { userCases, isLoading, meta } = useGetUserCases(id, page, limit);

  const address = [
    user?.address,
    user?.address_line2,
    user?.city,
    user?.state,
    user?.zip_postal_code,
    user?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const userInfo = {
    name: `${user?.first_name} ${user?.last_name}`,
    userCode: user?.user_id,
    email: user?.email,
    phone: user?.phone,
    image: user?.profile_photo,
    address: address,
    emergencyContacts: {
      contact_name: user?.emergency_contacts?.[0]?.contact_name,
      relationship: user?.emergency_contacts?.[0]?.relation,
      email: user?.emergency_contacts?.[0]?.email,
      phone: user?.emergency_contacts?.[0]?.phone,
      address: user?.emergency_contacts?.[0]?.address,
    },
  };
  const columns = [
    {
      label: "Case ID",
      accessor: "case_id",
      render: (row) => <span className="text-accent">{row.case_id}</span>,
    },
    {
      label: "Support Agent",
      accessor: "agent_id",
      render: (row) => (
        <>
          {row?.agent_id?.agent_id && (
            <Link href={`/admin/agents/${row?.agent_id?.agent_id}`}>
              <span className="flex items-center gap-2 text-accent cursor-pointer">
                {<ProfileAvatar src={row?.agent_id?.profile_photo} />}
                <div>{row?.agent_id?.agent_id}</div>
                <div>
                  {row?.agent_id?.first_name} {row?.agent_id?.last_name}
                </div>
              </span>
            </Link>
          )}
        </>
      ),
    },
    {
      label: "Status",
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
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">
          User Details
        </h1>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Section */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VictimInformationCard
            title="User Information"
            name={userInfo?.name}
            userCode={userInfo?.userCode}
            email={userInfo?.email}
            phone={userInfo?.phone}
            image={userInfo?.image}
            address={userInfo?.address}
          />

          <EmergencyContactCard
            name={userInfo?.emergencyContacts?.contact_name}
            relation={userInfo?.emergencyContacts?.relationship}
            email={userInfo?.emergencyContacts?.email}
            phone={userInfo?.emergencyContacts?.phone}
            address={userInfo?.emergencyContacts?.address}
          />
        </div>

        {/* Activity History */}
        <div className="bg-white  rounded-xl p-6 border border-gray-200  shadow-sm">
          <h2 className="font-semibold mb-4 text-text-primary">Case History</h2>

          <div className="overflow-x-auto">
            <Table
              columns={columns}
              data={userCases}
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
      </div>
    </div>
  );
};

export default UserBody;
