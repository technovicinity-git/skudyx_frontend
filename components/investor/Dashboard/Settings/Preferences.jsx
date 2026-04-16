"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import {
  useCreateNotificationPreference,
  useGetNotificationPreference,
} from "@/hook/setting";
import { useToast } from "@/lib/Provider/toastProvider";
import Loader from "@/components/loader/Loader";

const Preferences = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState("Arabic");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [selectedOption, setSelectedOption] = useState(1); // 1 for Language, 2 for Currency, 3 for Notifications

  const { notificationPreference, isLoading: isFetching } =
    useGetNotificationPreference();

  const {
    createNotificationPreference,
    isLoading: isCreating,
    errorMessage,
  } = useCreateNotificationPreference();

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    investmentUpdates: false,
    investmentLaunch: false,
    newsletter: false,
    marketing: false,
    pushNotifications: false,
  });

  useEffect(() => {
    if (notificationPreference) {
      setNotificationSettings({
        investmentUpdates: notificationPreference?.investmentUpdates,
        investmentLaunch: notificationPreference?.investmentLaunch,
        newsletter: notificationPreference?.newsletter,
        marketing: notificationPreference?.marketing,
        pushNotifications: notificationPreference?.pushNotifications,
      });
    }
  }, [notificationPreference]);

  const handleBack = () => {
    router.back();
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
  };

  const handleCurrencySelect = (currency) => {
    setSelectedCurrency(currency);
  };

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
  };

  const handleNotificationToggle = (setting) => {
    setNotificationSettings((prev) => {
      const updated = {
        ...prev,
        [setting]: !prev[setting],
      };

      // Call API with the new state
      createNotificationPreference(
        { notifications: updated },
        {
          onSuccess: () => {
            showToast("Notification preferences updated", "success", "Success");
          },
          onError: () => {
            showToast(
              errorMessage || "Failed to update preferences",
              "error",
              "Error"
            );
          },
        }
      );

      return updated;
    });
  };

  const settingsOptions = [
    {
      id: 1,
      title: "Language",
      value: "English",
      icon: "Aa",
    },
    {
      id: 2,
      title: "Currency",
      value: "USD",
      icon: "$",
    },
    {
      id: 3,
      title: "Notification settings",
      value: "",
      icon: "⚙️",
    },
  ];

  const languageOptions = [
    {
      id: "arabic",
      name: "Arabic",
      flag: "🇦🇪",
      selected: selectedLanguage === "Arabic",
    },
    {
      id: "english",
      name: "English",
      flag: "🇬🇧",
      selected: selectedLanguage === "English",
    },
  ];

  const currencyOptions = [
    {
      code: "USD",
      name: "US Dollar",
      flag: "🇺🇸",
      selected: selectedCurrency === "USD",
    },
    // {
    //   code: "EUR",
    //   name: "Euro",
    //   flag: "🇪🇺",
    //   selected: selectedCurrency === "EUR",
    // },
    // {
    //   code: "AED",
    //   name: "UAE dirham",
    //   flag: "🇦🇪",
    //   selected: selectedCurrency === "AED",
    // },
    // {
    //   code: "ARS",
    //   name: "Argentine Peso",
    //   flag: "🇦🇷",
    //   selected: selectedCurrency === "ARS",
    // },
    // {
    //   code: "AUD",
    //   name: "Australian Dollar",
    //   flag: "🇦🇺",
    //   selected: selectedCurrency === "AUD",
    // },
    // {
    //   code: "BDT",
    //   name: "Bangladeshi Taka",
    //   flag: "🇧🇩",
    //   selected: selectedCurrency === "BDT",
    // },
    // {
    //   code: "BGN",
    //   name: "Bulgarian Lev",
    //   flag: "🇧🇬",
    //   selected: selectedCurrency === "BGN",
    // },
    // {
    //   code: "BHD",
    //   name: "Bahrani Dinar",
    //   flag: "🇧🇭",
    //   selected: selectedCurrency === "BHD",
    // },
    // {
    //   code: "BOB",
    //   name: "Bolivian Boliviano",
    //   flag: "🇧🇴",
    //   selected: selectedCurrency === "BOB",
    // },
    // {
    //   code: "BRL",
    //   name: "Brazilian Real",
    //   flag: "🇧🇷",
    //   selected: selectedCurrency === "BRL",
    // },
    // {
    //   code: "CAD",
    //   name: "Canadian Dollar",
    //   flag: "🇨🇦",
    //   selected: selectedCurrency === "CAD",
    // },
    // {
    //   code: "CHF",
    //   name: "Swiss Franc",
    //   flag: "🇨🇭",
    //   selected: selectedCurrency === "CHF",
    // },
    // {
    //   code: "CNY",
    //   name: "Chinese Yuan",
    //   flag: "🇨🇳",
    //   selected: selectedCurrency === "CNY",
    // },
    // {
    //   code: "COP",
    //   name: "Colombian Peso",
    //   flag: "🇨🇴",
    //   selected: selectedCurrency === "COP",
    // },
  ];

  const notificationOptions = [
    {
      id: "investmentUpdates",
      title: "Investment updates",
      description:
        "Add extra layer of security by requiring a one time verification code",
      enabled: notificationSettings.investmentUpdates,
    },
    {
      id: "investmentLaunch",
      title: "Investment launch",
      description:
        "Add extra layer of security by requiring a one time verification code",
      enabled: notificationSettings.investmentLaunch,
    },
    {
      id: "newsletter",
      title: "News letter",
      description:
        "Add extra layer of security by requiring a one time verification code",
      enabled: notificationSettings.newsletter,
    },
    {
      id: "marketing",
      title: "Marketing",
      description:
        "Add extra layer of security by requiring a one time verification code",
      enabled: notificationSettings.marketing,
    },
    {
      id: "pushNotifications",
      title: "Enable push notification",
      description:
        "Add extra layer of security by requiring a one time verification code",
      enabled: notificationSettings.pushNotifications,
    },
  ];

  const renderRightPanel = () => {
    switch (selectedOption) {
      case 1:
        return (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-[#222222] mb-6">
              Select Language
            </h2>

            <div className="space-y-4">
              {languageOptions.map((language) => (
                <div
                  key={language.id}
                  onClick={() => handleLanguageSelect(language.name)}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-6 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs font-bold">{language.flag}</span>
                    </div>
                    <span className="font-medium text-[#222222]">
                      {language.name}
                    </span>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center">
                    {language.selected ? (
                      <div className="w-3 h-3 bg-primary-1 rounded-full"></div>
                    ) : (
                      <div className="w-3 h-3 bg-white rounded-full border border-gray-300"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-[#222222] mb-6">
              Select Currency
            </h2>

            <div className="space-y-4 overflow-y-auto">
              {currencyOptions.map((currency) => (
                <div
                  key={currency.code}
                  onClick={() => handleCurrencySelect(currency.code)}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-6 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs font-bold">{currency.flag}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-[#222222] text-base">
                        {currency.code}
                      </div>
                      <div className="text-gray-600 text-sm">
                        {currency.name}
                      </div>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center">
                    {currency.selected ? (
                      <div className="w-3 h-3 bg-primary-1 rounded-full"></div>
                    ) : (
                      <div className="w-3 h-3 bg-white rounded-full border border-gray-300"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-[#222222] mb-6">
              Notification Settings
            </h2>
            {isFetching ? (
              <Loader />
            ) : (
              <div className="space-y-4">
                {notificationOptions.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold text-[#222222] text-base">
                        {option.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {option.description}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => handleNotificationToggle(option.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          option.enabled ? "bg-primary-1" : "bg-gray-300"
                        }`}
                        disabled={isCreating}
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
            )}
          </div>
        );

      default:
        return null;
    }
  };

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
      <div className="flex items-start justify-between gap-6">
        {/* Left Column - Settings Categories */}
        <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm p-6 sticky top-20">
          <div className="space-y-4">
            {settingsOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${
                  selectedOption === option.id
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

        {/* Right Column - Dynamic Content */}
        <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm">
          {renderRightPanel()}
        </div>
      </div>
    </div>
  );
};

export default Preferences;
