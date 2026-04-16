"use client";

import React from "react";

const SearchInput = ({
  value,
  onChange,
  placeholder = "Search",
  className = "",
  wrapperClassName = "",
}) => {
  return (
    <div className={`relative flex-1 max-w-md ${wrapperClassName}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`max-w-full pl-10 pr-4 py-1 border border-gray-300 rounded-lg focus:border-primary-1 outline-none bg-white min-w-[100px] w-full md:w-[400px] ${className}`}
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </span>
    </div>
  );
};

export default SearchInput;
