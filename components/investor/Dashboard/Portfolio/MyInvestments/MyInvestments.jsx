"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import OngoingInvestments from "./OngoingInvestments";
import MaturedInvestments from "./MaturedInvestments";
import { useRouter } from "next/navigation";

const MyInvestmentsBody = () => {
  const router = useRouter();
  // Dynamic tabs configuration
  const tabs = [
    {
      id: "ongoing",
      label: "Ongoing",
      component: OngoingInvestments,
    },
    {
      id: "matured",
      label: "Matured",
      component: MaturedInvestments,
    },
    // You can easily add more tabs here
    // {
    //   id: "pending",
    //   label: "Pending",
    //   component: PendingInvestments,
    // },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);

  // Get the active component
  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          onClick={() => router.back()}
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back to Portfolio</span>
        </button>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
        My Investments.
      </h1>

      {/* Dynamic Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-2 text-base font-medium cursor-pointer transition ${
                activeTab === tab.id
                  ? "text-gray-900 border-b-2 bg-white border-primary-1 text-shadow-sm "
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Tab Content */}
      <div className="mt-6">{ActiveComponent && <ActiveComponent />}</div>
    </div>
  );
};

export default MyInvestmentsBody;
