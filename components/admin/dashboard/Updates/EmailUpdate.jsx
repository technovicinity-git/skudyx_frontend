"use client";
import React, { useState } from "react";
import Button from "@/components/common/Button";
import RichTextEditor from "@/components/common/RichTextEditor";

const EmailUpdateBody = () => {
  const [subject, setSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [recipientType, setRecipientType] = useState("all");
  const [selectedUserGroup, setSelectedUserGroup] = useState("");

  const handleSendUpdate = () => {
    console.log("Sending email update:", {
      subject,
      emailBody,
      recipientType,
      selectedUserGroup,
    });
  };

  const CustomCheckbox = ({ id, checked, onChange, label, description }) => (
    <div className="flex items-start gap-3">
      <div className="relative">
        <input
          type="radio"
          id={id}
          name="recipient"
          value={id}
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <label
          htmlFor={id}
          className={`w-5 h-5 rounded-full border-2 cursor-pointer flex items-center justify-center transition-colors ${
            checked
              ? "border-green-600 bg-green-600"
              : "border-gray-300 hover:border-priring-primary-1"
          }`}
        >
          {checked && <div className="w-2 h-2 bg-white rounded-full"></div>}
        </label>
      </div>
      <div className="flex-1">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-900 cursor-pointer"
        >
          {label}
        </label>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-5 md:mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Updates</h1>
        <div className="flex items-center gap-4">
          <Button
            onClick={handleSendUpdate}
            className="bg-[#067647] hover:bg-[#055C3A] text-white px-6 py-2.5"
          >
            Send update
          </Button>
        </div>
      </div>

      {/* Main Content - Two Blocks */}
      <div className="space-y-6">
        {/* Block 1: Form Fields */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            {/* Subject Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject:
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Balabulu"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-1 focus:border-transparent"
              />
            </div>

            {/* Email Body Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Email body:
              </label>
              <RichTextEditor
                value={emailBody}
                onChange={setEmailBody}
                placeholder="BB Agency is a strategic partner for fast-growing tech companies in need of a scalable website with modular CMS, a design system, and future-proof brand identity."
                className="min-h-[400px]"
              />
            </div>
          </div>
        </div>

        {/* Block 2: Recipient Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-start justify-between gap-8">
          <label className="block text-sm font-medium text-gray-700 mb-4 flex-1 max-w-[200px]">
            Recipient
          </label>

          <div className="space-y-4 flex-1">
            {/* All users option */}
            <CustomCheckbox
              id="all"
              checked={recipientType === "all"}
              onChange={(e) => setRecipientType(e.target.value)}
              label="All users"
              description="Send update to all emails"
            />

            {/* Select contacts option */}
            <div className="space-y-3">
              <CustomCheckbox
                id="selected"
                checked={recipientType === "selected"}
                onChange={(e) => setRecipientType(e.target.value)}
                label="Select contacts"
                description="Send update to selected user group"
              />

              {/* User Group Dropdown - only show when "Select contacts" is chosen */}
              {recipientType === "selected" && (
                <div className="ml-8">
                  <div className="relative">
                    <select
                      value={selectedUserGroup}
                      onChange={(e) => setSelectedUserGroup(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-1 focus:border-transparent bg-gray-50 appearance-none outline-0"
                    >
                      <option value="">Select user group</option>
                      <option value="investors">Investors</option>
                      <option value="farmers">Farmers</option>
                      <option value="corporate-investors">
                        Corporate Investors
                      </option>
                      <option value="all-customers">All Customers</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailUpdateBody;
