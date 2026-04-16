import Button from "@/components/common/Button";
import { LeftArrowIcon, RightArrowIcon } from "@/public/assets/icons/icons";
import { SlidersHorizontal } from "lucide-react";

const Table = ({
  columns = [],
  data = [],
  showFilter = false,
  filterValue = "",
  onFilterChange = () => {},
  showPagination = false,
  pagination = { page: 1, totalPages: 1, onPageChange: () => {} },
  limit = 20,
  isLoading = false,
  wrapperText,
}) => {
  // Pagination logic
  const { page, totalPages, onPageChange } = pagination;
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
          totalPages,
        );
      } else {
        pages.push(1, "ellipsis-left", page, "ellipsis-right", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="bg-white overflow-hidden rounded-b-xl shadow-xs border border-gray-200">
      {showFilter && (
        <div className="flex justify-between items-center p-4 gap-4">
          {wrapperText !== undefined ? (
            <div className="flex justify-between items-center gap-4 w-full flex-wrap">
              <div className="text-lg md:text-[14px] font-semibold whitespace-nowrap text-[#222222]">
                {wrapperText}
              </div>
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Search"
                    value={filterValue}
                    onChange={(e) => onFilterChange(e.target.value)}
                    className="max-w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-primary-1 outline-none bg-white min-w-[100px] w-full md:w-[400px]"
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
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center gap-2 border py-2.5 text-gray-700 font-semibold hover:bg-gray-100 cursor-pointer shadow-xs"
                >
                  <SlidersHorizontal size={16} />
                  <span className="hidden sm:block">Filters</span>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="relative ">
                <input
                  type="text"
                  placeholder="Search"
                  value={filterValue}
                  onChange={(e) => onFilterChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg  focus:border-primary-1 outline-none bg-white"
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
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2 border py-2 text-gray-700 font-semibold hover:bg-gray-100 cursor-pointer shadow-xs"
              >
                <SlidersHorizontal size={16} />
                Filters
              </Button>
            </>
          )}
        </div>
      )}
      <div className="overflow-x-auto grid grid-cols-1 [scrollbar-width:thin]">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col.accessor || idx}
                  className="p-3 text-left text-[14px] font-semibold text-gray-600 bg-[#F9F9F9] whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Skeleton rows
              Array.from({ length: limit }).map((_, rowIdx) => (
                <tr
                  key={`skeleton-${rowIdx}`}
                  className="border-b border-gray-200"
                >
                  {columns?.map((_, colIdx) => (
                    <td key={colIdx} className="px-3 py-1 lg:p-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data?.length === 0 ? (
              <tr>
                <td
                  colSpan={columns?.length}
                  className="p-4 text-center text-gray-400"
                >
                  No data found.
                </td>
              </tr>
            ) : (
              data?.map((row, rowIdx) => (
                <tr key={rowIdx} className="border-b border-gray-200">
                  {columns?.map((col, colIdx) => (
                    <td
                      key={col?.accessor || colIdx}
                      className="px-3 py-1 lg:p-3 text-gray-800 text-[14px] whitespace-nowrap"
                    >
                      {col?.render ? col?.render(row) : row[col?.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showPagination && totalPages > 1 && (
        <div className="px-4 py-2 flex flex-col md:flex-row items-center justify-between">
          <nav className="flex items-center gap-2 " aria-label="Pagination">
            <button
              className=" cursor-pointer rounded-lg px-1 lg:px-1 py-1 lg:py-2 text-gray-700 font-medium hover:bg-gray-100 flex items-center"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
            >
              <span>{LeftArrowIcon}</span>
              <span className="hidden md:block"></span>
            </button>
            <div className="flex items-center gap-1">
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
                ),
              )}
            </div>
            <button
              className="mr-20 cursor-pointer rounded-lg px-1 lg:px-1 py-1 lg:py-2 text-gray-700 font-medium hover:bg-gray-100 flex items-center"
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
            >
              <span className="hidden md:block"></span>
              <span>{RightArrowIcon}</span>
            </button>
          </nav>
          <div className=" text-[#8A8A8A]">
            {" "}
            Page {page} of {totalPages}
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
