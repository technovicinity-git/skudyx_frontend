"use client";

import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { ChevronDown } from "lucide-react";
import { ChartJS } from "@/lib/chartConfig";

const PortfolioPerformance = () => {
  const [showFilter, setShowFilter] = useState(false);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
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
        cornerRadius: 8,
        callbacks: {
          title: function (context) {
            return context[0].label;
          },
          label: function (context) {
            return `$${context.parsed.y.toLocaleString()}K`;
          },
        },
        custom: function (context) {
          // Custom tooltip with bottom arrow
          const tooltipEl = document.getElementById("portfolio-tooltip");
          if (!tooltipEl) {
            const tooltip = document.createElement("div");
            tooltip.id = "portfolio-tooltip";
            tooltip.style.background = "#1E3A8A";
            tooltip.style.color = "#ffffff";
            tooltip.style.borderRadius = "8px";
            tooltip.style.padding = "12px 16px";
            tooltip.style.position = "absolute";
            tooltip.style.pointerEvents = "none";
            tooltip.style.transform = "translate(-50%, -100%)";
            tooltip.style.zIndex = "1000";
            tooltip.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
            document.body.appendChild(tooltip);
          }

          const tooltip = document.getElementById("portfolio-tooltip");
          if (context.opacity === 0) {
            tooltip.style.opacity = "0";
            return;
          }

          const position = context.chart.canvas.getBoundingClientRect();
          const bodyFont = ChartJS.helpers.fontString(14, "bold", "normal");

          tooltip.style.opacity = "1";
          tooltip.style.left = position.left + context.caretX + "px";
          tooltip.style.top = position.top + context.caretY + "px";
          tooltip.style.font = bodyFont;

          const title = context[0].label;
          const value = `$${context[0].parsed.y.toLocaleString()}K`;

          tooltip.innerHTML = `
            <div style="text-align: center;">
              <div style="font-size: 14px; margin-bottom: 4px;">${title}</div>
              <div style="font-size: 16px; font-weight: bold;">${value}</div>
            </div>
            <div style="position: absolute; top: 100%; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid #1E3A8A;"></div>
          `;
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
        max: 100,
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
    elements: {
      point: {
        radius: 0, // Hide points completely
        hoverRadius: 0,
      },
    },
  };

  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Portfolio Value",
        data: [70, 75, 72, 78, 82, 85, 87, 84, 88, 90, 92, 95],
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Portfolio performance
        </h2>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:text-gray-900 hover:border-gray-300 transition-colors cursor-pointer"
        >
          <span className="text-sm font-medium">Filter</span>
          <ChevronDown
            size={16}
            className={`transition-transform ${showFilter ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Chart */}
      <div className="h-64">
        <Line options={options} data={data} />
      </div>
    </div>
  );
};

export default PortfolioPerformance;
