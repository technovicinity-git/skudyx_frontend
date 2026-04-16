import React from "react";
import { ChartJS } from "@/lib/chartConfig";
import { Doughnut } from "react-chartjs-2";
import Select from "@/components/common/Select";
import { useGetCasePieStats } from "@/hook/case";

const CaseStats = () => {
  const [range, setRange] = React.useState("6m");

  const { casePieStats, isLoading } = useGetCasePieStats(range);

  const progressMapping = (casePieStats || []).reduce(
    (acc, item) => {
      acc[item.status] = item.percentage;
      return acc;
    },
    {
      Resolved: 0,
      Unresolved: 0,
      False: 0,
    },
  );

  const labels = ["Resolved", "False", "Unresolved"];
  const caseStatsOptions = {
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

  return (
    <div className="space-y-6 lg:col-span-2">
      {/* Case Stats */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between gap-2 mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Case Stats</h3>
          {/* <Info size={16} className="text-primary-1" /> */}
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
        <div className="h-64 mb-4">
          <Doughnut options={caseStatsOptions} data={investmentProgressData} />
        </div>
        <div className="flex flex-col sm:flex-col md:flex-col lg:flex-row gap-2 items-center justify-center gap-12">
          <div className="">
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-[#3FCD7F] rounded-full"></div>
              <div className="flex gap-2">
                <p className="font-semibold text-gray-700">Resolved Case</p>
                <span className=" font-semibold text-gray-900">
                  {progressMapping?.Resolved ?? 0}%
                </span>
              </div>
            </div>
          </div>
          <div className="">
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-[#FACF4C] rounded-full"></div>
              <div className="flex gap-2">
                <p className="font-semibold text-gray-700">False Case</p>
                <span className=" font-semibold text-gray-900">
                  {progressMapping?.False ?? 0}%
                </span>
              </div>
            </div>
          </div>
          <div className="">
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-[#E94C7B] rounded-full"></div>
              <div className="flex gap-2">
                <p className="font-semibold  text-gray-700">Unresolved Case</p>
                <span className=" font-semibold text-gray-900">
                  {progressMapping?.Unresolved ?? 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStats;
