"use client";

import GalleryPopup from "@/components/admin/dashboard/FarmDetails/GalleryPopup";
import { useUpdateActivity } from "@/hook/activities";
import { useToast } from "@/lib/Provider/toastProvider";
import { CheckIcon, ImgIcon } from "@/public/assets/icons/icons";
import useUpdateActivitiesStore from "@/store/useUpdateActivitiesStore";
import { formatDate } from "@/utils/formatDate";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import Button from "../Button";
import ActivitiesUpdateModal from "./ActivitiesUpdateModal";
import NoteModal from "./NoteModal";

const Activities = ({ activities, role = "" }) => {
  const { id } = useParams();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [isNoteOpen, setIsOpenNote] = useState(false);
  const [note, setNote] = useState("");

  const { updateField } = useUpdateActivitiesStore();
  const { updateActivity, isLoading, errorMessage } = useUpdateActivity();

  const handleSeeAllImages = (images) => {
    setImages(images);
    setIsGalleryOpen(true);
  };

  console.log(role);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleViewNote = (note) => {
    setNote(note);
    setIsOpenNote(true);
  };

  const handleApprove = (index) => {
    const data = new FormData();
    data.append("admin_approved", true);
    updateActivity(
      { id, index, data },
      {
        onSuccess: () => {
          showToast("Activity approved successfully", "success", "Success");
          queryClient.invalidateQueries({ queryKey: ["activity", id] });
        },
      }
    );
  };
  return (
    <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Activities</h3>
      </div>

      <div className="relative">
        <div className="space-y-4 xl:space-y-6">
          {activities?.map((activity, index) => {
            const isCompleted = activity.completed;
            const isPending = !activity.completed;
            // const isFuture = activity.status === "future";

            // Determine line color based on status
            let lineColor = "bg-gray-200";
            if (isCompleted) {
              lineColor = "bg-primary-1";
            } else if (isPending) {
              lineColor = "bg-gray-200";
            }

            return (
              <div key={index} className="relative flex items-start gap-4">
                {/* Status indicator */}
                <div className="flex-shrink-0 relative z-10">
                  {isCompleted ? (
                    <div className="w-6 h-6 bg-primary-1 rounded-full flex items-center justify-center">
                      {CheckIcon}
                    </div>
                  ) : isPending ? (
                    <div className="w-6 h-6 border-2 border-primary-1 rounded-full flex items-center justify-center bg-white">
                      <div className="w-2 h-2 bg-primary-1 rounded-full"></div>
                    </div>
                  ) : (
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center bg-white">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="flex justify-between">
                    <p className="font-medium text-gray-900">
                      {activity?.title}
                    </p>
                    <div className="flex gap-4">
                      {role === "investor" && !activity?.admin_approved ? (
                        <></>
                      ) : (
                        activity?.images?.length > 0 && (
                          <div
                            className="flex cursor-pointer p-2 rounded-md border border-gray-200 text-blue-900"
                            onClick={() => handleSeeAllImages(activity?.images)}
                          >
                            <span>{ImgIcon}</span>
                            See all photos
                          </div>
                        )
                      )}
                      {activity?.note && (
                        <Button
                          variant="outline"
                          onClick={() => handleViewNote(activity?.note)}
                        >
                          View Note
                        </Button>
                      )}
                      {((role === "farmer" && activity?.completed === false) ||
                        role === "admin") && (
                        <Button
                          variant="solid"
                          onClick={() => {
                            setIsOpen(true);
                            updateField("index", index + 1);
                            updateField("title", activity?.title || "");
                          }}
                        >
                          Update
                        </Button>
                      )}
                      {role === "admin" &&
                        !activity?.completed &&
                        activity?.farmer_request && (
                          <Button
                            variant="solid"
                            onClick={() => {
                              handleApprove(index + 1);
                            }}
                            disabled={isLoading}
                          >
                            Approve
                          </Button>
                        )}
                    </div>
                  </div>
                  {role === "investor" && !activity?.admin_approved ? (
                    <div></div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-1">
                      {activity?.date ? formatDate(activity?.date) : "Pending"}
                    </p>
                  )}
                </div>

                {/* Connecting line */}
                {index < activities.length - 1 && (
                  <div
                    className={`absolute left-3 w-0.5 h-[calc(100%-8px)] ${lineColor}`}
                    style={{ top: "28px" }}
                  ></div>
                )}
              </div>
            );
          })}
        </div>
        <div>
          {errorMessage && (
            <p className="p-2 text-red-500 bg-red-100 border border-red-400">
              {errorMessage}
            </p>
          )}
        </div>
        <ActivitiesUpdateModal
          isOpen={isOpen}
          onClose={handleClose}
          role={role}
        />
        <NoteModal
          isOpen={isNoteOpen}
          onClose={() => setIsOpenNote(false)}
          note={note}
        />
      </div>
      <GalleryPopup
        images={images || []}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />
    </div>
  );
};

export default Activities;
