"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { RightArrowIcon } from "@/public/assets/icons/icons";

export default function DetailsHeader({ title, id = "", actions }) {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0  border-b border-gray-200 p-4 bg-gray-50 mb-4">
      <div className="flex items-center text-sm text-gray-600">
        <div className="cursor-pointer" onClick={() => router.back()}>
          {title}
        </div>

        <div>{RightArrowIcon}</div>
        <div>{id}</div>
      </div>

      <div>{actions}</div>
    </div>
  );
}
