import Select from "@/components/common/Select";
import { useGetCaseStats } from "@/hook/case";
import React from "react";

const CaseSummary = () => {
  const [caseSummaryRange, setCaseSummaryRange] = React.useState("6m");

  const { caseStats, isLoading: caseStatsLoading } =
    useGetCaseStats(caseSummaryRange);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Case Summary</h2>

        <Select
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700"
          defaultValue="6m"
          id="id-type"
          name="id-type"
          value={caseSummaryRange}
          onChange={(e) => setCaseSummaryRange(e.target.value)}
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="6m">Last 6 Months</option>
          <option value="1y">Last 1 Year</option>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
        <SummaryCard title="Pending Cases" value={caseStats?.Pending} />
        <SummaryCard title="In Progress Cases" value={caseStats?.In_Progress} />
        <SummaryCard title="Escalated Cases" value={caseStats?.Escalated} />
        <SummaryCard title="Resolved Cases" value={caseStats?.Resolved} />
        <SummaryCard title="Unresolved Cases" value={caseStats?.Unresolved} />
        <SummaryCard title="False Cases" value={caseStats?.False} />
        <SummaryCard title="Basic Cases" value={caseStats?.Basic ?? 0} />
      </div>
    </div>
  );
};

export default CaseSummary;

const SummaryCard = ({ title, value, highlight }) => {
  return (
    <div
      className={`border border-gray-200 rounded-xl p-5 transition hover:shadow-md ${
        highlight ? "bg-blue-600 text-white" : "bg-white"
      }`}
    >
      <div
        className={`font-semibold ${highlight ? "text-blue-100" : "text-gray-500"}`}
      >
        {title}
      </div>

      <div className="text-3xl font-bold mt-2">{value}</div>
    </div>
  );
};
