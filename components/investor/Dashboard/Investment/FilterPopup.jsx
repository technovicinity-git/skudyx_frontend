"use client";

import React, { useState } from "react";
import { CheckIcon, XIcon } from "lucide-react";
import { RightArrowIcon } from "@/public/assets/icons/icons";
import { countries } from "@/utils/country";
import { useGetPlanTypes } from "@/hook/planTypes";

const FilterPopup = ({ isOpen, onClose, activeCategory, setFilteredPlans }) => {
  const [filters, setFilters] = useState({
    cropType: [],
    livestockType: [],
    country: "",
    durationType: "monthly",
    duration: "",
    projectedROI: "",
    riskLevel: "",
  });

  const page = 1;
  const limit = 100000;

  const { planTypes: cropTypes } = useGetPlanTypes(page, limit, "crop");
  const { planTypes: livestockTypes } = useGetPlanTypes(
    page,
    limit,
    "livestock"
  );

  // Filter options data
  const filterOptions = {
    cropType: cropTypes?.map((type) => type.name) || [],
    livestockType: livestockTypes?.map((type) => type.name) || [],
    durationType: ["monthly", "yearly"],
    durationMonthly: [
      "3",
      "6",
      "9",
      "12",
      "15",
      "18",
      "21",
      "24",
      "27",
      "30",
      "33",
    ],
    durationYearly: ["1", "2", "3", "4", "5", "6", "9"],
    projectedROI: ["7", "10", "12.5", "15", "20", "22.5"],
    riskLevel: ["low", "medium", "high"],
  };

  // Custom checkbox (for multi-select)
  const CustomCheckbox = ({ id, label, checked, onChange, className = "" }) => (
    <label className={`flex items-center gap-3 cursor-pointer ${className}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <div
        className={`w-5 h-5 border rounded flex items-center justify-center transition-all duration-200 ${
          checked
            ? "bg-primary-1 border-primary-1"
            : "border-gray-300 hover:border-primary-1"
        }`}
      >
        {checked && <CheckIcon size={14} className="text-white" />}
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );

  // Custom radio (for single-select)
  const CustomRadio = ({ id, label, checked, onChange, className = "" }) => (
    <label className={`flex items-center gap-3 cursor-pointer ${className}`}>
      <input
        type="radio"
        id={id}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <div
        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200 ${
          checked
            ? "bg-primary-1 border-primary-1"
            : "border-gray-300 hover:border-primary-1"
        }`}
      >
        {checked && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );

  // Handle checkbox changes (multi-select)
  const handleCheckboxChange = (category, value) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }));
  };

  // Handle radio changes (single-select)
  const handleRadioChange = (category, value) => {
    setFilters((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  // Handle reset all filters
  const handleResetFilters = () => {
    setFilters({
      cropType: [],
      livestockType: [],
      country: "",
      investmentDuration: "",
      projectedROI: "",
      riskLevel: "",
    });
  };

  // Handle apply filters
  const handleApplyFilters = () => {
    setFilteredPlans(filters);
    onClose();
  };

  // Filter section for multi-select
  const MultiFilterSection = ({ title, options, category }) => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        <button
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              [category]: filterOptions[category],
            }))
          }
          className="text-sm text-[#020618] hover:text-primary-1 transition-colors duration-200 flex items-center gap-1"
        >
          All
          <span>{RightArrowIcon}</span>
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <CustomCheckbox
            key={option}
            id={`${category}-${option}`}
            label={option}
            checked={filters[category].includes(option)}
            onChange={() => handleCheckboxChange(category, option)}
          />
        ))}
      </div>
    </div>
  );

  // Filter section for single-select
  const SingleFilterSection = ({ title, options, category }) => (
    <div className="mb-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="grid grid-cols-2 gap-3">
        {options?.map((option) => (
          <CustomRadio
            key={option}
            id={`${category}-${option}`}
            label={option}
            checked={filters[category] === option}
            onChange={() => handleRadioChange(category, option)}
          />
        ))}
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 bg-opacity-50 z-50"
        onClick={onClose}
      />

      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-[720px] max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-6 ">
            <h2 className="text-xl font-semibold text-[#222222]">Filters</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 text-gray-500 hover:text-[#222222] rounded-lg transition-colors duration-200 cursor-pointer"
            >
              <XIcon size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 md:p-6 overflow-y-auto flex-1">
            {activeCategory === "Crops" ? (
              <MultiFilterSection
                title="Crop Type"
                options={filterOptions.cropType}
                category="cropType"
              />
            ) : (
              <MultiFilterSection
                title="Livestock Type"
                options={filterOptions.livestockType}
                category="livestockType"
              />
            )}

            {/* Country */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Country
              </h3>
              <select
                value={filters.country}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, country: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-1 focus:border-transparent"
              >
                <option value="">Select country</option>
                {countries.map((country, idx) => (
                  <option key={idx} value={country.name.toLowerCase()}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Investment Duration */}
            <SingleFilterSection
              title="Duration Type"
              options={filterOptions.durationType}
              category="durationType"
            />

            {/* Investment Duration */}
            <SingleFilterSection
              title="Investment Duration up to"
              options={
                filters.durationType === "monthly"
                  ? filterOptions.durationMonthly
                  : filterOptions.durationYearly
              }
              category="duration"
            />

            {/* Projected ROI */}
            <SingleFilterSection
              title="Projected ROI up to (%)"
              options={filterOptions.projectedROI}
              category="projectedROI"
            />

            {/* Risk Level */}
            <SingleFilterSection
              title="Risk Level"
              options={filterOptions.riskLevel}
              category="riskLevel"
            />

            {/* Footer */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleResetFilters}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors duration-200"
              >
                Reset Filters
              </button>
              <button
                onClick={handleApplyFilters}
                className="px-6 py-2 bg-primary-1 text-white rounded-lg font-medium hover:bg-primary-1/90 transition-colors duration-200"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPopup;
