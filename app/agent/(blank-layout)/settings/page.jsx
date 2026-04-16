"use client";
import React, { useState } from "react";
import { RightArrowIcon } from "@/public/assets/icons/icons";
import SmsConfigModal from "@/components/modal/SmsConfigModal";
import EmailConfigModal from "@/components/modal/EmailConfigModal";
import PrivacyPolicyModal from "@/components/modal/PrivacyPolicyModal";
import TermsModal from "@/components/modal/TermsModal";

const page = () => {
  const [activeModal, setActiveModal] = useState(null);

  const settings = {
    title: "Manage Settings",
    description: "Manage your application settings and preferences.",
    items: [
      {
        name: "SMS Service Configuration",
        id: "sms",
      },
      {
        name: "Email Service Configuration",
        id: "email",
      },
      {
        name: "Privacy Policy",
        id: "privacy",
      },
      {
        name: "Terms of Use",
        id: "terms",
      },
    ],
  };

  const handleClose = () => {
    setActiveModal(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6">
          <h1 className="text-2xl sm:text-3xl font-semibold">
            {settings.title}
          </h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            {settings.description}
          </p>
        </div>

        {/* Settings List */}
        <div>
          {settings.items.map((item, index) => (
            <div
              className="flex items-center justify-between border-t border-gray-200 p-5 hover:bg-gray-50 transition duration-200 cursor-pointer"
              onClick={() => setActiveModal(item.id)}
              key={index}
            >
              <span className="font-medium text-gray-800">{item.name}</span>
              <span className="text-gray-400 text-lg">{RightArrowIcon}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Conditionally Render Modals */}
      {activeModal === "sms" && <SmsConfigModal isOpen onClose={handleClose} />}

      {activeModal === "email" && (
        <EmailConfigModal isOpen onClose={handleClose} />
      )}
      {activeModal === "privacy" && (
        <PrivacyPolicyModal isOpen onClose={handleClose} />
      )}
      {activeModal === "terms" && <TermsModal isOpen onClose={handleClose} />}
    </div>
  );
};

export default page;
