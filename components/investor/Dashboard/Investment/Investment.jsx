"use client";

import React, { useState, useRef, useEffect } from "react";
import Card from "@/components/frontend/Card";
import Input from "@/components/common/Input";
import { useIntersectionObserver } from "@/components/frontend/language-context";
import { SearchIcon } from "lucide-react";
import { FilterIcon } from "@/public/assets/icons/icons";
import FilterPopup from "./FilterPopup";

import { useGetInvestmentPlans } from "@/hook/investmentPlan";
import CustomPagination from "@/components/pagination/CustomPagination";
import { useDebounce } from "@/hook/debounce";
import { formatDate } from "@/utils/formatDate";

const InvestmentBody = () => {
  const [activeCategory, setActiveCategory] = useState("Crops");
  const [searchQuery, setSearchQuery] = useState("");
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { isVisible, elementRef } = useIntersectionObserver();
  const [page, setPage] = useState(1);
  const [filteredPlans, setFilteredPlans] = useState(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const limit = 12;

  const cropsRef = useRef(null);
  const livestocksRef = useRef(null);

  const { investmentPlans, meta, isLoading } = useGetInvestmentPlans(
    page,
    limit,
    activeCategory === "Crops" ? "crop" : "livestock",
    debouncedSearchQuery,
    activeCategory === "Crops"
      ? filteredPlans?.cropType
      : filteredPlans?.livestockType,
    filteredPlans?.country,
    filteredPlans?.durationType,
    filteredPlans?.duration,
    filteredPlans?.projectedROI,
    filteredPlans?.riskLevel
  );

  // Calculate indicator position based on active tab
  useEffect(() => {
    const updateIndicatorPosition = () => {
      if (cropsRef.current && livestocksRef.current) {
        const container = cropsRef.current.parentElement;
        const containerRect = container.getBoundingClientRect();

        if (activeCategory === "Crops") {
          const cropsRect = cropsRef.current.getBoundingClientRect();
          const left = cropsRect.left - containerRect.left;
          const width = cropsRect.width;

          setIndicatorStyle({
            left: `${left - 1}px`,
            width: `${width}px`,
          });
        } else {
          const livestocksRect = livestocksRef.current.getBoundingClientRect();
          const left = livestocksRect.left - containerRect.left;
          const width = livestocksRect.width;

          setIndicatorStyle({
            left: `${left}px`,
            width: `${width}px`,
          });
        }
      }
    };

    updateIndicatorPosition();
    window.addEventListener("resize", updateIndicatorPosition);

    return () => window.removeEventListener("resize", updateIndicatorPosition);
  }, [activeCategory]);

  // Prevent body scroll when filter popup is open
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isFilterOpen]);

  return (
    <div className="min-h-screen bg-[#FCFCFD]">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#19202C] mb-6 md:mb-10">
          Investment opportunities
        </h1>

        {/* Category Tabs and Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Category Tabs */}
          <div className="flex bg-white border border-[#EAECF0] rounded-lg relative overflow-hidden">
            {/* Animated Sliding Indicator */}
            <div
              className="absolute top-0 bottom-0 bg-primary-1/10 transition-all duration-300 ease-in-out"
              style={indicatorStyle}
            />

            <button
              ref={cropsRef}
              onClick={() => setActiveCategory("Crops")}
              className={`relative px-4 py-2 rounded-md text-sm transition-all duration-200 z-10 cursor-pointer ${
                activeCategory === "Crops"
                  ? "text-primary-1 text-shadow-sm"
                  : "text-gray-700"
              }`}
            >
              Crops
            </button>
            <button
              ref={livestocksRef}
              onClick={() => setActiveCategory("Livestocks")}
              className={`relative px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 z-10 cursor-pointer ${
                activeCategory === "Livestocks"
                  ? "text-primary-1 text-shadow-sm"
                  : "text-gray-700"
              }`}
            >
              Livestocks
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-3 w-full sm:w-auto">
            {/* Search Bar */}
            <div className="relative flex-1 sm:flex-initial">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <div className="w-5 h-5 text-[#6B7280]">
                  <SearchIcon size={20} />
                </div>
              </div>
              <Input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="!pl-10 w-full sm:w-64"
              />
            </div>

            {/* Filters Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 bg-white border border-[#EAECF0] rounded-lg text-[#19202C] font-medium text-sm transition-colors duration-200 cursor-pointer hover:bg-gray-50"
            >
              {FilterIcon}
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Investment Cards Grid */}
      <div
        ref={elementRef}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6"
      >
        {investmentPlans?.map((plan, idx) => (
          <div
            key={idx}
            className={`transition-all duration-1000 ease-out`}
            style={{
              transitionDelay: `${400 + idx * 200}ms`,
              transform: isVisible ? "translateY(0)" : "translateY(50px)",
              opacity: isVisible ? 1 : 0,
            }}
          >
            {isLoading ? (
              <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
            ) : (
              <Card
                title={plan?.name}
                images={plan?.propertyImages}
                minInvestment={plan?.slotsAvailable}
                riskLevel={plan?.riskLevel}
                returns={plan?.roi}
                maturity={formatDate(plan?.matureDate)}
                status={plan?.status}
                url={`/investor/investment/${plan._id}`}
                location={plan?.location}
              />
            )}
          </div>
        ))}
      </div>
      {/* Pagination */}
      <CustomPagination
        page={page}
        totalPages={meta?.totalPages}
        onPageChange={(p) => setPage(p)}
        showPagination={!isLoading || meta?.totalPages > 1}
      />

      {/* No Results Message */}
      {!isLoading && investmentPlans.length === 0 && (
        <div className="text-center py-12">
          <div className="text-[#6B7280] text-lg font-medium mb-2">
            No investment opportunities found
          </div>
          <p className="text-[#9CA3AF] text-sm">
            Try adjusting your search criteria or category filter
          </p>
        </div>
      )}

      {/* Filter Popup */}
      <FilterPopup
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        activeCategory={activeCategory}
        setFilteredPlans={setFilteredPlans}
      />
    </div>
  );
};

export default InvestmentBody;
