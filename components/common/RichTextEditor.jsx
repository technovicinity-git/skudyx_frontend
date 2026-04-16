"use client";
import React from "react";
import dynamic from "next/dynamic";

// Dynamically import TipTap components to avoid SSR issues
const TipTapEditor = dynamic(
  () => import("./TipTapEditor").then((mod) => ({ default: mod.default })),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white border border-gray-300 rounded-lg">
        <div className="flex items-center gap-2 p-4 border-b border-gray-200">
          <div className="px-3 py-1 border border-gray-300 rounded text-sm bg-transparent">
            Normal text
          </div>
          <div className="flex gap-2">
            <button className="p-1 hover:bg-gray-100 rounded font-bold">
              B
            </button>
            <button className="p-1 hover:bg-gray-100 rounded italic">I</button>
            <button className="p-1 hover:bg-gray-100 rounded font-bold text-base">
              H
            </button>
            <button className="p-1 hover:bg-gray-100 rounded font-bold text-sm">
              H
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">&quot;</button>
            <button className="p-1 hover:bg-gray-100 rounded">🔗</button>
            <button className="p-1 hover:bg-gray-100 rounded">🖼️</button>
            <button className="p-1 hover:bg-gray-100 rounded">•</button>
            <button className="p-1 hover:bg-gray-100 rounded">1.</button>
          </div>
        </div>
        <div className="p-4 min-h-[400px]">
          <div className="h-[350px] bg-gray-100 animate-pulse rounded"></div>
        </div>
      </div>
    ),
  },
);

const RichTextEditor = ({
  value = "",
  onChange = () => {},
  placeholder = "Enter content here...",
  className = "",
}) => {
  return (
    <TipTapEditor
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
    />
  );
};

export default RichTextEditor;
