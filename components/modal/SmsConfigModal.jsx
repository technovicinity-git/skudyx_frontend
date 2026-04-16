"use client";

import { useState } from "react";
import { X } from "lucide-react";
import SettingModalFooter from "./SettingModalFooter";

const SmsConfigModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    smsDriver: "",
    apiUrl: "",
    apiKey: "",
    senderId: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log("Collected Data:", formData);
    // call API here
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      {/* Modal Container */}
      <div className="w-full min-h-[90vh] bg-gray-100 rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between bg-white px-6 py-4 border-b border-gray-200 rounded-t-2xl">
          <h2 className="text-lg sm:text-xl font-semibold">
            SMS Service Configuration
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="bg-white rounded-xl shadow-sm max-w-md mx-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">
                SMS Service Configuration
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  SMS Driver
                </label>
                <input
                  type="text"
                  name="smsDriver"
                  value={formData.smsDriver}
                  onChange={handleChange}
                  placeholder="Enter SMS Driver"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  API URL
                </label>
                <input
                  type="text"
                  name="apiUrl"
                  value={formData.apiUrl}
                  onChange={handleChange}
                  placeholder="Enter API URL"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  API Key
                </label>
                <input
                  type="text"
                  name="apiKey"
                  value={formData.apiKey}
                  onChange={handleChange}
                  placeholder="Enter API Key"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  SMS Sender ID
                </label>
                <input
                  type="text"
                  name="senderId"
                  value={formData.senderId}
                  onChange={handleChange}
                  placeholder="Enter SMS Sender ID"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <SettingModalFooter onCancel={onClose} onSave={handleSave} />
      </div>
    </div>
  );
};

export default SmsConfigModal;
