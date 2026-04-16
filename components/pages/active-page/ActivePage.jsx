"use client";
import React, { useEffect, useState } from "react";

import CaseDetails from "@/components/admin/case-details/CaseDetails";
import Button from "@/components/common/Button";
import DetailsHeader from "@/components/common/DetailsHeader";
import ConfirmationModal from "@/components/modal/ConfirmationModal";
import {
  useGetAgentActiveCase,
  useGetCase,
  useUpdateCaseStatus,
} from "@/hook/case";
import { useToast } from "@/lib/Provider/toastProvider";
import { socket } from "@/lib/socket";

import { DownloadIcon } from "@/public/assets/icons/icons";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const ActiveCase = () => {
  const router = useRouter();
  const [falseOpen, setFalseOpen] = useState(false);
  const [escalateOpen, setEscalateOpen] = useState(false);
  const [closeOpen, setCloseOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { showToast } = useToast();

  const {
    updateCaseStatus,
    isLoading: statusLoading,
    errorMessage,
  } = useUpdateCaseStatus();

  const { activeCase } = useGetAgentActiveCase();

  const { caseData, isLoading } = useGetCase(activeCase?.case_id, {
    // enabled: !!activeCase?.case_id,
    retry: 1,
  });

  useEffect(() => {
    // if (!activeCase?.case_id) return;

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);

      // Join admin dashboard room
      socket.emit("join_admin_dashboard");

      // Join case room (optional but recommended)
      // socket.emit("join_case", activeCase?.case_id);
    });

    const handleLocationUpdate = (data) => {
      console.log("Socket data", data);
      queryClient.setQueryData(["case", activeCase?.case_id], (old) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data.data,
              location_history: data?.caseData?.location_history,
            },
          },
        };
      });
    };

    const handleUpdate = (data) => {
      console.log("Socket status update data", data);
      queryClient.invalidateQueries({
        queryKey: ["case", activeCase?.case_id],
      });
      queryClient.setQueryData(["case", activeCase?.case_id], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data.data,
              status: data?.new_status,
            },
          },
        };
      });
      showToast(data?.message, "info", "Info");
      if (
        data?.new_status === "Resolved" ||
        data?.new_status === "Unresolved" ||
        data?.new_status === "False"
      ) {
        router.push("/agent/pending-cases");
      }
    };

    socket.on("admin_map_movement", (data) => {
      handleLocationUpdate(data);
    });

    socket.on("update_case_status", (data) => {
      handleUpdate(data);
    });

    socket.on("assign_case", (data) => {
      console.log("Case assigned data", data);
      showToast(data?.message, "info", "Info");
      queryClient.invalidateQueries({
        queryKey: ["agentActiveCase"],
      });
    });

    return () => {
      socket.off("admin_map_movement");
      socket.off("update_case_status");
      socket.off("join_admin_dashboard");
      socket.off("join_case");
      socket.off("assign_case");
    };
  }, [activeCase, queryClient]);

  const handleFalse = () => {
    updateCaseStatus(
      { case_id: activeCase?.case_id, status: "False" },
      {
        onSuccess: () => {
          showToast("Case marked as false successfully", "success", "Success");
          router.push("/agent/pending-cases");
          setFalseOpen(false);
        },
        onError: () => {
          showToast(
            errorMessage || "Failed to update case status",
            "error",
            "Error",
          );
        },
      },
    );
  };

  const handleEscalate = () => {
    const data = { case_id: activeCase?.case_id, status: "Escalated" };
    updateCaseStatus(data, {
      onSuccess: () => {
        showToast("Case escalated successfully", "success", "Success");
        setEscalateOpen(false);
        queryClient.invalidateQueries(["agentActiveCase"]);
      },
      onError: () => {
        showToast(errorMessage || "Failed to escalate case", "error", "Error");
      },
    });
  };

  const handleClose = () => {
    console.log("Case closed!");
    setStatusModalOpen(true);
    setCloseOpen(false);
  };

  const handleStatusModal = (status) => {
    const data = { case_id: activeCase?.case_id, status };
    updateCaseStatus(data, {
      onSuccess: () => {
        showToast(`Case ${status} successfully`, "success", "Success");
        router.push("/agent/pending-cases");
        setStatusModalOpen(false);
      },
      onError: () => {
        showToast(errorMessage || "Failed to resolve case", "error", "Error");
      },
    });
  };

  return (
    <div className=" mb-6">
      {" "}
      {caseData && (
        <div>
          <DetailsHeader
            title="Case"
            id={caseData?.case_id}
            actions={
              <div className="flex gap-2">
                <Button variant="outline">{DownloadIcon}Download File</Button>{" "}
                {caseData?.status !== "Escalated" ? (
                  <>
                    <Button onClick={() => setFalseOpen(true)} variant="danger">
                      False
                    </Button>
                    <Button
                      onClick={() => setEscalateOpen(true)}
                      variant="solid"
                    >
                      Escalate
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setCloseOpen(true)} variant="solid">
                    Close
                  </Button>
                )}
              </div>
            }
          />
        </div>
      )}
      <CaseDetails caseDetails={caseData} isLoading={isLoading} />
      <div>
        <ConfirmationModal
          isOpen={falseOpen}
          onClose={() => setFalseOpen(false)}
          onConfirm={handleFalse}
          title="Confirmation"
          message="Do you want to declare this a false case?"
          confirmText="Yes"
          cancelText="No"
        />
      </div>
      <div>
        <ConfirmationModal
          isOpen={escalateOpen}
          onClose={() => setEscalateOpen(false)}
          onConfirm={handleEscalate}
          title="Confirmation"
          message="Do you want to escalate this case?"
          confirmText="Yes"
          cancelText="No"
          loading={statusLoading}
        />
      </div>
      <div>
        <ConfirmationModal
          isOpen={closeOpen}
          onClose={() => setCloseOpen(false)}
          onConfirm={handleClose}
          title="Confirmation"
          message="Do you want to close this case?"
          confirmText="Yes"
          cancelText="No"
          loading={statusLoading}
        />
      </div>
      <div>
        <ConfirmationModal
          isOpen={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          onConfirm={() => handleStatusModal("Resolved")}
          onConfirm2={() => handleStatusModal("Unresolved")}
          title="Confirmation"
          message="What is the status of your case?"
          confirmText="Resolved"
          confirmText2="Unresolved"
          cancelText="No"
        />
      </div>
      {!caseData && !isLoading && (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold">No Active Case</h2>
          <p className="text-gray-500 mt-2">
            You currently have no active cases.
          </p>
        </div>
      )}
    </div>
  );
};

export default ActiveCase;
