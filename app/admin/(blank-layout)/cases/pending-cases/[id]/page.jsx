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
  const [falseOpen, setFalseOpen] = useState(false);
  const [escalateOpen, setEscalateOpen] = useState(false);
  const [closeOpen, setCloseOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const { id } = useParams();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

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
      if (data?.case_id !== id) return;
      console.log("Socket location data", data);

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

    // const handleUpdate = (data) => {
    //   console.log("Socket data", data);
    //   // queryClient.invalidateQueries({
    //   //   queryKey: ["case", id],
    //   // });
    //   console.log("Updating case status in cache...", data?.new_status);
    //   showToast(data?.message, "info", "Info");
    //   queryClient.setQueryData(["case", id], (old) => {
    //     if (!old) return old;
    //     return {
    //       ...old,
    //       data: {
    //         ...old.data,
    //         data: {
    //           ...old.data.data,
    //           status: data?.new_status,
    //         },
    //       },
    //     };
    //   });
    //   router.back();
    // };

    const handleAccept = (data) => {
      console.log("Case accepted:", data);
      showToast(data?.message, "info", "Info");
      queryClient.invalidateQueries(["case", id]);
    };

    socket.on("admin_map_movement", (data) => {
      handleLocationUpdate(data);
    });
    // socket.on("update_case_status", (data) => {
    //   handleUpdate(data);
    // });
    socket.on("accept_case", (data) => {
      handleAccept(data);
    });

    return () => {
      socket.off("admin_map_movement", handleLocationUpdate);
      // socket.off("update_case_status");
      socket.off("accept_case");
      socket.off("join_case");
      socket.off("join_admin_dashboard");
      socket.off("connect");
    };
  }, [[queryClient]]);

  const {
    updateCaseStatus,
    isLoading: statusLoading,
    errorMessage,
  } = useUpdateCaseStatus();

  const handleFalse = () => {
    updateCaseStatus(
      { case_id: id, status: "False" },
      {
        onSuccess: () => {
          showToast("Case marked as false successfully", "success", "Success");
          queryClient.invalidateQueries(["cases"]);
          router.back();
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
    const data = { case_id: id, status: "Escalated" };
    updateCaseStatus(data, {
      onSuccess: () => {
        showToast("Case escalated successfully", "success", "Success");
        setEscalateOpen(false);
        queryClient.invalidateQueries(["agentActiveCase"]);
        queryClient.invalidateQueries(["cases"]);
        router.push(`/admin/cases/escalated-cases/${id}`);
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
    const data = { case_id: id, status };
    updateCaseStatus(data, {
      onSuccess: () => {
        showToast(`Case ${status} successfully`, "success", "Success");
        router.back();
        setStatusModalOpen(false);
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
                <Button onClick={() => setFalseOpen(true)} variant="danger">
                  False
                </Button>
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
          isOpen={falseOpen}
          onClose={() => setFalseOpen(false)}
          onConfirm={handleFalse}
          title="Confirmation"
          message="Do you want to declare this a false case?"
          confirmText="Yes"
          cancelText="No"
          isLoading={statusLoading}
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
          isLoading={statusLoading}
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
          isLoading={statusLoading}
        />
      </div>
      <div>
        <ConfirmationModal
          isOpen={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          onConfirm={handleStatusModal}
          title="Confirmation"
          message="What is the status of your case?"
          confirmText="Resolved"
          confirmText2="Unresolved"
          cancelText="No"
          isLoading={statusLoading}
        />
      </div>
    </div>
  );
};

export default page;
