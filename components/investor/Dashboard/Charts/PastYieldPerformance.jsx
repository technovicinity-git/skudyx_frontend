"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import { ChartJS } from "@/lib/chartConfig";

const PastYieldPerformance = () => {
  const options = {
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
            return `₦${(context.parsed.y / 1000000).toFixed(1)}M`;
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
        max: 20,
        grid: {
          color: "#F3F4F6",
        },
        ticks: {
          color: "#6B7280",
          font: {
            size: 12,
          },
          callback: function (value) {
            return `${value}M`;
          },
        },
      },
    },
  };

  const data = {
    labels: ["2020", "2021", "2022", "2023", "2024"],
    datasets: [
      {
        label: "Revenue",
        data: [10.5, 7.8, 5.2, 11.2, 14.8],
        backgroundColor: "#007D8B",
        borderColor: "#14B8A6",
        borderWidth: 0,
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="mb-6 space-y-2">
        <h3 className="text-base font-semibold text-gray-900">
          Past Yield Performance Flow
        </h3>
        <p className="text-gray-600 text-sm">Total Gross Revenue (₦)</p>
        <div className="text-lg xl:text-2xl font-bold text-gray-900">
          ₦17,085,800
        </div>
      </div>
      <div className="h-64">
        <Bar options={options} data={data} />
      </div>
    </div>
  );
};

export default PastYieldPerformance;
