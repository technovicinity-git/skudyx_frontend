"use client";

import Image from "next/image";
import { useRef } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { RxCross2 } from "react-icons/rx";

import Button from "@/components/common/Button";
import Label from "@/components/common/Label";
import { useUpdateActivity } from "@/hook/activities";
import { useToast } from "@/lib/Provider/toastProvider";
import useUpdateActivitiesStore from "@/store/useUpdateActivitiesStore";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const ActivitiesUpdateModal = ({ isOpen, onClose, role }) => {
  const fileInputRef = useRef(null);
  const { id } = useParams();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { formData, updateField, removeImage, resetForm } =
    useUpdateActivitiesStore();
  const { updateActivity, isLoading, errorMessage } = useUpdateActivity();
  const images = formData.images;

  const handleFiles = (selectedFiles) => {
    const newImages = Array.from(selectedFiles).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    const updated = [...images, ...newImages].slice(0, 10);
    updateField("images", updated);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (index) => {
    removeImage(index);
  };

  const handleUpdate = () => {
    const formDataToSend = new FormData();

    // append title, date, etc.
    formDataToSend.append("title", formData.title);
    formDataToSend.append("date", new Date());
    if (role === "farmer") {
      formDataToSend.append("farmer_request", true);
    }
    formDataToSend.append("note", formData.note);
    // append only binary images
    formData.images.forEach((imgObj) => {
      formDataToSend.append("images", imgObj.file);
    });
    updateActivity(
      {
        id,
        index: formData.index,
        data: formDataToSend,
      },
      {
        onSuccess: () => {
          resetForm();
          onClose();
          showToast("Activity updated successfully", "success", "Success");
          queryClient.invalidateQueries({ queryKey: ["activity", id] });
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black cursor-pointer"
        >
          <RxCross2 size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-6">Upload Property</h2>

        {/* Title */}
        <div className="mb-5">
          <Label htmlFor="title">Title</Label>
          <input
            id="title"
            type="text"
            value={formData.title || ""}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Enter title"
            className="text-base bg-white w-full px-3.5 py-3 border border-[#D0D5DD] rounded-lg mt-1"
            required
            disabled={role === "farmer"}
          />
        </div>

        {/* Date */}

        {/* <div className="flex flex-col relative mb-6">
            <Label htmlFor="start-date">Start Date</Label>
            <DatePicker
              selected={formData.startDate || null}
              onChange={(date) => updateField("startDate", date)}
              id="start-date"
              placeholderText="Select date"
              className="text-base bg-white w-full px-3.5 py-3 border border-[#D0D5DD] rounded-lg"
              required
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={100}
              showMonthDropdown
              dropdownMode="select"
            />
            <CiCalendar className="size-6 absolute right-3.5 bottom-3 pointer-events-none text-gray-500" />
          </div> */}

        {/* Hidden Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />

        {/* Upload UI */}
        {images.length === 0 ? (
          <div
            className="dashed-border rounded-sm w-full bg-white py-14 px-6 text-center cursor-pointer flex flex-col items-center justify-center"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='4' ry='4' stroke='%23ACB2BCFF' strokeWidth='1' stroke-dasharray='14%2c 9' stroke-dashoffset='8' strokeLinecap='square'/%3e%3c/svg%3e\")",
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <Image
              src="/assets/icons/image-upload.png"
              alt="upload"
              width={32}
              height={32}
              className="size-8"
            />
            <p className="text-xs text-[#717171] mt-2.5">
              Drag and drop or <span className="underline">browse</span>
            </p>
          </div>
        ) : (
          <div className="bg-white px-4 py-6 rounded-sm border border-[#D0D5DD]">
            <p className="text-[13px] text-[#4f4f4f] mb-4">
              Upload at least 1 image
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {/* Add Photos */}
              <div
                onClick={handleClick}
                className="aspect-square rounded-lg border border-[#D0D5DD] flex flex-col items-center justify-center hover:bg-gray-50 cursor-pointer"
              >
                <Image
                  src="/assets/icons/image-upload.png"
                  alt="Add"
                  width={32}
                  height={32}
                  className="opacity-50"
                />
                <p className="text-xs text-[#4F4F4F] mt-1">Add Photo</p>
              </div>

              {/* Uploaded Images */}
              {images.map((img, idx) => (
                <div key={idx} className="relative rounded-lg overflow-hidden">
                  <Image
                    src={img.preview}
                    alt="uploaded"
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover aspect-square rounded-lg"
                  />
                  <button
                    onClick={() => handleRemove(idx)}
                    className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-white cursor-pointer"
                  >
                    <RxCross2 />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col mt-4">
          <Label htmlFor="note">Note</Label>
          <textarea
            id="note"
            name="note"
            value={formData.note}
            onChange={(e) => updateField("note", e.target.value)}
            className="text-base text-[#222222] placeholder-[#45556c] bg-white px-3.5 py-3 outline-none border border-[#D0D5DD] focus:border-primary-0 rounded-lg shadow-[0_1px_2px_0_#1018280D] transition-colors duration-300 resize-none h-[220px]"
          />
        </div>

        {errorMessage && (
          <p className=" text-red-500 p-2 bg-red-100 border border-red-400 mt-3">
            {errorMessage}
          </p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button variant="solid" disabled={isLoading} onClick={handleUpdate}>
            {isLoading ? "Updating..." : "Update"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesUpdateModal;
