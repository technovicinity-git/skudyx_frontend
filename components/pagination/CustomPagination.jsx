import { ArrowLeft, ArrowRight } from "lucide-react";
import React from "react";

const CustomPagination = ({
  page,
  totalPages,
  onPageChange,
  showPagination,
}) => {
  // Pagination logic
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, "ellipsis-left", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(
          1,
          "ellipsis-right",
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(1, "ellipsis-left", page, "ellipsis-right", totalPages);
      }
    }
    return pages;
  };

  return (
    <>
      {showPagination && totalPages > 1 && (
        <div className="p-4">
          <nav
            className="flex items-center justify-between gap-5 "
            aria-label="Pagination"
          >
            <button
              className="border border-gray-200 cursor-pointer rounded-lg px-2 lg:px-4 py-1.5 lg:py-2 text-gray-700 font-medium hover:bg-gray-100 flex items-center gap-2"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
            >
              <span>
                <ArrowLeft size={18} />
              </span>
              <span className="hidden md:block">Previous</span>
            </button>
            <div className="flex items-center gap-2">
              {getPageNumbers().map((p, idx) =>
                typeof p === "string" && p.startsWith("ellipsis") ? (
                  <span key={p + idx} className="px-2">
                    ...
                  </span>
                ) : (
                  <button
                    key={"page-" + p}
                    className={`rounded-lg px-2 lg:px-3 py-1 lg:py-2 text-sm font-medium cursor-pointer ${
                      p === page
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => onPageChange(p)}
                    disabled={p === page}
                  >
                    {p}
                  </button>
                )
              )}
            </div>
            <button
              className="border border-gray-200 cursor-pointer rounded-lg px-2 lg:px-4 py-1.5 lg:py-2 text-gray-700 font-medium hover:bg-gray-100 flex items-center gap-2"
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
            >
              <span className="hidden md:block">Next</span>
              <span>
                <ArrowRight size={18} />
              </span>
            </button>
          </nav>
        </div>
      )}
    </>
  );
};

export default CustomPagination;
