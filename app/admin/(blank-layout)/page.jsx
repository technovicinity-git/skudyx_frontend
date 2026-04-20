"use client";
import ActiveUser from "@/components/admin/dashboard/Analytics/ActiveUser";
import CaseStats from "@/components/admin/dashboard/Analytics/CaseStats";
import CaseSummary from "@/components/admin/dashboard/Analytics/CaseSummary";
import Table from "@/components/admin/dashboard/Table";
import ProfileAvatar from "@/components/common/ImageViewer/ProfileAvatar";
import { useGetCases } from "@/hook/case";
import { useGetAgents, useGetMyProfile } from "@/hook/user";
import { socket } from "@/lib/socket";
import { formatDateTime } from "@/utils/formatDateTime";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect } from "react";

const Page = () => {
  const { profile } = useGetMyProfile();
  const queryClient = useQueryClient();

  const { cases: pendingCases, isLoading: pendingLoading } = useGetCases(
    1,
    "Pending",
    4,
  );
  const { cases: inprogressCases, isLoading: inprogressLoading } = useGetCases(
    1,
    "In Progress",
    4,
  );
  const { cases: escalatedCases, isLoading: escalatedLoading } = useGetCases(
    1,
    "Escalated",
    4,
  );

  const { agents, isLoading: agentLoading } = useGetAgents(1, 4);

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

      queryClient.invalidateQueries({
        queryKey: ["caseStats"],
      });
      queryClient.invalidateQueries({
        queryKey: ["casePieStats"],
      });
    };

    socket.on("new_emergency_alert", (data) => {
      handleUpdate(data);
    });

    socket.on("admin_notification", (data) => {
      handleUpdate(data);
    });

    return () => {
      socket.off("admin_notification", handleUpdate);
      socket.off("connect");
      socket.off("admin_room");
      socket.off("join_admin_dashboard");
    };
  }, []);

  const pendingColumns = [
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
        <Link href={`/admin/users/${row.user_id?.user_id}`}>
          <span className="flex items-center gap-2 text-accent cursor-pointer">
            {<ProfileAvatar src={row?.user_id?.profile_photo} size={20} />}
            <div>{row.user_id?.user_id}</div>
            <div className="flex gap-1">
              <div>{row.user_id?.first_name}</div>
              <div>{row.user_id?.last_name}</div>
            </div>
          </span>
        </Link>
      ),
    },
    {
      label: "Date and Time",
      accessor: "createdAt",
      render: (row) => <p>{formatDateTime(row.createdAt)}</p>,
    },
  ];

  const inprogressColumns = [
    {
      label: "Case ID",
      accessor: "case_id",
      render: (row) => (
        <Link href={`/admin/cases/inprogress-cases/${row.case_id}`}>
          <p className="text-accent">{row.case_id}</p>
        </Link>
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
                <div className="flex gap-1">
                  <div>{row?.agent_id?.first_name}</div>
                  <div>{row?.agent_id?.last_name}</div>
                </div>
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

  const escalatedColumns = [
    {
      label: "Case ID",
      accessor: "case_id",
      render: (row) => (
        <Link href={`/admin/cases/escalated-cases/${row.case_id}`}>
          <p className="text-accent">{row.case_id}</p>
        </Link>
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
                <div className="flex gap-1">
                  <div>{row?.agent_id?.first_name}</div>
                  <div>{row?.agent_id?.last_name}</div>
                </div>
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

  const agentColumns = [
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
      label: "Action",
      accessor: "action",
      render: () => <p className="font-bold">...</p>,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Card */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-semibold">
          Welcome Back,{" "}
          <span className="text-blue-600">
            {profile?.first_name} {profile?.last_name}
          </span>
        </h1>
      </div>

      {/* Case Summary */}
      <CaseSummary />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        <div>
          <ActiveUser />
        </div>
        <div>
          <CaseStats />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold mb-6">Pending Cases</h2>
            <Link
              href="/admin/cases/pending-cases"
              className="text-accent hover:underline"
            >
              See All
            </Link>
          </div>
          <Table
            columns={pendingColumns}
            data={pendingCases}
            showPagination={false}
            limit={5}
            isLaoding={pendingLoading}
          />
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold mb-6">In Progress Cases</h2>
            <Link
              href="/admin/cases/inprogress-cases"
              className="text-accent hover:underline"
            >
              See All
            </Link>
          </div>
          <Table
            columns={inprogressColumns}
            data={inprogressCases}
            showPagination={false}
            limit={5}
            isLaoding={inprogressLoading}
          />
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold mb-6">Escalated Cases</h2>
            <Link
              href="/admin/cases/escalated-cases"
              className="text-accent hover:underline"
            >
              See All
            </Link>
          </div>
          <Table
            columns={escalatedColumns}
            data={escalatedCases}
            showPagination={false}
            limit={5}
            isLaoding={escalatedLoading}
          />
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold mb-6">Available Agents</h2>
            <Link href="/admin/agents" className="text-accent hover:underline">
              See All
            </Link>
          </div>
          <Table
            columns={agentColumns}
            data={agents}
            showPagination={false}
            limit={5}
            isLaoding={agentLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
