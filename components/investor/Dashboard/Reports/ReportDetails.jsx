"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Download } from "lucide-react";
import {
  NotFoundIllustrationIcon,
  PDFIcon,
  XLSIcon,
} from "@/public/assets/icons/icons";
import { useGetReportByPlanId } from "@/hook/report";
import Loader from "@/components/loader/Loader";
import { formatDate } from "@/utils/formatDate";

const ReportDetails = () => {
  const params = useParams();
  const router = useRouter();
  // const planId = decodeURIComponent(params.id);
  const planId = params.id;

  const FileIcon = ({ type }) => {
    if (type == "XLSX") {
      return XLSIcon;
    }
    if (type == "PDF") {
      return PDFIcon;
    }
    if (type == "JPG") {
      return PDFIcon;
    }
    return PDFIcon;
  };

  const { reportByPlan, isLoading } = useGetReportByPlanId(planId);

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-[#42526E] font-medium text-base underline mb-6"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.5 12.5L5.5 8L10.5 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl lg:text-2xl font-semibold text-[#222222] mb-2">
          Reports
        </h1>
      </div>

      {reportByPlan?.length === 0 && (
        <div className="flex flex-col justify-center items-center h-full">
          {NotFoundIllustrationIcon}
          <p>No reports found.</p>
        </div>
      )}

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-6">
        {reportByPlan?.map((doc, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg py-6 px-5 hover:shadow-md transition-shadow relative"
          >
            {/* More Options Button */}
            {/* <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <MoreVertical size={16} />
            </button> */}
            <button
              onClick={async () => {
                try {
                  const fileUrl = doc?.files?.[0];
                  if (!fileUrl) return;

                  const response = await fetch(fileUrl);
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);

                  const link = document.createElement("a");
                  link.href = url;
                  link.download = doc.title || "download";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(url);
                } catch (error) {
                  console.error("Download failed:", error);
                }
              }}
              className="absolute top-4 right-4 p-2 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              <Download size={16} className="text-gray-600" />
            </button>

            {/* File Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 flex items-center justify-center mb-5">
                <FileIcon type={doc.type} />
              </div>
            </div>

            {/* File Name */}
            <h3 className="font-semibold text-base text-[#222222] text-center mb-8">
              {doc.title}
            </h3>

            {/* Report Details */}
            <div className="flex justify-between gap-4 text-base">
              <div>
                <p className="text-[#828282] mb-1">Report Type:</p>
                <div className="text-[#4F4F4F]">{doc.type.toUpperCase()}</div>
              </div>
              <div className="text-end">
                <p className="text-[#828282] mb-1">Date:</p>
                <div className="text-[#4F4F4F]">{formatDate(doc.date)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportDetails;
