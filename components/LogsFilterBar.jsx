// components/LogsFilterBar.jsx
"use client";
import React from "react";
import Button from "@/components/common/Button";
import { SlidersHorizontal, Calendar, Search } from "lucide-react";

export default function LogsFilterBar({ filter, setFilter, isLoading }) {
  const disabledUI = isLoading ? "opacity-60 pointer-events-none" : "";

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-6">
      <div className={`flex-1 max-w-[400px] relative ${disabledUI}`}>
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          disabled={isLoading}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-primary-1 outline-none bg-white"
        />
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className={`flex items-center gap-2 border py-2.5 text-gray-700 font-semibold hover:bg-gray-100 cursor-pointer shadow-xs ${disabledUI}`}
          disabled={isLoading}
        >
          <SlidersHorizontal size={16} />
          Filter
        </Button>
        {/* <Button
          type="button"
          variant="outline"
          className={`flex items-center gap-2 border py-2.5 text-gray-700 font-semibold hover:bg-gray-100 cursor-pointer shadow-xs ${disabledUI}`}
          disabled={isLoading}
        >
          <Calendar size={16} />
          Filter by date
        </Button> */}
      </div>
    </div>
  );
}
