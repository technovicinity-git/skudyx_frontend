"use client";

import { useState } from "react";
import { X, Search } from "lucide-react";
import Button from "../common/Button";
import { useDebounce } from "@/hook/debounce";
import { useGetAgents } from "@/hook/user";
import { useAssignCaseToAgent } from "@/hook/case";
import { useToast } from "@/lib/Provider/toastProvider";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import ProfileAvatar from "../common/ImageViewer/ProfileAvatar";

export default function AgentSelectModal({
  isOpen,
  onClose,
  case_id,
  redirect = false,
}) {
  const [search, setSearch] = useState("");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { assignCaseToAgent, isLoading, errorMessage } = useAssignCaseToAgent();

  const debouncedSearch = useDebounce(search, 500);
  const { agents } = useGetAgents(1, 999999, debouncedSearch, "Available");

  const handleAssign = () => {
    console.log("Selected Agent:", selectedAgent);
    assignCaseToAgent(
      { case_id, agent_id: selectedAgent._id },
      {
        onSuccess: () => {
          showToast(
            "Case assigned to agent successfully",
            "success",
            "Success",
          );
          if (redirect) {
            router.push(`/admin/cases/inprogress-cases/${case_id}`);
          }
          queryClient.invalidateQueries(["cases", "Pending"]);
          setSelectedAgent(null);
          onClose();
        },
        onError: () => {
          showToast(
            errorMessage || "Failed to assign case to agent",
            "error",
            "Error",
          );
        },
      },
    );
  };

  const handleCancel = () => {
    setSelectedAgent(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Assign Agent</h2>
          <button
            onClick={handleCancel}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search agent..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#061640]"
            />
          </div>

          {/* Agent List */}
          <div className="border border-gray-200 rounded-xl divide-y divide-gray-200 overflow-hidden">
            {agents?.length === 0 && (
              <div className="p-4 text-sm text-gray-500 text-center">
                No agents found
              </div>
            )}

            {agents?.map((agent) => {
              const isSelected = selectedAgent?._id === agent?._id;

              return (
                <div
                  key={agent?._id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`flex items-center px-4 py-3 text-sm cursor-pointer transition
                    ${isSelected ? "bg-blue-50" : "hover:bg-gray-50"}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center
                        ${isSelected ? "border-[#061640]" : "border-gray-400"}
                      `}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 bg-[#061640] rounded-full" />
                      )}
                    </div>

                    <span className="flex items-center gap-2 font-medium text-gray-800">
                      <ProfileAvatar src={agent?.profile_photo} size={24} />{" "}
                      {agent?.first_name} {agent?.last_name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>

          <Button
            onClick={handleAssign}
            className="bg-[#061640] hover:bg-[#0A1F5C] text-white disabled:opacity-50"
            disabled={!selectedAgent || isLoading}
          >
            {isLoading ? "Assigning..." : "Assign"}
          </Button>
        </div>
      </div>
    </div>
  );
}
