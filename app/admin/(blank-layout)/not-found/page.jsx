"use client";
import {
  NotFoundIllustrationIcon,
  SearchIcon,
} from "@/public/assets/icons/icons";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

const NotFoundPageContent = () => {
  const searchParams = useSearchParams();
  const pageTitle = searchParams.get("title") || "Page";

  return (
    <div className="py-4 px-2 h-full">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-black mb-6">{pageTitle}</h1>

      {/* No Information Found Card */}
      <div className="bg-white rounded-xl shadow-sm border border-[#EAECF0] p-12 h-[90%] flex items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Icon Container */}
          <div className="relative mb-4">
            {/* Background shapes */}
            {NotFoundIllustrationIcon}

            {/* Magnifying glass icon */}
            <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2  w-12 h-12">
              {SearchIcon}
            </span>
          </div>

          {/* Text */}
          <p className="text-lg font-medium text-gray-900">
            No information found
          </p>
        </div>
      </div>
    </div>
  );
};

const NotFoundPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundPageContent />
    </Suspense>
  );
};

export default NotFoundPage;