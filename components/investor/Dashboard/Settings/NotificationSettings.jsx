"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";

const NotificationSettings = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState({
    investmentUpdates: true,
    investmentLaunch: true,
    newsletter: true,
    marketing: true,
    pushNotifications: true,
  });

  const handleBack = () => {
    router.back();
  };

  const handleToggle = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const settingsOptions = [
    {
      id: 1,
      title: "Language",
      value: "English",
      icon: "Aa",
      href: "#language",
    },
    {
      id: 2,
      title: "Currency",
      value: "USD",
      icon: "$",
      href: "#currency",
    },
    {
      id: 3,
      title: "Notification settings",
      value: "",
      icon: "⚙️",
      href: "#notifications",
    },
  ];

  const notificationOptions = [
    {
      id: "investmentUpdates",
      title: "Investment updates",
      description:
        "Add extra layer of security by requiring a one time verification code",
      enabled: notifications.investmentUpdates,
    },
    {
      id: "investmentLaunch",
      title: "Investment launch",
      description:
        "Add extra layer of security by requiring a one time verification code",
      enabled: notifications.investmentLaunch,
    },
    {
      id: "newsletter",
      title: "News letter",
      description:
        "Add extra layer of security by requiring a one time verification code",
      enabled: notifications.newsletter,
    },
    {
      id: "marketing",
      title: "Marketing",
      description:
        "Add extra layer of security by requiring a one time verification code",
      enabled: notifications.marketing,
    },
    {
      id: "pushNotifications",
      title: "Enable push notification",
      description:
        "Add extra layer of security by requiring a one time verification code",
      enabled: notifications.pushNotifications,
    },
  ];

  return (
    <div className="">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full mb-6 hover:bg-gray-200 transition-colors"
      >
        <ArrowLeft size={20} className="text-gray-600" />
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#222222] mb-2">Settings</h1>
        <p className="text-gray-600 text-base">
          View and manage your personal details.
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Settings Categories */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 self-start">
          <div className="space-y-4">
            {settingsOptions.map((option) => (
              <div
                key={option.id}
                className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${
                  option.title === "Notification settings"
                    ? "bg-gray-50 border-primary-1"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-600 text-lg">{option.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#222222] text-base">
                      {option.title}
                    </h3>
                    {option.value && (
                      <p className="text-gray-600 text-sm">{option.value}</p>
                    )}
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Notification Settings */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-[#222222] mb-6">
            Notification Settings
          </h2>

          <div className="space-y-4">
            {notificationOptions.map((option) => (
              <div
                key={option.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-[#222222] text-base mb-1">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{option.description}</p>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => handleToggle(option.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-1 focus:ring-offset-2 ${
                      option.enabled ? "bg-primary-1" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        option.enabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
