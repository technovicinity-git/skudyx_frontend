import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const MetricCard = ({ title, value, linkText, linkHref }) => {
  return (
    <div className="bg-white p-4 lg:p-6 rounded-xl shadow-xs border border-gray-200 ">
      <div className="flex justify-between items-end w-full h-full">
        <div className="flex flex-col h-full justify-between">
          <p className="text-gray-900 text-base font-medium mb-4">{title}</p>
          <p className="text-2xl md:text-[32px] font-semibold text-secondary mt-auto">
            {value}
          </p>
        </div>
        {linkText && (
          <Link
            href={linkHref}
            className="text-primary-1 text-base font-medium flex items-center gap-1 group  whitespace-nowrap"
          >
            {linkText}
            <span aria-hidden="true">
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-all duration-300"
              />
            </span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
