"use client";
import EmergencyContactCard from "@/components/common/Card/EmergencyContactCard";
import VictimInformationCard from "@/components/common/Card/VictimInformationCard";
import ProfileAvatar from "@/components/common/ImageViewer/ProfileAvatar";
// import MapWithCoords from "@/components/common/map/MapWithCoords";
import AgentSelectModal from "@/components/modal/AgentSelectModal";
import { PlusCircleIcon } from "@/public/assets/icons/icons";
import React from "react";
import CaseDetailsSkeleton from "./CaseDetailsSkeleton";
import { formatDateTime } from "@/utils/formatDateTime";
// import MapWithPath from "@/components/common/map/MapWithPath";
// import TestAudioPlayer from "@/components/TestAudioPlayer";

import dynamic from "next/dynamic";
import LiveAudioV3 from "@/components/audio/LiveAudioV3";

// import WebSocketAudioPlayer from "@/components/WebSocketAudioPlayer";

const Map = dynamic(() => import("@/components/common/map/MapWithPath"), {
  ssr: false,
});

// const AudioStream = dynamic(() => import("@/components/WebSocketAudioPlayer"), {
//   ssr: false,
// });

const CaseDetails = ({ caseDetails, isLoading = true }) => {
  const [open, setOpen] = React.useState(false);

  const user = {
    name: `${caseDetails?.user_id?.first_name || ""} ${caseDetails?.user_id?.last_name || ""}`,
    id: caseDetails?.user_id?.user_id || "",
    email: caseDetails?.user_id?.email || "",
    phone: caseDetails?.user_id?.phone || "",
    address: caseDetails?.user_id?.address || "",
    image: caseDetails?.user_id?.profile_photo,
  };
  const emergencyContact = {
    name: caseDetails?.user_id?.emergency_contact_details?.contact_name || "",
    relationship:
      caseDetails?.user_id?.emergency_contact_details?.relation || "",
    email: caseDetails?.user_id?.emergency_contact_details?.email || "",
    phone: caseDetails?.user_id?.emergency_contact_details?.phone || "",
    address: caseDetails?.user_id?.emergency_contact_details?.address || "",
  };

  const supportAgent = {
    name: `${caseDetails?.agent_id?.first_name || ""} ${caseDetails?.agent_id?.last_name || "N/A"}`,
    id: caseDetails?.agent_id?.agent_id || "",
    email: caseDetails?.agent_id?.email || "",
    phone: "", // not available in API
    address: "", // not available in API
    agentId: caseDetails?.agent_id?.agent_id || "",
    image: caseDetails?.agent_id?.profile_photo,
  };

  const route = caseDetails?.location_history?.map((point) => [
    point.latitude,
    point.longitude,
  ]);

  const escalatedAt = caseDetails?.history
    .filter((item) => item?.to_status === "Escalated")
    .pop()?.timestamp;

  // const coords =
  //   caseDetails?.location_history?.map((loc) => [
  //     loc.longitude,
  //     loc.latitude,
  //   ]) || [];

  return (
    <>
      {isLoading ? (
        <CaseDetailsSkeleton />
      ) : caseDetails ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Status */}
          <div className="w-full p-4 bg-white border border-gray-200 rounded-xl">
            <div className="flex flex-wrap items-center justify-center gap-2 text-center sm:text-left">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">
                Case Status:
              </h2>
              <h2
                className={`text-lg sm:text-xl md:text-2xl font-semibold ${caseDetails?.status === "Escalated" ? "text-accent" : "text-[#D3BE01]"}`}
              >
                {caseDetails?.status}
              </h2>
            </div>
          </div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Section */}
            <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <VictimInformationCard
                  title="Victim Information"
                  name={user.name}
                  // status="Available"
                  userCode={user?.id}
                  email={user.email}
                  phone={user.phone}
                  image={user.image}
                  address={user.address}
                />

                <EmergencyContactCard
                  name={emergencyContact.name}
                  relation={emergencyContact.relationship}
                  email={emergencyContact.email}
                  phone={emergencyContact.phone}
                  address={emergencyContact.address}
                />
              </div>

              {/* Map Section */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 font-semibold text-lg">
                  Live Location
                </div>
                {/* <div className="h-[300px] sm:h-[400px]">
                  <MapWithCoords coords={coords} />
                </div> */}

                <div className="relative z-10 h-[300px] sm:h-[400px]">
                  {/* <MapWithPath route={route} /> */}
                  <Map route={route} />
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6 order-1 lg:order-2">
              {/* Support Agent */}

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <h3 className="font-semibold text-lg mb-4">Support Agent</h3>
                {(caseDetails?.status === "Pending" ||
                  caseDetails?.status === "In Progress" ||
                  caseDetails?.status === "Escalated") &&
                !caseDetails?.agent_id?.first_name ? (
                  <div
                    className="flex flex-col items-center gap-3 text-accent cursor-pointer"
                    onClick={() => setOpen(true)}
                  >
                    <div className="text-accent">{PlusCircleIcon}</div>
                    <div className="text-accent">Add Support Agent</div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <span className="text-gray-500 font-semibold text-[12px]">
                        Agent ID
                      </span>
                      <span className="text-gray-700 text-[14px] font-semibold">
                        {supportAgent?.agentId || "N/A"}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-gray-500 font-semibold text-[12px]">
                        Name
                      </span>
                      <span className="flex gap-2 text-gray-700 text-[14px] font-semibold">
                        {supportAgent?.agentId && (
                          <ProfileAvatar src={supportAgent.image} />
                        )}{" "}
                        {supportAgent?.name || "N/A"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Case Timeline */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                {/* <h3 className="font-semibold text-lg mb-4">Case Timeline</h3> */}

                <div className="space-y-4 ">
                  <div>
                    <div className="text-gray-500 font-semibold text-[12px]">
                      Case Created
                    </div>
                    <div className="text-[14px]">
                      {formatDateTime(caseDetails?.createdAt)}
                    </div>
                  </div>

                  {caseDetails?.status?.toLowerCase() !== "pending" && (
                    <div>
                      <div className="text-gray-500 font-semibold text-[12px]">
                        Case Accepted
                      </div>
                      <div className="text-[14px]">
                        {formatDateTime(caseDetails?.assigned_at)}
                      </div>
                    </div>
                  )}
                  {(caseDetails?.status?.toLowerCase() === "escalated" ||
                    caseDetails?.status?.toLowerCase() === "resolved" ||
                    caseDetails?.status?.toLowerCase() === "unresolved") && (
                    <div>
                      <div className="text-gray-500 font-semibold text-[12px]">
                        Case Escalated
                      </div>
                      <div className="text-[14px]">
                        {(escalatedAt && formatDateTime(escalatedAt)) || "N/A"}
                      </div>
                    </div>
                  )}
                  {caseDetails?.status?.toLowerCase() === "resolved" && (
                    <div>
                      <div className="text-gray-500 font-semibold text-[12px]">
                        Case Resolved
                      </div>
                      <div className="text-[14px]">
                        {formatDateTime(caseDetails?.updatedAt)}
                      </div>
                    </div>
                  )}
                  {caseDetails?.status?.toLowerCase() === "unresolved" && (
                    <div>
                      <div className="text-gray-500 font-semibold text-[12px]">
                        Case Unresolved
                      </div>
                      <div className="text-[14px]">
                        {formatDateTime(caseDetails?.updatedAt)}
                      </div>
                    </div>
                  )}
                  {caseDetails?.status?.toLowerCase() === "false" && (
                    <div>
                      <div className="text-gray-500 font-semibold text-[12px]">
                        Case Declared False
                      </div>
                      <div className="text-[14px]">
                        {formatDateTime(caseDetails?.updatedAt)}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Audio Stream */}
              {caseDetails?.status === "Pending" ||
              caseDetails?.status === "In Progress" ||
              caseDetails?.status === "Escalated" ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  {/* <h3 className="font-semibold text-lg mb-4">Audio Stream</h3> */}

                  <div className="w-full  flex items-center justify-center rounded-lg">
                    {/* <span className="text-gray-400 text-sm">
                    Audio Stream Placeholder
                  </span> */}
                    {caseDetails?.status === "Pending" ||
                    caseDetails?.status === "In Progress" ||
                    caseDetails?.status === "Escalated" ? (
                      <LiveAudioV3 caseId={caseDetails?.case_id} />
                    ) : (
                      // <AudioPlayer socket={audioData} />
                      <></>
                    )}
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
          <AgentSelectModal
            isOpen={open}
            onClose={() => setOpen(false)}
            case_id={caseDetails?.case_id}
            redirect={true}
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default CaseDetails;
