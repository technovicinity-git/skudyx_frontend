"use client";
import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { ChartJS } from "@/lib/chartConfig";
import Select from "@/components/common/Select";
import { useGetUserStats } from "@/hook/user";

const ActiveUser = () => {
  const [range, setRange] = React.useState("6m");

  const { userStats, data, isLoading } = useGetUserStats(range);
  // const maxTotal = useMemo(() => {
  //   if (!userStats || userStats.length === 0) return 0;
  //   return Math.max(...userStats.map((stat) => stat.total));
  // }, [userStats]);

  const maxTotal = data?.data?.total_active_users || 0;

  const activeUserData = useMemo(() => {
    if (!userStats || userStats?.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    const labels = userStats.map((stat) => stat.base);
    const data = userStats.map((stat) => stat.total);

    return {
      labels,
      datasets: [
        {
          label: "Active Users",

          data,
          borderColor: "#6AD8BE",
          backgroundColor: "rgba(106, 216, 190, 0.2)",
          tension: 0.4,
          fill: true,

          // 👇 base points (small)
          pointRadius: 0,
          pointHoverRadius: 8,

          // 👇 active point styling
          pointHoverBackgroundColor: "#ffffff",
          pointHoverBorderColor: "#6AD8BE",
          pointHoverBorderWidth: 3,

          // 👇 smooth line
          borderWidth: 3,
        },
      ],
    };
  }, [userStats]);

  const activeUserOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index",
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#ffffff",
        titleColor: "#6B7280",
        bodyColor: "#111827",
        borderColor: "#E5E7EB",
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          title: (ctx) => `${ctx[0].label} Users`,
          label: (ctx) => `${ctx.parsed.y}`,
          // afterLabel: () => "▲ 3% vs last month",
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
          stepSize: 1, // 👈 forces steps of 1
          precision: 0, // 👈 removes decimal precision
          font: {
            size: 12,
          },
          callback: function (value) {
            return `${value}`;
          },
        },
      },
    },
  };
  const hoverLinePlugin = {
    id: "hoverLine",
    afterDatasetsDraw(chart) {
      const { ctx, tooltip, chartArea } = chart;

      if (tooltip?._active?.length) {
        const x = tooltip._active[0].element.x;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, chartArea.top);
        ctx.lineTo(x, chartArea.bottom);
        ctx.lineWidth = 6;
        ctx.strokeStyle = "rgba(106, 216, 190, 0.15)";
        ctx.stroke();
        ctx.restore();
      }
    },
  };
  return (
    <div className="bg-white h-full rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Active Users</h3>
        </div>

        <div className="flex space-x-2">
          <div className="flex items-center gap-2">
            <Select
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700"
              defaultValue="6m"
              id="id-type"
              name="id-type"
              value={range}
              onChange={(e) => setRange(e.target.value)}
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last 1 Year</option>
            </Select>
          </div>
        </div>
      </div>
      <div className="h-64">
        {isLoading ? (
          <p>Loading chart...</p>
        ) : (
          <Line
            options={activeUserOptions}
            data={activeUserData}
            plugins={[hoverLinePlugin]}
          />
        )}
      </div>
    </div>
  );
};

export default ActiveUser;
