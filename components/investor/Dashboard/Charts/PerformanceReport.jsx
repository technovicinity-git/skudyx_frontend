"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import { ChartJS } from "@/lib/chartConfig";

const PerformanceReport = ({performanceData}) => {
  // Create striped pattern for the second bar
  const createStripedPattern = () => {
    // Check if we're in the browser environment
    if (typeof window === "undefined" || typeof document === "undefined") {
      return "#FF6B35"; // Fallback color for SSR
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 10;
    canvas.height = 10;

    // Fill with base color
    ctx.fillStyle = "#FF6B35";
    ctx.fillRect(0, 0, 7, 7);

    // Add diagonal stripes
    ctx.strokeStyle = "#FF8A5C";
    ctx.lineWidth = 1;
    ctx.setLineDash([1, 1]);

    for (let i = 0; i < 16; i += 2) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i - 8, 8);
      ctx.stroke();
    }

    return ctx.createPattern(canvas, "repeat");
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "x", // VerticalHorizontal
    plugins: {
      legend: {
        display: false, // We'll create custom legend
      },
      tooltip: {
        enabled: true, // Disable default tooltips
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 15,
        grid: {
          display: false, // Hide grid lines
        },
        ticks: {
          color: "#6B7280",
          font: {
            size: 12,
          },
          callback: function (value) {
            return value;
          },
        },
      },
      y: {
        grid: {
          display: false,
        },
        beginAtZero: true,
        max: 15,
        ticks: {
          display: true, // Show y-axis labels
          color: "#6B7280",
          font: {
            size: 12,
          },
          stepSize: 5,
          callback: function (value) {
            return value;
          },
        },
      },
    },
    elements: {
      bar: {
        borderRadius: 4,
      },
    },
  };

  const data = {
    labels: ["Expected Yield", "Actual Yield"],
    datasets: [
      {
        label: "Yield",
        data: [performanceData?.expectedYield, performanceData?.actualYield], // Both bars with their respective values
        backgroundColor: [
          "#236647", // Dark green for Expected Yield
          createStripedPattern(), // Striped pattern for Actual Yield
        ],
        borderColor: ["#236647", "#FF6B35"],
        borderWidth: 0,
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="">
      {/* <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Performance report
      </h3> */}

      <div className="bg-gray-50 rounded-lg p-4 ">
        {/* Chart Container */}
        <div className="mb-4">
          <div className="h-[300px] relative">
            <Bar options={options} data={data} />
          </div>
        </div>

        {/* Custom Legend */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#236647] rounded"></div>
              <span className="text-sm text-gray-700">Expected Yield</span>
            </div>
            <div className="text-sm font-semibold text-gray-900">{performanceData?.expectedYield} tons</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 bg-[#FF6B35] rounded"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                  45deg,
                  #FF6B35,
                  #FF6B35 2px,
                  #FF8A5C 2px,
                  #FF8A5C 4px
                )`,
                }}
              ></div>
              <span className="text-sm text-gray-700">Actual Yield</span>
            </div>
            <div className="text-sm font-semibold text-gray-900">
              {performanceData?.actualYield} tons
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceReport;
