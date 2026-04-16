"use client";

import React, { useState } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { ChartJS } from "@/lib/chartConfig";
import { Info } from "lucide-react";
import {
  useGetInvestmentInsights,
  useGetInvestmentProgress,
  useGetInvestorActivity,
  useGetFarmPerformance,
  useGetKYCSummary,
  useGetTopInvestmentCategories,
} from "@/hook/analytics";
import { useMemo } from "react";
import { formatMoney } from "@/utils/formatMoney";
import CustomPagination from "@/components/pagination/CustomPagination";

const Analytics = () => {
  const [filter, setFilter] = useState("week");
  const [investFilter, setInvestFilter] = useState("daily");
  const [kycFilter, setKycFilter] = useState("week");
  const [year, setYear] = useState(new Date().getFullYear());
  const [performancePage, setPerformancePage] = useState(1);

  // Fetch Investment Insights Data
  const { insights, isLoading } = useGetInvestmentInsights(year, investFilter);
  const { progress } = useGetInvestmentProgress();
  const { activity } = useGetInvestorActivity();
  const { performance, isLoading: isLoadingPerformance ,meta: performanceMeta } =
    useGetFarmPerformance(performancePage, filter);
  const { summary, isLoading: isLoadingSummary } = useGetKYCSummary(kycFilter);
  const { categories } = useGetTopInvestmentCategories();
  // console.log("Top Investment filter:", filter);



  const investmentInsightsData = useMemo(() => {
    if (!insights || insights.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    const labels = insights.map((item) => item.base); // ["Jan", "Feb", ...]
    const data = insights.map((item) => item.total / 1000); // [0, 0, 0, ...]

    return {
      labels,
      datasets: [
        {
          label: "Investment Volume",
          data,
          borderColor: "#236647",
          backgroundColor: "rgba(35, 102, 71, 0.1)",
          tension: 0.4,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 0,
          pointBackgroundColor: "transparent",
          pointBorderColor: "transparent",
        },
      ],
    };
  }, [insights, investFilter, year]);

  const maxTotal = useMemo(() => {
    if (!insights || insights.length === 0) return 10;
    const maxValue =
      Math.max(...insights.map((item) => item.total / 1000)) || 10;
    return Math.min(maxValue); // cap at 1.5
  }, [insights]);
  // console.log("Top Investment maxTotal:", maxTotal);
  const investmentInsightsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false, // Enable tooltip on hover anywhere on the line
      mode: "index", // Show tooltip for all datasets at the same index
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1E3A8A",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        displayColors: false,
        callbacks: {
          label: function (context) {
            return `$${context.parsed.y.toLocaleString()}K`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6B7280",
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        max: maxTotal,
        grid: {
          color: "#F3F4F6",
        },
        ticks: {
          color: "#6B7280",
          font: {
            size: 12,
          },
          callback: function (value) {
            return `$${value}K`;
          },
        },
      },
    },
  };

  const labels = ["Completed", "Open", "Draft", "Matured", "Cancelled"];

  const progressMapping = {
    Completed: progress?.closed ?? 0,
    Open: progress?.open ?? 0,
    Draft: progress?.draft ?? 0,
    Matured: progress?.matured ?? 0,
    Cancelled: progress?.canceled ?? 0,
  };

  const investmentProgressData = {
    labels,
    datasets: [
      {
        data: labels.map((label) => progressMapping[label]),
        backgroundColor: [
          "#3FCD7F",
          "#FACF4C",
          "#E94C7B",
          "#236647",
          "#A3E1CB",
        ],
        borderWidth: 0,
        cutout: "70%",
        rotation: 80,
      },
    ],
  };

  const investmentProgressOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1E3A8A",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.parsed}%`;
          },
        },
      },
    },
  };

  // Top Investment Category Chart Data
  const topCategoryData = {
    labels: categories?.map((item) => item.crop_live) || [
      "Maize",
      "Rice",
      "Cassava",
    ],
    datasets: [
      {
        data: categories?.map((item) => item.totalInvestment / 10000) || [
          85, 65, 45,
        ],
        backgroundColor: ["#236647", "#236647", "#236647"],
        borderWidth: 0,
        borderRadius: 4,
      },
    ],
  };

  const topCategoryOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1E3A8A",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        callbacks: {
          label: function (context) {
            return `$${context.parsed.x.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          color: "#6B7280",
          font: {
            size: 12,
          },
          callback: function (value) {
            return `$${value}K`;
          },
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6B7280",
          font: {
            size: 12,
          },
          callback: function (value, index) {
            const amounts = topCategoryData.datasets[0].data;
            const label = topCategoryData.labels[index];
            return `${label} ($${amounts[index].toLocaleString()}K)`;
          },
        },
        position: "right",
      },
    },
  };

  // Compliance & KYC Summary Data
  const complianceData = [
    { metric: "New KYC Requests", value: summary?.newKycRequests ?? "0" },
    { metric: "Approved", value: summary?.approved ?? "0" },
    { metric: "Rejected", value: summary?.rejected ?? "0" },
    { metric: "Pending", value: summary?.pending ?? "0" },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          {/* <div className="flex items-center gap-2 mt-2">
            <Calendar size={16} className="text-gray-500" />
            <span className="text-gray-600">{dateRange}</span>
          </div> */}
        </div>
        {/* <Button variant="outline" className="flex items-center gap-2">
          <Download size={16} />
          Export as CSV
        </Button> */}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-3">
          {/* Investment Insights */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Investment Insights
                </h3>
                <p className="text-sm text-gray-600">
                  {/* Monthly Investment Volume (Last 12 Months) */}
                </p>
              </div>
              {/* <Button variant="outline" className="flex items-center gap-2">
                Filter
                <ChevronDown size={16} />
              </Button> */}
              <div className="flex space-x-2">
                {investFilter === "month" && (
                  <div className="flex items-center gap-2">
                    <select
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    >
                      {Array.from({ length: 5 }).map((_, i) => {
                        const y = new Date().getFullYear() - i; // last 5 years
                        return (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        );
                      })}
                    </select>
                    {/* <ChevronDown size={16} className="text-gray-500" /> */}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <select
                    value={investFilter}
                    onChange={(e) => setInvestFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option>daily</option>
                    <option>week</option>
                    <option>month</option>
                    <option>year</option>
                  </select>
                  {/* <ChevronDown size={16} className="text-gray-500" /> */}
                </div>
              </div>
            </div>
            <div className="h-64">
              {isLoading ? (
                <p>Loading chart...</p>
              ) : (
                <Line
                  options={investmentInsightsOptions}
                  data={investmentInsightsData}
                />
              )}
            </div>
          </div>

          {/* Farm Performance Table */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Farm Performance Table
              </h3>
              <div className="flex items-center gap-2">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option>week</option>
                  <option>month</option>
                  <option>year</option>
                </select>
                {/* <ChevronDown size={16} className="text-gray-500" /> */}
              </div>
            </div>
            {isLoadingPerformance ? (
              <p>Loading chart...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Name of farm
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Number of investors
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Total amount Invested
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {performance?.map((farm, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-900">
                          {farm.farmName}
                        </td>
                        <td className="py-3 px-4 text-gray-900">
                          {farm.totalInvestors}
                        </td>
                        <td className="py-3 px-4 text-gray-900">
                          {formatMoney(farm.totalInvested)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              farm.status === "Verified"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {farm.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <CustomPagination
                  currentPage={performancePage}
                  totalPages={performanceMeta?.totalPages}
                  onPageChange={(page) => setPerformancePage(page)}
                  showPagination={performanceMeta?.totalPages > 1}
                />
              </div>
            )}
          </div>

          {/* Compliance & KYC Summary */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Compliance & KYC Summary
              </h3>
              <div className="flex items-center gap-2">
                <select
                  value={kycFilter}
                  onChange={(e) => setKycFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option>week</option>
                  <option>month</option>
                  <option>year</option>
                </select>
                {/* <ChevronDown size={16} className="text-gray-500" /> */}
              </div>
            </div>
            {isLoadingSummary ? (
              <p>Loading chart...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Metric
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {complianceData.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-900">
                          {item.metric}
                        </td>
                        <td className="py-3 px-4 text-gray-900 font-semibold">
                          {item.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Investment Progress */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Investment Progress
              </h3>
              <Info size={16} className="text-primary-1" />
            </div>
            <div className="h-64 mb-4">
              <Doughnut
                options={investmentProgressOptions}
                data={investmentProgressData}
              />
            </div>
            <div className="flex gap-2 items-start justify-between">
              <div className="">
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 bg-[#3FCD7F] rounded-full"></div>
                  <div>
                    <p className="text-sm text-gray-700">Completed</p>
                    <span className="text-sm font-semibold text-gray-900">
                      {progress?.closed ?? 0}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 bg-[#FACF4C] rounded-full"></div>
                  <div>
                    <p className="text-sm text-gray-700">In Progress</p>
                    <span className="text-sm font-semibold text-gray-900">
                      {progress?.open ?? 0}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 bg-[#236647] rounded-full"></div>
                  <div>
                    <p className="text-sm text-gray-700">Matured</p>
                    <span className="text-sm font-semibold text-gray-900">
                      {progress?.matured ?? 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Investor Activity & Behavior */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Investor Activity & Behavior
              </h3>
              <Info size={16} className="text-primary-1" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Active Investors</span>
                <span className="font-semibold text-gray-900">
                  {activity?.totalActiveInvestors ?? 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">
                  Avg Investment Amount per User
                </span>
                <span className="font-semibold text-gray-900">
                  {formatMoney(activity?.avgInvestmentAmountPerUser ?? 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">
                  Repeat Investors (2+ projects)
                </span>
                <span className="font-semibold text-gray-900">
                  {activity?.repeatInvestors ?? 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Top Investment Category</span>
                <span className="font-semibold text-gray-900">
                  {activity?.topInvestmentCategories ?? "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Top Investment Category */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Top Investment category
                </h3>
                <Info size={16} className="text-primary-1" />
              </div>
              {/*<div className="flex items-center gap-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option>Amount</option>
                  <option>Count</option>
                  <option>Percentage</option>
                </select>
              </div> */}
            </div>
            <div className="h-64">
              <Bar options={topCategoryOptions} data={topCategoryData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
