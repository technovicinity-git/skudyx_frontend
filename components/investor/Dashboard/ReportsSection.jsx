"use client";

import React from "react";
import { MoreVertical } from "lucide-react";
import { PDFIcon } from "@/public/assets/icons/icons";
import EmptyState from "@/components/common/EmptyState";

const ReportsSection = () => {
  const reports = [
    {
      id: 1,
      title: "Project requirements.pdf",
      type: "PDF",
      date: "20.05.2023",
    },
    {
      id: 2,
      title: "Investment summary.pdf",
      type: "PDF",
      date: "18.05.2023",
    },
    {
      id: 3,
      title: "Portfolio report.pdf",
      type: "PDF",
      date: "15.05.2023",
    },
  ];

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6 gap-3 flex-wrap">
        <h2 className="text-lg font-semibold text-[#222222]">Reports</h2>
        <button className="px-3 py-1.5 md:px-4 md:py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors cursor-pointer">
          See All
        </button>
      </div>

      {/* Report Cards or Empty State */}
      {reports && reports.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white border border-gray-200 rounded-lg py-6 px-5 hover:shadow-md transition-shadow relative"
            >
              {/* More Options Button */}
              <button className="ml-auto block w-max text-gray-400 hover:text-gray-600 mb-8">
                <MoreVertical size={16} />
              </button>

              {/* PDF Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 flex items-center justify-center mb-5">
                  {PDFIcon}
                </div>
              </div>

              {/* File Name */}
              <h3 className="font-semibold text-base text-[#222222] text-center mb-8">
                {report.title}
              </h3>

              {/* Report Details */}
              <div className="flex justify-between gap-4 text-base ">
                <div className="">
                  <p className="text-[#828282] mb-1">Report Type</p>
                  <div className="text-[#4F4F4F]">{report.type}</div>
                </div>
                <div className="text-end">
                  <p className="text-[#828282] mb-1">Date:</p>
                  <div className="text-[#4F4F4F]">{report.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No reports found"
          description="You don't have any reports available at the moment."
        />
      )}
    </section>
  );
};

export default ReportsSection;
