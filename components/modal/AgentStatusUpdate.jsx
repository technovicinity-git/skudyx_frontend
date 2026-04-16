"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import Button from "../common/Button";
import { useUpdateAgentStatus } from "@/hook/user";
import { useToast } from "@/lib/Provider/toastProvider";
import { useQueryClient } from "@tanstack/react-query";

const validStatuses = ["Active", "Deactivated", "Blocked"];

export default function AgentStatusModal({
  isOpen,
  onClose,
  agentId,
  currentStatus,
  setPosition,
  position,
}) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  const { updateAgentStatus, isLoading, errorMessage } = useUpdateAgentStatus();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedStatus(currentStatus);
    }
  }, [currentStatus, isOpen]);

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const rect = modalRef.current.getBoundingClientRect();

    const overflowBottom = rect.bottom > window.innerHeight;
    const overflowTop = rect.top < 0;

    let newTop = position.top;

    if (overflowBottom) {
      newTop = position.top - rect.height - 16; // move above
    }

    if (overflowTop) {
      newTop = 10; // clamp to top
    }

    if (newTop !== position.top) {
      // update safely
      setPosition((prev) => ({
        ...prev,
        top: newTop,
      }));
    }
  }, [isOpen]);

  const handleUpdate = () => {
    updateAgentStatus(
      {
        target_user_id: agentId,
        new_status: selectedStatus,
      },
      {
        onSuccess: () => {
          showToast("Agent status updated successfully", "success", "Success");
          queryClient.invalidateQueries(["agents"]);
          onClose();
        },
        onError: () => {
          showToast(
            errorMessage || "Failed to update agent status",
            "error",
            "Error",
          );
        },
      },
    );
  };

  const handleCancel = () => {
    setSelectedStatus(currentStatus);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="absolute z-50 w-72 bg-white rounded-xl shadow-lg border border-gray-200 animate-in fade-in zoom-in-95"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl flex flex-col max-h-[85vh]">
        {/* 🔹 Sticky Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white rounded-t-2xl">
          <h2 className="text-lg font-semibold">Change Status</h2>
          <button
            onClick={handleCancel}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* 🔹 Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {validStatuses.map((status) => {
            const isSelected = selectedStatus === status;

            return (
              <div
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`group flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 cursor-pointer transition-all duration-200
                  
                  ${
                    isSelected
                      ? "border-[#061640] bg-blue-50 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  {/* Indicator */}
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition
                      ${
                        isSelected
                          ? "border-[#061640]"
                          : "border-gray-400 group-hover:border-gray-600"
                      }
                    `}
                  >
                    <div
                      className={`w-2 h-2 rounded-full transition-all duration-200
                        ${isSelected ? "bg-[#061640] scale-100" : "scale-0"}
                      `}
                    />
                  </div>

                  {/* Label */}
                  <span
                    className={`text-sm font-medium transition-colors
                      ${
                        isSelected
                          ? "text-[#061640]"
                          : "text-gray-700 group-hover:text-gray-900"
                      }
                    `}
                  >
                    {status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 🔹 Sticky Footer */}
        <div className="sticky bottom-0 flex justify-end gap-3 px-5 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>

          <Button
            onClick={handleUpdate}
            disabled={isLoading || selectedStatus === currentStatus}
            className="bg-[#061640] hover:bg-[#0A1F5C] text-white disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Update Status"}
          </Button>
        </div>
      </div>
    </div>
  );
}
