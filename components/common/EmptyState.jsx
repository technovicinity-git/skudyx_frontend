import React from "react";
import {
  NotFoundIllustrationIcon,
  SearchIcon,
} from "@/public/assets/icons/icons";

const EmptyState = ({
  title = "No information found",
  description,
  className = "",
  showIcon = true,
}) => {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg shadow-sm px-10 py-16 ${className}`}
    >
      <div className="flex flex-col items-center justify-center text-center">
        {showIcon && (
          <div className="relative mb-4">
            {/* Background shapes */}
            {NotFoundIllustrationIcon}

            {/* Magnifying glass icon */}
            <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-12">
              {SearchIcon}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>

        {/* Description (optional) */}
        {description && <p className="text-gray-600 text-sm">{description}</p>}
      </div>
    </div>
  );
};

export default EmptyState;
