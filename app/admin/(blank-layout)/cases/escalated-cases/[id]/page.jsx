"use client";

import CaseDetails from "@/components/admin/case-details/CaseDetails";
import Button from "@/components/common/Button";
import DetailsHeader from "@/components/common/DetailsHeader";
import ConfirmationModal from "@/components/modal/ConfirmationModal";
import { useGetCase, useUpdateCaseStatus } from "@/hook/case";
import { useToast } from "@/lib/Provider/toastProvider";
import { socket } from "@/lib/socket";
import { DownloadIcon } from "@/public/assets/icons/icons";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  const router = useRouter();
  const [escalateOpen, setEscalateOpen] = useState(false);
  const [closeOpen, setCloseOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const { id } = useParams();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { caseData, isLoading } = useGetCase(id, {
    enabled: !!id,
  });

  useEffect(() => {
    if (!id) return;

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);

      // Join admin dashboard room
      socket.emit("join_admin_dashboard");

      // Join case room (optional but recommended)
      socket.emit("join_case", id);
    });

    const handleLocationUpdate = (data) => {
      if (data?.movementData?.case_id !== id) return;
      console.log("Socket data", data);
      queryClient.setQueryData(["case", id], (old) => {
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
      console.log("Socket status data", data);

      showToast(data?.message, "info", "Info");
      queryClient.setQueryData(["case", data?.case_id], (old) => {
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
      if (data?.case_id === id && data?.new_status !== "Escalated") {
        router.back();
      }
    };

    socket.on("admin_map_movement", (data) => {
      handleLocationUpdate(data);
    });
    socket.on("update_case_status", (data) => {
      handleUpdate(data);
    });

    return () => {
      socket.off("admin_map_movement");
      socket.off("update_case_status");
      socket.off("join_case");
      socket.off("join_admin_dashboard");
    };
  }, [[queryClient]]);

  const {
    updateCaseStatus,
    isLoading: statusLoading,
    errorMessage,
  } = useUpdateCaseStatus();

  const handleClose = () => {
    console.log("Case closed!");
    setStatusModalOpen(true);
    setCloseOpen(false);
  };
  const handleStatusModal = (status) => {
    const data = { case_id: id, status };
    updateCaseStatus(data, {
      onSuccess: () => {
        showToast(`Case ${status} successfully`, "success", "Success");
        setStatusModalOpen(false);
        router.push(`/admin/cases/${status?.toLowerCase()}-cases/${id}`);
      },
      onError: () => {
        showToast(errorMessage || "Failed to resolve case", "error", "Error");
      },
    });
  };

  return (
    <div className="pb-8">
      {" "}
      <DetailsHeader
        title="Case"
        id={caseData?.case_id}
        actions={
          <div className="flex gap-2">
            <Button variant="outline">{DownloadIcon}Download File</Button>{" "}
            {caseData?.status !== "Escalated" ? (
              <>
                <Button onClick={() => setEscalateOpen(true)} variant="solid">
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
      <CaseDetails caseDetails={caseData} isLoading={isLoading} />
      <div>
        <ConfirmationModal
          isOpen={escalateOpen}
          onClose={() => setEscalateOpen(false)}
          onConfirm={() => {
            console.log("Escalated!");
            setEscalateOpen(false);
          }}
          title="Confirmation"
          message="Do you want to escalate this case?"
          confirmText="Yes"
          cancelText="No"
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
          loading={statusLoading}
        />
      </div>
    </div>
  );
};

export default page;
